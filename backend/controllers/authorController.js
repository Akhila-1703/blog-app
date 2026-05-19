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
 * Controller to register an author profile.
 * Handles Cloudinary upload and rolls back media if user generation fails.
 */
export const registerAuthor = asyncHandler(async (req, res) => {
  // Variable to store Cloudinary media upload response
  let cloudinaryResult;
  try {
    // Extract parsed user fields from request body payload
    let userObj = req.body;

    // Check if the request contains a multipart file uploaded via Multer
    if (req.file) {
      // Upload the buffer to Cloudinary and await result
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Call service to register passing user fields, role: AUTHOR, and image secure URL
    const newUserObj = await register({
      ...userObj,
      role: "AUTHOR",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    // Respond with a 201 Created and the new author data (excluding password)
    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    // Rollback: Destroy uploaded media on Cloudinary if registration fails
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    // Forward the error to Express's global handler via async wrapper rejection
    throw err;
  }
});

/**
 * Controller to create a new article.
 * Automatically attaches the authorized author's MongoDB ObjectId as the author relation.
 */
export const createArticle = asyncHandler(async (req, res) => {
  // Merge the request body payload with the logged-in user's ObjectId
  const article = {
    ...req.body,
    author: req.user._id
  };

  // Instantiate Mongoose document and save it to the database
  const newArticleDoc = new ArticleModel(article);
  const createdArticleDoc = await newArticleDoc.save();

  // Respond with a 201 Created status and the new article payload
  res.status(201).json({
    message: "article created",
    payload: createdArticleDoc
  });
});

/**
 * Controller to fetch all articles belonging to the authorized author.
 * Filters articles by the author's user ID and populates profile details.
 */
export const getAuthorArticles = asyncHandler(async (req, res) => {
  // Find all articles where the author field matches the authenticated user ID
  const articles = await ArticleModel
    .find({ author: req.user._id })
    // Populate the author relationship, returning only selected details
    .populate("author", "firstName lastName email profileImageUrl");

  // Respond with 200 OK status and the articles list payload
  res.status(200).json({
    message: "articles",
    payload: articles
  });
});

/**
 * Controller to edit an existing article's metadata.
 * Performs database query checks to guarantee that the article belongs to the author.
 */
export const editArticle = asyncHandler(async (req, res) => {
  // Extract user ID of the authorized author
  const author = req.user._id;
  // Destructure required fields from request body
  const { articleId, title, category, content } = req.body;

  // Search the database for the article matching both ID and author ownership
  const articleOfDB = await ArticleModel.findOne({
    _id: articleId,
    author: author
  });

  // Return a 404 error if article is not found or does not belong to the author
  if (!articleOfDB) {
    return res.status(404).json({
      message: "Article not found"
    });
  }

  // Update article title, category, and content in the database
  const updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    {
      new: true, // Returns the modified document
      runValidators: true // Enforces Mongoose schema validations
    }
  );

  // Respond with 200 OK and the updated article payload
  res.status(200).json({
    message: "article updated",
    payload: updatedArticle
  });
});

/**
 * Controller to toggle an article's active flag (soft delete or restore).
 * Performs ownership authorization checks and checks current active state.
 */
export const toggleArticleStatus = asyncHandler(async (req, res) => {
  // Extract article ID parameter from request parameters and status from request body
  const { id } = req.params;
  const { isArticleActive } = req.body;

  // Fetch the article details from the database
  const article = await ArticleModel.findById(id);

  // Return a 404 if article doesn't exist
  if (!article) {
    return res.status(404).json({
      message: "Article not found"
    });
  }

  // Authorization check: Verify that the author owns the article being modified
  if (
    req.user.role === "AUTHOR" &&
    article.author.toString() !== req.user._id
  ) {
    return res.status(403).json({
      message: "Forbidden. You can only modify your own articles"
    });
  }

  // State verification: check if article is already in the target state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message: `Article is already ${isArticleActive ? "active" : "deleted"}`
    });
  }

  // Set the new status flag and save the document
  article.isArticleActive = isArticleActive;
  await article.save();

  // Respond with 200 OK and appropriate descriptive message
  res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
    payload: article
  });
});
