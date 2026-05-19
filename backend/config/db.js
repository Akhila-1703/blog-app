// Import the Mongoose connection method to interact with MongoDB
import { connect } from 'mongoose';

/**
 * Establishes an asynchronous connection to the MongoDB database
 * using the connection URL defined in the environment variables.
 */
export const connectDB = async () => {
  // Await the Mongoose connection promise using the DB_URL key
  await connect(process.env.DB_URL);
  
  // Log a success message to the console once connection succeeds
  console.log("DB Connection Successful");
};
