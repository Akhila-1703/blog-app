# ✍️ Full-Stack Role-Based Blog Application

Welcome to the central repository for the Full-Stack Blog Application. This project is a modern, responsive, and secure blogging platform built using the **MERN Stack** (MongoDB, Express, React, Node.js) along with **Vite** and **Tailwind CSS**.

The platform is designed around a robust **Role-Based Access Control (RBAC)** system, providing distinct experiences and permissions for Readers (Users), Content Creators (Authors), and System Administrators (Admins).

---

## 🌟 Key Features

### 🔐 Secure Authentication & Authorization
- **Stateless Sessions:** Uses JSON Web Tokens (JWT) stored in secure, HTTP-only cookies to prevent XSS attacks.
- **Encrypted Data:** Passwords are encrypted using `bcryptjs` before hitting the database.
- **Route Protection:** Both frontend React routes and backend Express API endpoints are tightly guarded based on the user's role.

### 👥 Three-Tier Role System
The application provides customized dashboards and capabilities based on user type:
1. **USER (Reader):** 
   - Can view all active articles.
   - Can interact with content by leaving comments.
   - Can manage their own profile and password.
2. **AUTHOR (Creator):**
   - Has a dedicated dashboard to write, edit, and manage their own articles.
   - Can "Soft Delete" (hide) or restore their articles at any time.
   - Can upload and manage their profile picture.
3. **ADMIN (Manager):**
   - Has ultimate oversight over the platform.
   - Can view system-wide statistics (total users, active articles, etc.).
   - Can forcibly block or unblock user/author accounts.
   - Can forcefully hide or restore any article on the platform.

### 📝 Rich Content Management
- **Image Uploads:** Seamless profile picture uploads handled by `multer` and hosted on **Cloudinary**.
- **Data Integrity:** Strict Mongoose schemas ensure data consistency, limiting article lengths, validating email formats, and categorizing content.
- **Soft Deletion:** Articles are never permanently destroyed; they are deactivated, allowing for easy restoration.

### ⚡ Modern Frontend Experience
- **Lightning Fast:** Built with React 19 and Vite for instant HMR and optimized production builds.
- **State Management:** Utilizes `Zustand` for lightweight, boilerplate-free global state management (handling auth sessions smoothly across reloads).
- **Responsive UI:** Fully styled with Tailwind CSS v4, ensuring the app looks beautiful on desktop, tablet, and mobile devices.
- **Toast Notifications:** Real-time visual feedback for user actions (login success, article creation, errors) using `react-hot-toast`.

---

## 🏗️ Project Structure

This repository follows a monorepo-style structure, housing both the client-side and server-side codebases.

```text
blog-app/
│
├── frontend/       # React 19 + Vite + Tailwind CSS + Zustand
│   ├── README.md   # Detailed frontend documentation
│   └── src/        # UI Components, Routing, and State
│
└── backend/        # Node.js + Express + MongoDB + Mongoose
    ├── README.md   # Detailed backend documentation
    └── ...         # APIs, Models, Services, and Middlewares
```

---

## 📚 Detailed Documentation

Because of the project's scale, the documentation has been split into two comprehensive guides. **Please refer to these for deep-dives into the codebase, exact API endpoints, database schemas, and local setup instructions:**

- 👉 **[Frontend Documentation](./frontend/README.md)**: Explore the React architecture, routing strategy, Zustand state management, and component breakdown.
- 👉 **[Backend Documentation](./backend/README.md)**: Explore the Node.js architecture, Mongoose schemas, JWT cookie security, and exhaustive API endpoint definitions.

---

## 🚀 Quick Start (Local Development)

To run the entire application locally, you will need two terminal windows.

### 1. Start the Backend Server
```bash
cd backend
npm install
# Ensure you have created your .env file as detailed in the backend README
npm start
```
*The backend will run on `http://localhost:4000`*

### 2. Start the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 🛠️ Core Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Zustand, React Hook Form, Axios.
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js, Multer.
- **Database:** MongoDB, Mongoose ODM.
- **Cloud Services:** Cloudinary (Image Hosting).
- **Deployment Strategy:** Vercel (Frontend) & Render (Backend).

---
*Built with ❤️ as a full-stack portfolio project.*
