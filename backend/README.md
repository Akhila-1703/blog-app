# Blog App Backend 🚀

The robust and scalable backend for the Blog Application, built using **Node.js**, **Express.js**, and **MongoDB**. It handles user authentication, article management, role-based access control, and image processing.

---

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & Bcryptjs
- **File Uploads:** Multer & Cloudinary
- **Middleware:** CORS, Cookie-parser, Dotenv

---

## ✨ Features

- **Multi-Role System:** Distinct workflows for **Users**, **Authors**, and **Admins**.
- **Secure Authentication:** JWT-based auth with password hashing and cookie storage.
- **Article Management:** Create, Read, Update, and Soft-delete (activate/deactivate) articles.
- **Comments System:** Users can interact with articles by adding comments.
- **Image Handling:** Seamless integration with Cloudinary for profile and article image storage.
- **Error Handling:** Centralized middleware for consistent API error responses.

---

## 📂 Project Structure

```text
backend/
├── APIs/             # Route handlers (User, Author, Admin, Common)
├── config/           # Configuration files (DB, Cloudinary, Multer)
├── middlewares/      # Custom middlewares (JWT Verification, etc.)
├── models/           # Mongoose schemas (User, Article, etc.)
├── services/         # Business logic & Database interactions
├── .env              # Environment variables (Sensitive)
├── server.js         # Main entry point
└── package.json      # Dependencies and scripts
