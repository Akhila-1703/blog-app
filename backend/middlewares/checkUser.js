// Import the User Model to perform database queries on users
import { UserTypeModel } from "../models/UserModel.js";

/**
 * Verification Middleware: Confirms that the target user ID
 * is valid, registered in the database, holds the role 'USER', and is active.
 */
export const checkUser = async (req, res, next) => {
  try {
    // Extract the user ID from the request body or URL parameters
    let aid = req.body?.user || req.params.userId;

    // Search the database for the user record matching the ID
    const user = await UserTypeModel.findById(aid);

    // Return a 401 Unauthorized response if the user does not exist in database
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    // Verify that the user holds the USER role
    if (user.role !== "USER") {
      return res.status(403).json({ message: "NOT a User" });
    }

    // Verify that the user's account status is currently active (unblocked)
    if (!user.isActive) {
      return res.status(403).json({ message: "User account is not active" });
    }

    // Proceed to the next step in the request pipeline
    next();
  } catch (err) {
    // Forward unexpected database errors to Express global handler
    next(err);
  }
};