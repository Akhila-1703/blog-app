// Import Express module to instantiate router
import exp from "express";
// Import token verification middleware for author role checking
import { verifyToken } from "../middlewares/verifyToken.js";
// Import Multer upload middleware configuration for managing file buffers
import { upload } from "../config/multer.js";
// Import author controller handlers
import {
  registerAuthor,
  createArticle,
  getAuthorArticles,
  editArticle,
  toggleArticleStatus,
} from "../controllers/authorController.js";

// Instantiate Express router for Author endpoints
export const authorRoute = exp.Router();

// Route: Register new author (Public endpoint with media profile image upload)
authorRoute.post("/users", upload.single("profileImageUrl"), registerAuthor);

// Route: Create new article (Restricted to AUTHOR role)
authorRoute.post("/articles", verifyToken("AUTHOR"), createArticle);

// Route: Read all articles created by the authenticated author
authorRoute.get("/articles", verifyToken("AUTHOR"), getAuthorArticles);

// Route: Update an existing article's data fields
authorRoute.put("/articles", verifyToken("AUTHOR"), editArticle);

// Route: Soft delete or restore an article
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), toggleArticleStatus);