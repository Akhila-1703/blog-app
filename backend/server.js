import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'

config()

import { userRoute } from './APIs/UserAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { commonRouter } from './APIs/CommonAPI.js'

import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = exp()

//use cors middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blog-app-xi-lovat.vercel.app"
  ],
  credentials: true
}));

// body parser
app.use(exp.json())

app.use(cookieParser())

// connect APIs
app.get('/', (req, res) => {
  res.send("Blog App API is running...");
});

app.use('/user-api', userRoute)

app.use('/admin-api', adminRoute)

app.use('/author-api', authorRoute)

app.use('/common-api', commonRouter)

// DB connection
const connectDB = async () => {

  try {

    await connect(process.env.DB_URL)

    console.log("DB Connection Successful")

    app.listen(process.env.PORT, () =>
      console.log("Server Started.......")
    )

  } catch (err) {

    console.log("Err occurred", err)
  }
}

connectDB()

// invalid path middleware
app.use((req, res, next) => {

  res.status(404).json({
    message: `${req.url} Invalid path`
  })
})

// error handling middleware
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // duplicate key error
  const errCode =
    err.code ??
    err.cause?.code ??
    err.errorResponse?.code;

  const keyValue =
    err.keyValue ??
    err.cause?.keyValue ??
    err.errorResponse?.keyValue;

  if (errCode === 11000) {

    const field = Object.keys(keyValue)[0];

    const value = keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // custom status errors
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});

