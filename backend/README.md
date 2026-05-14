# 📝 Comprehensive Backend Documentation - Blog Application

Welcome to the definitive guide for the backend of the Blog Application. This document provides an exhaustive, granular breakdown of every file, dependency, schema, API route, and configuration setting used in the project.

---

## 🏗️ 1. Architecture & System Flow

This backend is built on a **Node.js** + **Express.js** + **MongoDB (Mongoose)** stack.
- **Client Requests** arrive via HTTP/HTTPS.
- **CORS** allows requests only from the specified frontend URL.
- **Cookie Parser** extracts the JWT token from HTTP-only cookies.
- **Middlewares** (like `verifyToken`) intercept requests to ensure the user is authenticated and authorized for that specific route.
- **Multer** intercepts file uploads, validates them in memory, and then they are pushed to **Cloudinary**.
- **Controllers (APIs)** handle the request logic.
- **Services (`authService.js`)** abstract complex business logic like password hashing and token generation.
- **Mongoose Models** enforce schema structure and database-level validation before saving to **MongoDB**.
- A **Global Error Handler** catches and formats all application errors seamlessly.

---

## 📦 2. Complete Technology Stack & Dependencies

Below is every package used, including *why* and *how* it is used in the project.

| Package | Version | Detailed Purpose & Usage in Project |
| :--- | :--- | :--- |
| `express` | `^5.2.1` | The core web framework used to create the server, define routes (`express.Router()`), and manage middlewares (`app.use()`). |
| `mongoose` | `^9.1.5` | ODM (Object Data Modeling) library. Connects to MongoDB (`mongoose.connect`), creates Schemas, enforces strict validation rules, and handles queries (`find`, `findByIdAndUpdate`, `populate`). |
| `dotenv` | `^17.2.3` | Loads environment variables from `.env` into `process.env`. Initialized at the very top of `server.js` to ensure all modules have access. |
| `jsonwebtoken` | `^9.0.3` | Generates signed JWTs upon login (expires in `1h`) and decodes them via the `verifyToken` middleware. Used for stateless, sessionless authentication. |
| `bcryptjs` | `^3.0.3` | Cryptographic library used to hash plain-text passwords (using 10 salt rounds for registration, 12 for password changes) and compare them during login. |
| `cookie-parser` | `^1.4.7` | Middleware that parses incoming `Cookie` headers. Essential for reading the `token` cookie set during login. |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing. Configured with `credentials: true` to allow cookies to be sent across different domains (from frontend to backend). |
| `multer` | `^2.1.1` | Middleware for handling `multipart/form-data`. Configured to use `memoryStorage()` (keeps files in RAM temporarily) with a strict `2MB` size limit and filters out non `image/jpeg` or `image/png` files. |
| `cloudinary` | `^2.9.0` | Cloud-based image management service. Used to upload user profile pictures via streams directly from Multer's memory buffer. |

---

## 🚀 3. Installation & Local Setup Guide

Follow these instructions exactly to get the backend running locally.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB Database** (MongoDB Atlas cloud URI or local MongoDB server)
- **Cloudinary Account** (for image hosting)

### Step-by-Step Installation

1. **Clone the repository & navigate to the backend:**
   ```bash
   git clone <repository-url>
   cd blog-app/backend
   ```

2. **Install Node Modules:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a file named `.env` in the root of the `backend` folder. **Do not skip this step.**
   Add the following properties:
   ```env
   # The port the Express server will run on
   PORT=4000
   
   # Node environment state (use 'development' locally, 'production' on deployment)
   NODE_ENV=development
   
   # MongoDB Connection String (Replace with your actual URI)
   DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog-db
   
   # A secure, random string used to sign JSON Web Tokens
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Cloudinary Credentials (get these from your Cloudinary Dashboard)
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the Server:**
   ```bash
   # Standard start
   npm start
   
   # OR, if you want auto-reloading during development (requires nodemon globally installed)
   nodemon server.js
   ```

5. **Verify it's working:**
   Open your browser and go to `http://localhost:4000/`. You should see:
   `"Blog App API is running..."`

---

## 📂 4. Deep-Dive Directory & File Structure

Here is the exact layout of the backend and the specific role of every single file.

