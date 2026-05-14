# Blog App Backend - Documentation

This is the backend of the Blog Application, built with **Node.js**, **Express**, and **MongoDB**. It handles user authentication, article management, role-based access control (RBAC), and image uploads using Cloudinary.

## 🚀 Tech Stack

### Core Technologies
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.

### Installed Packages & Dependencies
| Package | Purpose |
| :--- | :--- |
| `express` | Web framework for routing and middleware. |
| `mongoose` | Schema-based solution for MongoDB interaction. |
| `dotenv` | Loads environment variables from a `.env` file. |
| `jsonwebtoken` (JWT) | Handles secure user authentication via tokens. |
| `bcryptjs` | Hashes passwords for secure storage. |
| `cookie-parser` | Parses cookies for handling JWT in HTTP-only cookies. |
| `cors` | Enables Cross-Origin Resource Sharing for the frontend. |
| `multer` | Middleware for handling `multipart/form-data` (image uploads). |
| `cloudinary` | Cloud service for storing and managing images. |

---

## 📂 Project Structure

```text
backend/
├── APIs/               # Route handlers for different roles
│   ├── AdminAPI.js     # Admin specific routes
│   ├── AuthorAPI.js    # Author specific routes
│   ├── UserAPI.js      # User specific routes
│   └── CommonAPI.js    # Login, Logout, and Shared routes
├── config/             # Configuration files (DB, Cloudinary, Multer)
├── middlewares/        # Custom middlewares (Auth verification, Error handling)
├── models/             # Mongoose Schemas & Models
├── services/           # Business logic (Authentication logic)
├── server.js           # Entry point of the application
└── .env                # Environment variables (Internal use)
```

---

## 🗄️ Database Schemas

The project uses two primary collections: `users` and `articles`.

### 1. User Schema (`UserModel.js`)
Stores information for all three roles: **USER**, **AUTHOR**, and **ADMIN**.

| Field | Type | Description |
| :--- | :--- | :--- |
| `firstName` | String | User's first name (Required, 2-30 chars). |
| `lastName` | String | User's last name (Optional, max 30 chars). |
| `email` | String | Unique email address (Used for login). |
| `password` | String | Hashed password. |
| `profileImageUrl`| String | URL of the user profile image (Cloudinary). |
| `role` | String | Enum: `["USER", "AUTHOR", "ADMIN"]`. |
| `isActive` | Boolean | Account status (Used by Admin to block/unblock). |
| `timestamps` | Date | Automatically tracks `createdAt` and `updatedAt`. |

### 2. Article Schema (`ArticleModel.js`)
Stores blog posts created by Authors.

| Field | Type | Description |
| :--- | :--- | :--- |
| `author` | ObjectId | Reference to the `user` who wrote the article. |
| `title` | String | Title of the post (3-120 characters). |
| `category` | String | Enum: `["technology", "programming", "AI", "web development"]`. |
| `content` | String | The body of the article (20-10,000 characters). |
| `comments` | Array | Nested schema for user comments. |
| `isArticleActive`| Boolean | Soft delete status (Default: `true`). |

---

## 🔌 API Endpoints

### 🟢 Common API (`/common-api`)
- `POST /login`: Authenticates user and sets JWT in a cookie.
- `GET /logout`: Clears the authentication cookie.
- `PUT /change-password`: Updates password for logged-in users.
- `GET /check-auth`: Verifies if the user is authenticated on page refresh.

### 🔵 User API (`/user-api`)
- `POST /users`: Register a new user with a profile image.
- `GET /articles`: View all active articles.
- `GET /article/:id`: View a specific article with comments.
- `PUT /articles`: Add a comment to an article.

### 🟠 Author API (`/author-api`)
- `POST /users`: Register as an author.
- `POST /articles`: Create a new blog post.
- `GET /articles`: View all articles written by the logged-in author.
- `PUT /articles`: Edit an existing article.
- `PATCH /articles/:id/status`: Soft delete or restore an article.

### 🔴 Admin API (`/admin-api`)
- `GET /articles`: View all articles in the system.
- `PUT /block-user`: Disable a user/author account.
- `PUT /unblock-user`: Re-enable a user/author account.
- `GET /stats`: Get system-wide statistics (counts of users, articles, etc.).
- `GET /users`: List all registered users.

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd blog-app/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend` root and add the following:
   ```env
   PORT=4000
   DB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUD_NAME=your_cloudinary_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Run the server**:
   - For production: `npm start`
   - For development: `node server.js` (or use `nodemon`)

---

## 🛡️ Security & Middleware
- **JWT (JSON Web Token)**: Used for secure, stateless authentication.
- **Bcrypt.js**: Passwords are never stored in plain text.
- **HTTP-Only Cookies**: JWTs are stored in cookies with `httpOnly: true` to prevent XSS attacks.
- **Verify Token Middleware**: Custom middleware ensures users can only access routes permitted by their role.
- **CORS**: Configured to only allow requests from your specific frontend URL.

---

## 📝 Error Handling
The backend implements a global error-handling middleware in `server.js` that catches:
- Mongoose Validation Errors (400)
- Cast Errors (Invalid IDs) (400)
- Duplicate Key Errors (e.g., duplicate email) (409)
- Custom Status Errors

---
*Developed as part of the Blog Application Project.*
