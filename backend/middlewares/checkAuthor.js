// Import the User Model to perform database queries on users/authors
import { UserTypeModel } from "../models/UserModel.js";
// Import mongoose to validate ObjectId operations
import mongoose from "mongoose";

/**
 * Verification Middleware: Confirms that the target author ID
 * is valid, registered in the database, holds the role 'AUTHOR', and is active.
 */
export const checkAuthor = async (req, res, next) => {
  try {
    // Extract the author ID from the request body or URL route parameters
    const aid = req.body?.author || req.params.authorId;

    // Validate that the ID is present and not a string "undefined"
    if (!aid || aid === "undefined") {
      return res.status(400).json({ message: "Author ID is required" });
    }

    // Search the database for the author profile matching the ID
    const author = await UserTypeModel.findById(aid);

    // Return 404 if the author record does not exist
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Verify that the user has the AUTHOR role
    if (author.role !== "AUTHOR") {
      return res.status(403).json({ message: "User is not an author" });
    }

    // Verify that the author's account status is currently active
    if (!author.isActive) {
      return res.status(403).json({ message: "Author account is not active" });
    }

    // Proceed to the next step in the request pipeline
    next();
  } catch (err) {
    // Capture database errors and pass them to the global Express handler
    next(err);
  }
};
