// Import Express module to instantiate router
import exp from "express";
// Import token verification middleware for access control
import { verifyToken } from "../middlewares/verifyToken.js";
// Import Multer upload middleware configuration for managing file buffers
import { upload } from "../config/multer.js";
// Import user controller functions to map incoming requests to handling logic
import {
  registerUser,
  getAllArticles,
  getArticleById,
  addComment,
} from "../controllers/userController.js";

// Instantiate Express router for User endpoints
export const userRoute = exp.Router();

// Route: Register new user (includes single file upload capability under field profileImageUrl)
userRoute.post("/users", upload.single("profileImageUrl"), registerUser);

// Route: Get all active articles (Accessible only to logged-in users with role USER)
userRoute.get("/articles", verifyToken("USER"), getAllArticles);

// Route: Get article by ID (Accessible to USER, AUTHOR, and ADMIN roles)
userRoute.get("/article/:id", verifyToken("USER", "AUTHOR", "ADMIN"), getArticleById);

// Route: Add a comment to an article (Accessible only to logged-in users with role USER)
userRoute.put("/articles", verifyToken("USER"), addComment);