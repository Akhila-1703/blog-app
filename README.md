<div align="center">

# ✍️ Full-Stack Role-Based Blog Application (MERN)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, responsive, and secure blogging platform built with the **MERN Stack**. Designed with an enterprise-grade **Role-Based Access Control (RBAC)** architecture to deliver distinct experiences for Readers, Creators, and Administrators.

</div>

---

## 🌟 Features & Functionality

This platform implements complex data relationships, strict validation, and stateless security paradigms.

### 🔐 Security & Access Control
- **Stateless Authentication:** Uses JWTs transmitted via secure `HTTP-Only` cookies to prevent XSS.
- **Three-Tier Roles:** 
  - **USER (Reader):** Browse articles and engage with comments.
  - **AUTHOR (Creator):** Dedicated dashboard to write and manage personal articles.
  - **ADMIN (Manager):** Full platform oversight, user moderation, and system analytics.
- **Route Guarding:** Dynamic middleware and HOCs to protect sensitive API endpoints and UI layouts.

### 📝 Content Management
- **Cloud-Native Media:** Direct streaming of profile images to **Cloudinary** via `multer`.
- **Soft Deletion:** Article deactivation system that preserves data for auditing and restoration.
- **Interactive Feed:** Nested commenting system and categorized article discovery.

---

## 📐 System Architecture

### High-Level Flow
```mermaid
graph TD
    Client[Client Browser / React App] -->|HTTP Requests| Vite[Vite Dev Server / Vercel]
    Vite -->|Axios REST Calls| Express[Express.js Server / Render]
    
    subgraph Backend Architecture
        Express -->|Middleware| AuthGuard[verifyToken Middleware]
        AuthGuard -->|If Valid| Controllers[API Controllers]
        Controllers -->|Business Logic| Services[Auth/Article Services]
        Services -->|Mongoose Queries| DB[(MongoDB Atlas)]
    end
    
    subgraph External Services
        Controllers -->|Multipart Stream| Cloudinary[Cloudinary CDN]
    end
```

### Data Model (ER Diagram)
```mermaid
erDiagram
    USER ||--o{ ARTICLE : "Writes (Author Role)"
    USER ||--o{ COMMENT : "Posts"
    ARTICLE ||--o{ COMMENT : "Contains"

    USER {
        ObjectId _id PK
        String email "Unique"
        String role "USER, AUTHOR, ADMIN"
        Boolean isActive "Status"
    }

    ARTICLE {
        ObjectId _id PK
        ObjectId author FK
        String title "3-120 chars"
        Boolean isArticleActive "Soft Delete"
    }
```

---

## 🚀 How to Use (Installation & Setup)

Follow these steps to get the project running on your local machine or another computer.

### 📋 Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** Account (Cluster URI)
- **Cloudinary** Account (API Credentials)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Akhila-1703/blog-app.git
cd blog-app

# Install Backend packages
cd backend
npm install

# Install Frontend packages
cd ../frontend
npm install
```

### 2. Environment Configuration
You must create a `.env` file inside the `backend/` directory with the following keys:
```env
PORT=4000
DB_URL=your_mongodb_atlas_uri
JWT_SECRET_KEY=your_secret_key
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 3. Running the Application
You will need two terminal windows open:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
*Server runs on `http://localhost:4000`*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Application accessible at `http://localhost:5173`*

---

## 📚 Detailed Documentation

For a deep dive into the internal project structure, file references, and specific package implementations, please refer to the folder-specific READMEs:

- 📂 **[Backend Internal Docs](./backend/README.md)**: Models, API Contracts, and Middleware logic.
- 📂 **[Frontend Internal Docs](./frontend/README.md)**: Components, State Management, and Protected Layouts.

---
<div align="center">
  <i>Engineered for security, scalability, and performance.</i>
</div>
