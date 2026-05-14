# 🎨 Comprehensive Frontend Documentation - Blog Application

Welcome to the definitive guide for the frontend of the Blog Application. This document provides an exhaustive, granular breakdown of every file, dependency, component, routing strategy, and state management configuration used in the project.

---

## 🏗️ 1. Architecture & System Flow

This frontend is a Single Page Application (SPA) built with **React 19** and powered by **Vite** for lightning-fast builds and Hot Module Replacement (HMR).

- **Routing:** Handled by **React Router v7** using the modern `createBrowserRouter` API. It utilizes nested routes and layout components (`RootLayout`) to persist headers and footers across page navigations.
- **State Management:** Global state (specifically user authentication status, role, and details) is managed by **Zustand**. This avoids prop-drilling and provides a simple, hook-based API (`useAuthStore`) accessible from any component.
- **Styling:** The UI is exclusively styled using **Tailwind CSS v4**, allowing for rapid, responsive, and utility-first design directly within the JSX.
- **API Communication:** HTTP requests to the Node.js backend are handled by **Axios**. The configuration dynamically switches the base URL between local development (`http://localhost:4000`) and the deployed Render backend based on Vite's environment variables.
- **Form Handling:** Complex forms (Registration, Login, Writing Articles) are managed using **React Hook Form**, which provides performant, unmanaged form validation.

---

## 📦 2. Complete Technology Stack & Dependencies

Below is every package used in the frontend, including *why* and *how* it is used in the project.

| Package | Version | Detailed Purpose & Usage in Project |
| :--- | :--- | :--- |
| `react` & `react-dom` | `^19.2.0` | The core UI library for building the component tree and rendering it to the DOM. |
| `vite` | `^7.3.1` | Next-generation frontend tooling. Serves the app locally during development (`npm run dev`) and bundles it for production (`npm run build`). |
| `tailwindcss` | `^4.2.1` | Utility-first CSS framework. Used extensively via class names in every component to handle layout, typography, colors, and responsiveness. |
| `@tailwindcss/vite` | `^4.2.1` | The Vite plugin required to integrate Tailwind CSS v4 seamlessly into the build pipeline. |
| `react-router` & `react-router-dom` | `^7.13.1` | Client-side routing. Defines paths for every page, protects routes using layout wrappers, and provides hooks like `useNavigate` and `useParams`. |
| `zustand` | `^5.0.11` | A small, fast, and scalable bearbones state-management solution. Used specifically to create `authStore.js` which holds `isAuth`, `currentUser`, and functions to `login()`, `logout()`, and `checkAuth()`. |
| `react-hook-form` | `^7.71.2` | Manages form state. Used in `Login.jsx`, `Register.jsx`, and article creation forms to handle inputs, capture data (`handleSubmit`), and perform validation without causing excessive re-renders. |
| `axios` | `^1.13.6` | Promise-based HTTP client. Configured to send requests to the backend with `withCredentials: true` so that secure HTTP-only cookies (containing the JWT) are transmitted. |
| `react-hot-toast` | `^2.6.0` | Provides clean, modern toast notifications. Used to give the user immediate visual feedback (e.g., "Login Successful", "Article Created", or displaying error messages from the backend). |
| `eslint` | `^9.39.1` | Static code analysis tool used during development to enforce code quality and React best practices. |

---

## 🚀 3. Installation & Local Setup Guide

Follow these instructions exactly to get the frontend running locally.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- The backend server should ideally be running locally on `localhost:4000` to test full functionality.

### Step-by-Step Installation

1. **Clone the repository & navigate to the frontend:**
   ```bash
   git clone <repository-url>
   cd blog-app/frontend
   ```

2. **Install Node Modules:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   Vite does not require complex environment variables for local development by default, as the API URL logic is handled in `src/config/apiConfig.js`.
   ```bash
   npm run dev
   ```

4. **Verify it's working:**
   Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

## 📂 4. Deep-Dive Directory & Component Structure

Here is the exact layout of the `src` directory and the specific role of every single file.

