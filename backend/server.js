// Import dotenv config immediately at the top to populate process.env before all downstream imports evaluate
import 'dotenv/config';
// Import the Express framework
import exp from 'express';
// Import the modular database connection bootstrapper
import { connectDB } from './config/db.js';

// Import feature-specific router modules
import { userRoute } from './APIs/UserAPI.js';
import { adminRoute } from './APIs/AdminAPI.js';
import { authorRoute } from './APIs/AuthorAPI.js';
import { commonRouter } from './APIs/CommonAPI.js';

// Import middleware to parse and parse cookie headers
import cookieParser from 'cookie-parser';
// Import CORS middleware to manage Cross-Origin Resource Sharing
import cors from 'cors';

// Instantiate the Express application
const app = exp();

// Enable Cross-Origin Resource Sharing (CORS) with specific trusted client domains
app.use(cors({
  origin: [
    "http://localhost:5173", // Local dev client port
    "https://blog-app-xi-lovat.vercel.app" // Production client URL
  ],
  credentials: true // Permits exchanging HTTP authorization session cookies
}));

// Apply JSON body parser middleware to parse incoming request payloads
app.use(exp.json());
// Apply Cookie Parser middleware to populate req.cookies from request headers
app.use(cookieParser());

// Register API routing groups onto Express sub-paths
app.use('/user-api', userRoute);
app.use('/admin-api', adminRoute);
app.use('/author-api', authorRoute);
app.use('/common-api', commonRouter);

/**
 * Initiates the application boot sequence.
 * Establishes MongoDB connection and starts the Express server listening on PORT.
 */
const startServer = async () => {
  try {
    // Await database connection establishment
    await connectDB();

    // Start Express listening on port loaded from env
    app.listen(process.env.PORT, () =>
      console.log("Server Started.......")
    );
  } catch (err) {
    // Log server boot and connection failures
    console.log("Err occurred", err);
  }
};

// Start the server
startServer();

// Middleware: Route fallback to handle unregistered or invalid URLs (404 Fallback)
app.use((req, res, next) => {
  res.status(404).send({ message: "Invalid path" });
});

// Middleware: Global Error Handling pipeline to capture and normalize exceptions
app.use((err, req, res, next) => {
  // Scenario A: Custom HTTP status exceptions thrown intentionally in codebase
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // Scenario B: MongoDB/Mongoose validation constraint failures
  if (err.name === "ValidationError") {
    // Collect specific validation message strings
    const errorDetails = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: "validation error",
      error: errorDetails[0], // Respond with the first occurred validation error details
    });
  }

  // Scenario C: Mongoose CastError (e.g. searching with an invalid format ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "cast error",
      error: `Invalid format for field ${err.path}`,
    });
  }

  // Scenario D: Default generic internal server exceptions (500 Internal Error)
  res.status(500).json({
    message: "error occurred",
    error: err.message || err,
  });
});