```text
backend/
│
├── server.js                   # THE ENTRY POINT. Initializes dotenv, sets up CORS (Vercel/localhost), sets up Cookie Parser, mounts all API routes, connects to MongoDB, and handles Global Errors.
├── package.json                # Defines scripts (npm start) and lists all project dependencies.
├── package-lock.json           # Locks dependency versions for consistent installs.
├── .gitignore                  # Prevents node_modules and .env from being pushed to GitHub.
│
├── config/                     # Configuration logic separated from main code
│   ├── cloudinary.js           # Initializes the `cloudinary` object with env variables.
│   ├── cloudinaryUpload.js     # Exposes `uploadToCloudinary(buffer)`, a Promise wrapper around Cloudinary's `upload_stream` targeting the "blog_users" folder.
│   └── multer.js               # Exports `upload` middleware. Enforces 2MB limit and JPG/PNG only.
│
├── models/                     # Mongoose Schemas (Database Structure)
│   ├── ArticleModel.js         # Defines Article schema & nested User Comment schema.
│   └── UserModel.js            # Defines User schema, validation rules, and indexes.
│
├── services/                   # Business Logic Layer
│   └── authService.js          # Contains `register()` (hashes password, saves user) and `authenticate()` (verifies email, checks if blocked, compares hash, signs JWT).
│
├── middlewares/                # Custom Express Middlewares
│   └── verifyToken.js          # Extracts JWT from cookie, verifies it using JWT_SECRET, checks if the user's role matches `allowedRoles`, and attaches user data to `req.user`.
│
└── APIs/                       # Route Controllers (Grouped by entity/role)
    ├── AdminAPI.js             # Routes exclusively for ADMIN operations.
    ├── AuthorAPI.js            # Routes for AUTHOR operations (writing/editing articles).
    ├── UserAPI.js              # Routes for standard USER operations.
    └── CommonAPI.js            # Routes accessible to anyone (login, logout) or all authenticated users (change password).
```

---

## 🗄️ 5. Database Schemas (Mongoose)

The project utilizes `strict: "throw"` to reject unknown fields and sets `versionKey: false` to remove the default `__v` field. Timestamps (`createdAt`, `updatedAt`) are automatically managed.

### A. User Model (`UserModel.js`)
**Collection Name:** `users`
**Indexes:** `email` (ascending)

| Field | Type | Validation / Rules |
| :--- | :--- | :--- |
| `firstName` | String | **Required**. Min 2, Max 30 chars. Trims whitespace. Custom validator prevents empty strings. |
| `lastName` | String | Optional. Max 30 chars. Trims whitespace. |
| `email` | String | **Required**, **Unique**. Lowercased. Validated using a standard Email Regex pattern. |
| `password` | String | **Required**. Min 6, Max 100 chars. (Stored as a bcrypt hash). |
| `profileImageUrl` | String | Optional. Defaults to a standard avatar URL if no image is uploaded. |
| `role` | String | **Required**. Enum allowed values: `["AUTHOR", "USER", "ADMIN"]`. |
| `isActive` | Boolean | Optional. Defaults to `true`. Determines if the user is blocked. |

### B. Article Model (`ArticleModel.js`)
**Collection Name:** `articles`
**Indexes:** `author` (ascending), `category` (ascending)

| Field | Type | Validation / Rules |
| :--- | :--- | :--- |
| `author` | ObjectId | **Required**. Refers to a document in the `users` collection. |
| `title` | String | **Required**. Min 3, Max 120 chars. Trims whitespace. |
| `category` | String | **Required**. Enum: `["technology", "programming", "AI", "web development"]`. |
| `content` | String | **Required**. Min 20, Max 10,000 chars. Trims whitespace. |
| `comments` | Array | Array of nested `userCommentSchema` objects. |
| `isArticleActive` | Boolean | Optional. Defaults to `true`. Used for "Soft Deletes" (hiding articles without destroying data). |

#### Nested Schema: `userCommentSchema`
| Field | Type | Validation / Rules |
| :--- | :--- | :--- |
| `user` | ObjectId | Refers to a document in the `users` collection. |
| `comment` | String | **Required**. Min 2, Max 500 chars. |
| `timestamps`| Date | Auto-generates `createdAt` and `updatedAt` for the comment. |

---

## 🌐 6. Exhaustive API Route Reference

### 🟢 Common API (`/common-api`)
These routes handle universal tasks.

