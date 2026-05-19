// Import Express module to instantiate router
import exp from "express";
// Import token verification middleware for authorization checks
import { verifyToken } from "../middlewares/verifyToken.js";
// Import common session and session profile controller handlers
import {
  loginUser,
  logoutUser,
  changePassword,
  checkAuth,
} from "../controllers/commonController.js";

// Instantiate Express router for shared endpoints
export const commonRouter = exp.Router();

// Route: Authenticate user login credentials (Public endpoint)
commonRouter.post("/login", loginUser);

// Route: De-authenticate user session and clear cookies (Public endpoint)
commonRouter.get("/logout", logoutUser);

// Route: Change user password (Restricted to USER, AUTHOR, and ADMIN roles)
commonRouter.put("/change-password", verifyToken("USER", "AUTHOR", "ADMIN"), changePassword);

// Route: Perform session token refresh check (Public endpoint)
commonRouter.get("/check-auth", checkAuth);