```text
frontend/src/
│
├── main.jsx                    # THE ENTRY POINT. Renders the React `<App />` into the root DOM node.
├── App.jsx                     # The main Routing Hub. Uses `createBrowserRouter` to define all public, nested, and protected routes.
├── index.css                   # Global CSS file. Used primarily to import Tailwind CSS directives.
│
├── config/                     
│   └── apiConfig.js            # Exports `API_BASE_URL`. Checks `import.meta.env.MODE` to switch between `localhost:4000` and the production Render URL.
│
├── store/                      
│   └── authStore.js            # The Zustand state container. Manages the global authentication state (`currentUser`, `isAuth`) and exposes methods to sync with the backend.
│
└── components/                 # UI Components (Grouped by functional area)
    │
    ├── Shared & Layout         
    │   ├── RootLayout.jsx      # The master wrapper. Contains the `<Header />`, the main `<Outlet />` (where dynamic content loads), `<Footer />`, and the `<Toaster />` for notifications.
    │   ├── Header.jsx          # Top navigation bar. Dynamically changes links based on the user's role (extracted from `authStore`). Handles logout functionality.
    │   ├── Footer.jsx          # Bottom section of the application.
    │   ├── Home.jsx            # The public landing page.
    │   ├── ErrorBoundary.jsx   # Wraps routes to catch JavaScript errors in child component trees and display a fallback UI.
    │   └── Unauthorized.jsx    # The page users are redirected to if they attempt to access a route they lack permissions for.
    │
    ├── Authentication          
    │   ├── Login.jsx           # Login form using `react-hook-form`. Dispatches to `authStore.login()`.
    │   ├── Register.jsx        # Multi-role registration form (User/Author). Handles image uploads via `FormData`.
    │   └── ProtectedRoute.jsx  # A wrapper component that checks the current user's role against an `allowedRoles` array. Redirects to `/unauthorized` or `/login` if conditions fail.
    │
    ├── User Dashboard          # Routes nested under `/user-dashboard`
    │   ├── UserDashboard.jsx   # Layout wrapper specifically for the User section.
    │   ├── UserHome.jsx        # Displays the feed of active articles for standard users.
    │   └── UserProfile.jsx     # Displays and manages the user's personal account details and password changes.
    │
    ├── Author Dashboard        # Routes nested under `/author-dashboard`
    │   ├── AuthorDashboard.jsx # Layout wrapper specifically for the Author section.
    │   ├── AuthorProfile.jsx   # Displays the author's account details.
    │   ├── AuthorArticles.jsx  # Displays a list of ONLY the articles written by the logged-in author.
    │   ├── WriteArticle.jsx    # Form to create a new article.
    │   └── EditArticleForm.jsx # Form to edit an existing article (pre-populated with existing data).
    │
    ├── Admin Dashboard         # Routes nested under `/admin-dashboard`
    │   ├── AdminDashboard.jsx  # Layout wrapper specifically for the Admin section.
    │   ├── AdminHome.jsx       # The main admin control panel. Displays system statistics, a master list of all articles, and user management tools (block/unblock).
    │   └── AdminProfile.jsx    # Displays the admin's personal account details.
    │
    └── Articles                
        └── ArticleByID.jsx     # Displays a single, full article based on the URL parameter. Includes the comment section where users can add new comments.
```

---

## 🚏 5. Routing Strategy (`React Router v7`)

The application uses nested routing to create persistent layouts and logically group related pages.

### Top-Level Architecture
- All routes are wrapped inside `<RootLayout />`, meaning the `Header` and `Footer` are always visible (unless explicitly hidden by internal logic).
- **Public Routes:** `/`, `/login`, `/register`, `/unauthorized`.
- **Protected Dashboards:** The application separates experiences based on roles.
  - `/user-dashboard/*` (Protected by `["USER"]`)
  - `/author-dashboard/*` (Protected by `["AUTHOR"]`)
  - `/admin-dashboard/*` (Protected by `["ADMIN"]`)

### Route Protection Mechanics (`ProtectedRoute.jsx`)
When a user attempts to access a protected route (e.g., `/author-dashboard/write-article`):
1. `ProtectedRoute` intercepts the render.
2. It checks `isAuth` and `currentUser.role` from the Zustand `authStore`.
3. If not logged in, it redirects to `/login`.
4. If logged in but the role does not match the `allowedRoles` prop (e.g., a USER trying to access an AUTHOR route), it redirects to `/unauthorized`.
5. If valid, it renders the `children` components.

---

## 🧠 6. State Management (`Zustand`)

The `authStore.js` file is the central brain for authentication on the frontend.

**State Variables:**
- `isAuth` (boolean): `true` if the user is successfully logged in.
- `currentUser` (object | null): Contains user details (firstName, role, profileImageUrl, email) decoded from the backend.

**Core Actions:**
- `login(userCred)`: Makes a POST request to `/common-api/login`. On success, updates `isAuth` to `true` and saves the user data.
- `logout()`: Makes a GET request to `/common-api/logout` to clear the backend cookie, then resets local state to `isAuth: false` and `currentUser: null`.
- `checkAuth()`: The most critical function. Called when the app first loads (usually inside `App.jsx` or `RootLayout`). Makes a GET request to `/common-api/check-auth`. Because the backend relies on HTTP-only cookies (which the frontend cannot read directly), this endpoint tells the frontend if the user still has a valid session. If yes, it hydrates the Zustand store automatically, preventing the user from being logged out on a page refresh.

---

## 🌐 7. API Integration (`Axios`)

All API requests are made using `axios`.
- **Dynamic Base URL:** Located in `src/config/apiConfig.js`. Vite exposes `import.meta.env.MODE`. If it is `'production'`, the app routes requests to the Render URL. Otherwise, it points to `http://localhost:4000`.
- **Credentials:** Because authentication relies on HTTP-only cookies, requests that require authentication or modifying session state (like login, check-auth) must be configured with `withCredentials: true` in Axios, or the browser will refuse to send the cookie to the backend.

---
*End of documentation. Everything required to understand, build, and modify the frontend is documented above.*