| Method | Endpoint | Auth Required? | Purpose & Details |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | None | Expects `{ email, password }`. Checks DB, compares hash, verifies `isActive`. On success, sets an HTTP-only `token` cookie. |
| `GET` | `/logout` | None | Clears the `token` cookie from the client's browser. |
| `PUT` | `/change-password`| USER, AUTHOR, ADMIN | Expects `{ currentPassword, newPassword }`. Validates old password, hashes new password (12 rounds), updates DB. |
| `GET` | `/check-auth` | None | Reads cookie. If valid, returns decoded JWT payload. Used by React to persist session on page reloads. |

### 🔵 User API (`/user-api`)
Routes for readers/consumers.

| Method | Endpoint | Auth Required? | Purpose & Details |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | None | Registers a user. Uses `multer` (`upload.single("profileImageUrl")`). Expects `multipart/form-data`. Uploads to Cloudinary, saves to DB with role `"USER"`. |
| `GET` | `/articles` | USER | Fetches all articles where `isArticleActive: true`. Populates `author` details (name, email, image). |
| `GET` | `/article/:id` | USER, AUTHOR, ADMIN | Fetches a specific active article. Populates both `author` details and `comments.user` details. |
| `PUT` | `/articles` | USER | Expects `{ articleId, comment }`. Validates comment is not empty. Uses `$push` to add a comment to the specific article. |

### 🟠 Author API (`/author-api`)
Routes for content creators.

| Method | Endpoint | Auth Required? | Purpose & Details |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | None | Registers an author. Uses `multer` (`multipart/form-data`). Uploads image, saves to DB with role `"AUTHOR"`. |
| `POST` | `/articles` | AUTHOR | Expects `{ title, category, content }`. Attaches the `req.user._id` as the author and saves the new article. |
| `GET` | `/articles` | AUTHOR | Fetches all articles *only* belonging to the currently logged-in author (`author: req.user._id`). |
| `PUT` | `/articles` | AUTHOR | Expects `{ articleId, title, category, content }`. Finds article ensuring the logged-in user is the owner, then updates it. |
| `PATCH`| `/articles/:id/status`| AUTHOR | Expects `{ isArticleActive }`. Soft deletes or restores the article. Verifies ownership before updating. |

### 🔴 Admin API (`/admin-api`)
Routes for platform management.

| Method | Endpoint | Auth Required? | Purpose & Details |
| :--- | :--- | :--- | :--- |
| `GET` | `/articles` | ADMIN | Fetches **all** articles regardless of active status. |
| `PUT` | `/block-user` | ADMIN | Expects `{ userId }`. Sets user's `isActive` to `false`. Admin cannot block themselves. |
| `PUT` | `/unblock-user` | ADMIN | Expects `{ userId }`. Sets user's `isActive` to `true`. |
| `PUT` | `/article-status` | ADMIN | Expects `{ articleId, isArticleActive }`. Allows Admin to forcefully soft delete or restore any article. |
| `GET` | `/stats` | ADMIN | Returns a payload with counts: `totalUsers`, `totalAuthors`, `totalArticles`, and `activeArticles`. |
| `GET` | `/users` | ADMIN | Returns a list of all users, excluding their passwords (`select("-password")`). |

---

## 🔒 7. Security Implementations & Middleware Flow

1. **Authentication (JWT & Cookies):**
   - The backend uses stateless JSON Web Tokens.
   - When a user logs in, the backend signs a token and attaches it to the response as a cookie using:
     `res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })` *(in production)*.
   - `httpOnly: true` prevents Cross-Site Scripting (XSS) attacks by making the cookie inaccessible to frontend JavaScript.

2. **Authorization (`verifyToken.js`):**
   - Before hitting protected routes, the `verifyToken` middleware intercepts the request.
   - It reads the cookie. If missing, throws `401 Unauthorized`.
   - It verifies the signature using `JWT_SECRET`. Handles `TokenExpiredError` specifically.
   - It checks the decoded `role` against the allowed roles passed to the middleware (e.g., `verifyToken("ADMIN")`). If mismatched, throws `403 Forbidden`.

3. **Global Error Handling (`server.js`):**
   Instead of crashing the server, errors are passed down via `next(err)` to the global handler at the bottom of `server.js`.
   - **Mongoose Validation / Cast Errors:** Automatically formatted into `400 Bad Request` with exact field error messages.
   - **Duplicate Key Errors (Code 11000):** Formatted into `409 Conflict` (e.g., "email already exists").
   - **Custom Status Errors:** Handled dynamically (e.g., `401`, `403`, `404`).
   - **Fallback:** Returns `500 Server Error`.

---
*End of documentation. Everything required to understand, build, modify, and deploy this backend is documented above.*
