// Import authenticate function from authentication services
import { authenticate } from "../services/authService.js";
// Import hash and compare password methods from bcrypt library
import { hash, compare } from "bcryptjs";
// Import the User Model to perform database queries on users
import { UserTypeModel } from "../models/UserModel.js";
// Import our custom asyncHandler to capture rejected promises cleanly
import { asyncHandler } from "../utils/asyncHandler.js";
// Import jsonwebtoken to verify browser cookies on page refresh
import jwt from "jsonwebtoken";

/**
 * Controller to handle user login.
 * Validates credentials and dispatches an HTTP-only token cookie.
 */
export const loginUser = asyncHandler(async (req, res) => {
  // Extract user credentials email and password from the request body
  const userCred = req.body;

  // Authenticate user credentials and return a session token and the user's details
  const { token, user } = await authenticate(userCred);

  // Set cookie named 'token' with HTTP-only, secure and sameSite protections
  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side scripts from reading the cookie
    secure: process.env.NODE_ENV === "production", // Cookie transmitted only over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" // Prevent CSRF attacks
  });

  // Respond with 200 OK showing success
  res.status(200).json({
    message: "Login Success",
    payload: user
  });
});

/**
 * Controller to handle user logout.
 * Clears the HTTP-only authentication token cookie.
 */
export const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie named 'token' matching the exact options
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });

  // Respond with 200 OK showing success
  res.status(200).json({
    message: "Logout successful"
  });
});

/**
 * Controller to change a user's password.
 * Confirms current password match, hashes the new password, and updates the database.
 */
export const changePassword = asyncHandler(async (req, res) => {
  // Destructure the old password and the desired new password from request body
  const { currentPassword, newPassword } = req.body;

  // Search the database for the user by their email address attached in verifyToken
  const user = await UserTypeModel.findOne({
    email: req.user.email
  });

  // If user does not exist, return a 404 Not Found
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // Compare the input currentPassword with the database encrypted password hash
  const isMatch = await compare(currentPassword, user.password);

  // Return a 401 Unauthorized if current password comparison fails
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid old password"
    });
  }

  // Hash the new password with bcrypt salt rounds of 12
  user.password = await hash(newPassword, 12);
  
  // Save the modified document to the database
  await user.save();

  // Convert mongoose document to raw object to safely remove sensitive information
  const userObj = user.toObject();
  delete userObj.password;

  // Respond with 200 OK and user details payload
  res.json({
    message: "Password changed successfully",
    payload: userObj
  });
});

/**
 * Controller to perform session checks during application initialization/page refresh.
 * Reads token cookie and decodes it without triggering Express global error crashes on absence.
 */
export const checkAuth = async (req, res) => {
  try {
    // Read token cookie directly from cookies parser
    const token = req.cookies.token;

    // Return payload: null with status 200 if token cookie is not present
    if (!token) {
      return res.status(200).json({
        message: "not authenticated",
        payload: null
      });
    }

    // Verify token validity against the process JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Respond with status 200 and the decoded token payload (containing user profile info)
    res.status(200).json({
      message: "authenticated",
      payload: decoded
    });
  } catch (err) {
    // Intercept any expiration or signature verification errors and return payload: null
    res.status(200).json({
      message: "not authenticated",
      payload: null
    });
  }
};
