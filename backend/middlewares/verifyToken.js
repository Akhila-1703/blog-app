import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {

  return async (req, res, next) => {

    try {

      // Read token from cookie
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          message: "Unauthorized. Please login"
        });
      }

      // Verify and decode token
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Check role access
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decodedToken.role)
      ) {
        return res.status(403).json({
          message: "Forbidden. You don't have permission"
        });
      }

      // Attach user info
      req.user = decodedToken;

      next();

    } catch (err) {

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please login again"
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token. Please login again"
        });
      }

      next(err);
    }
  };
};


/*import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Read token from cookie
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please login" });
      }

      // Verify and decode token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Check if role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.role)) {
  return res.status(403).json({ message: "Forbidden. You don't have permission" });
      }
      

      // Attach user info to req for use in routes
      req.user = decodedToken;

      next();
    } catch (err) {
      // jwt.verify throws if token is invalid/expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please login again" });
      }
    next(err);
    }
  };
};


the token will send automatically if its is same origin the client tool they are not different when we make req the httponly cookie will automatically send 
it wont be accessed by client
not copied
 */