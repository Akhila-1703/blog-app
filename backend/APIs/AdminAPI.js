// Import Express module to instantiate router
import exp from "express";
// Import token verification middleware for admin role checking
import { verifyToken } from "../middlewares/verifyToken.js";
// Import administrative controller functions
import {
  getAdminArticles,
  blockUser,
  unblockUser,
  updateArticleStatus,
  getAdminStats,
  getAllUsers,
} from "../controllers/adminController.js";

// Instantiate Express router for Admin endpoints
export const adminRoute = exp.Router();

// Route: Fetch all articles (including inactive ones)
adminRoute.get("/articles", verifyToken("ADMIN"), getAdminArticles);

// Route: Block a target user account
adminRoute.put("/block-user", verifyToken("ADMIN"), blockUser);

// Route: Unblock a target user account
adminRoute.put("/unblock-user", verifyToken("ADMIN"), unblockUser);

// Route: Toggle an article active status (restore or soft delete)
adminRoute.put("/article-status", verifyToken("ADMIN"), updateArticleStatus);

// Route: Retrieve analytical and counts data
adminRoute.get("/stats", verifyToken("ADMIN"), getAdminStats);

// Route: Fetch all registered users (excluding password details)
adminRoute.get("/users", verifyToken("ADMIN"), getAllUsers);
