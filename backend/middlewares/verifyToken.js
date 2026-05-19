// Import JSON Web Token module to inspect cookies
import jwt from "jsonwebtoken";
// Import dotenv config to process environment variables
import { config } from "dotenv";

// Initialize dotenv environment variables loading
config();

/**
 * Access Control Middleware: Validates JWT token in cookies
 * and verifies that the user's role is included in the allowed roles list.
 *
 * @param {...String} allowedRoles - List of authorized role values.
 * @returns {Function} Express middleware handler.
 */
export const verifyToken = (...allowedRoles) => {
  // Return the async middleware function
  return async (req, res, next) => {
    try {
      // Retrieve the token string directly from request cookies
      const token = req.cookies.token;

      // If token is missing, return a 401 Unauthorized response
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized. Please login"
        });
      }

      // Verify token integrity and signature against secret key
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Verify that the user's role matches the allowed permissions
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decodedToken.role)
      ) {
        // Return 403 Forbidden if user lacks role authority
        return res.status(403).json({
          message: "Forbidden. You don't have permission"
        });
      }

      // Attach decoded session details to Express request context
      req.user = decodedToken;

      // Proceed to the next middleware or controller handler in line
      next();
    } catch (err) {
      // Specific error handling for expired tokens
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please login again"
        });
      }

      // Specific error handling for malformed or tampered token signatures
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token. Please login again"
        });
      }

      // Send any unexpected errors to the global Express error boundary
      next(err);
    }
  };
};
