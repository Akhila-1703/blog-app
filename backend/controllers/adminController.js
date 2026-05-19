// Import the Article Model to perform database queries on articles
import { ArticleModel } from "../models/ArticleModel.js";
// Import the User Model to perform database queries on users
import { UserTypeModel } from "../models/UserModel.js";
// Import our custom asyncHandler to capture rejected promises cleanly
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Controller to fetch all articles for the administrator dashboard.
 * Administrators have access to all articles (both active and inactive).
 */
export const getAdminArticles = asyncHandler(async (req, res) => {
  // Query all articles without any status filters
  const articles = await ArticleModel.find();
  
  // Respond with a 200 OK and the full articles payload
  res.status(200).json({
    message: "All articles fetched",
    payload: articles
  });
});

/**
 * Controller to block an active user.
 * Includes security protection preventing an admin from blocking their own account.
 */
export const blockUser = asyncHandler(async (req, res) => {
  // Extract target user ID to block from the request body payload
  const { userId } = req.body;

  // Security Verification: Prevent admin from blocking themselves
  if (req.user._id === userId) {
    return res.status(400).json({
      message: "Admin cannot block own account"
    });
  }

  // Input Validation: Ensure userId parameter is provided in the request
  if (!userId) {
    return res.status(400).json({
      message: "UserId not found"
    });
  }

  // Find the target user that is currently active in the database
  const blockedUser = await UserTypeModel.findOne({
    _id: userId,
    isActive: true
  });

  // Return a 404 error if user doesn't exist or is already blocked
  if (!blockedUser) {
    return res.status(404).json({
      message: "User not found or already blocked"
    });
  }

  // Update the target user's status to false (blocked)
  await UserTypeModel.findByIdAndUpdate(userId, {
    $set: { isActive: false }
  });

  // Respond with 200 OK showing success
  res.status(200).json({
    message: "User is blocked"
  });
});

/**
 * Controller to unblock a blocked user.
 * Restores account status allowing them to log back in.
 */
export const unblockUser = asyncHandler(async (req, res) => {
  // Extract target user ID to unblock from request body
  const { userId } = req.body;

  // Input Validation: Ensure target userId parameter is present
  if (!userId) {
    return res.status(400).json({
      message: "UserId not found"
    });
  }

  // Find the target user that is currently blocked (isActive: false)
  const blockedUser = await UserTypeModel.findOne({
    _id: userId,
    isActive: false
  });

  // Return 404 if user doesn't exist or is already active
  if (!blockedUser) {
    return res.status(404).json({
      message: "User not found or already active"
    });
  }

  // Update the user's status back to active
  await UserTypeModel.findByIdAndUpdate(userId, {
    $set: { isActive: true }
  });

  // Respond with 200 OK showing success
  res.status(200).json({
    message: "User is unblocked"
  });
});

/**
 * Controller to toggle an article's active state.
 * Allows administrators to either restore a soft-deleted article or soft-delete an active one.
 */
export const updateArticleStatus = asyncHandler(async (req, res) => {
  // Extract article ID and desired active boolean state from request body
  const { articleId, isArticleActive } = req.body;

  // Locate the article and set its active flag in the database
  const updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { isArticleActive }
    },
    { new: true } // Returns the modified document
  );

  // Return status 200 with appropriate descriptive message
  res.status(200).json({
    message: isArticleActive ? "Article restored" : "Article deleted",
    payload: updatedArticle
  });
});

/**
 * Controller to aggregate site analytics and statistics for the admin dashboard dashboard.
 * Counts total standard users, author profiles, and active vs inactive articles.
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  // Count the number of active users matching the role USER
  const totalUsers = await UserTypeModel.countDocuments({
    role: "USER"
  });

  // Count the number of active users matching the role AUTHOR
  const totalAuthors = await UserTypeModel.countDocuments({
    role: "AUTHOR"
  });

  // Count the total number of articles in the system
  const totalArticles = await ArticleModel.countDocuments();

  // Count the number of articles that are currently active
  const activeArticles = await ArticleModel.countDocuments({
    isArticleActive: true
  });

  // Respond with 200 OK and statistical payloads
  res.status(200).json({
    payload: {
      totalUsers,
      totalAuthors,
      totalArticles,
      activeArticles
    }
  });
});

/**
 * Controller to fetch all registered users for user administration.
 * Excludes user password fields for security.
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  // Retrieve all user records from database, omitting password hashes
  const users = await UserTypeModel.find().select("-password");

  // Respond with a 200 OK status and users list
  res.status(200).json({
    message: "Users fetched successfully",
    payload: users
  });
});
