// Import the service registration function for saving users
import { register } from "../services/authService.js";
// Import the Article Model to perform database queries on articles
import { ArticleModel } from "../models/ArticleModel.js";
// Import the core Cloudinary instance for image media management
import cloudinary from "../config/cloudinary.js";
// Import the Cloudinary upload utility to process memory buffers to cloud assets
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
// Import our custom asyncHandler to capture rejected promises cleanly
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Controller to register a standard user.
 * Performs Cloudinary media uploads and handles rollbacks if database insert fails.
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  // Variable to store the Cloudinary upload response object
  let cloudinaryResult;
  try {
    // Extract the parsed JSON body payload containing user fields
    let userObj = req.body;

    // Check if the request contains a multipart file buffer uploaded via Multer
    if (req.file) {
      // Upload the buffer to Cloudinary and await the result
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Call the authService's register method passing user data, role, and the profile image URL
    const newUserObj = await register({
      ...userObj,
      role: "USER",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    // Respond with a 201 Created status and the newly created user object (excluding password)
    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    // In case registration fails, verify if an image was uploaded to Cloudinary
    if (cloudinaryResult?.public_id) {
      // Rollback and destroy the uploaded image asset from Cloudinary to avoid storage leaks
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    // Re-throw the error so that the asyncHandler catches and routes it to global error handler
    throw err;
  }
});

/**
 * Controller to read all active articles in the database.
 * Filters by active status and populates author details.
 */
export const getAllArticles = asyncHandler(async (req, res) => {
  // Query the database for articles where isArticleActive is true
  const articles = await ArticleModel
    .find({ isArticleActive: true })
    // Populate the author relationship, returning only selected fields
    .populate("author", "firstName lastName email profileImageUrl");

  // Respond with a 200 OK and the articles list payload
  res.status(200).json({
    message: "all articles",
    payload: articles
  });
});

/**
 * Controller to fetch a single active article by its ObjectId.
 * Populates author information and user info on the nested comment items.
 */
export const getArticleById = asyncHandler(async (req, res) => {
  // Extract the article ID from the URL parameters
  const { id } = req.params;
  
  // Find article by ID ensuring it is active, and populate related author and user comment profiles
  const article = await ArticleModel.findOne({ _id: id, isArticleActive: true })
    .populate("author", "firstName lastName email profileImageUrl")
    .populate("comments.user", "firstName lastName profileImageUrl");

  // If the article is null or does not exist, return a 404 Not Found response
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // Respond with a 200 OK and the single article document payload
  res.status(200).json({
    message: "article found",
    payload: article
  });
});

/**
 * Controller to add a comment to an active article.
 * Validates comment content and appends the comment to the nested array.
 */
export const addComment = asyncHandler(async (req, res) => {
  // Destructure the target article ID and the comment body from request payload
  const { articleId, comment } = req.body;

  // Validation: Check if comment is absent, empty, or consists solely of white spaces
  if (!comment || !comment.trim()) {
    return res.status(400).json({
      message: "Comment cannot be empty"
    });
  }

  // Retrieve the authorized user's MongoDB ObjectId attached during verifyToken middleware execution
  const userId = req.user._id;

  // Update the article by pushing a new comment object into the comments array
  const articleWithComment = await ArticleModel.findOneAndUpdate(
    {
      _id: articleId,
      isArticleActive: true
    },
    {
      $push: {
        comments: {
          user: userId,
          comment
        }
      }
    },
    {
      new: true, // Returns the newly updated document rather than the original one
      runValidators: true // Enforces Mongoose schema validation guidelines during update
    }
  ).populate("comments.user", "firstName lastName");

  // If the article wasn't found or is currently soft-deleted, return 404
  if (!articleWithComment) {
    return res.status(404).json({
      message: "Article not found or inactive"
    });
  }

  // Respond with a 200 OK and the updated article document payload containing the new comment
  res.status(200).json({
    message: "Comment added successfully",
    payload: articleWithComment,
  });
});
