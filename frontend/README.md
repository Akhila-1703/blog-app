<div align="center">

# 🎨 Frontend Architecture & UI Documentation

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State-black?logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)

This document details the frontend implementation: a lightning-fast Single Page Application (SPA) utilizing modern React paradigms, utility-first CSS, and boilerplate-free state management.

</div>

---

## 🏗️ 1. Core Architecture & Routing State Machine

The frontend relies heavily on **React Router v7** for layout persistence and role-based route guarding. Global state (User Session) is hoisted into **Zustand**, allowing any component to subscribe to authentication changes without prop drilling.

### Routing & Component Topology

```mermaid
graph TD
    Root[RootLayout.jsx] --> Header[Header.jsx]
    Root --> Outlet[Router Outlet]
    Root --> Footer[Footer.jsx]
    Root --> Toaster[react-hot-toast]

    Outlet --> Public[Public Routes]
    Outlet --> Protected[Protected Dashboard Routes]

    subgraph Public Routes
        Public --> Home[Home.jsx]
        Public --> Auth[Login/Register.jsx]
        Public --> Article[ArticleByID.jsx]
        Public --> Unauth[Unauthorized.jsx]
    end

    subgraph Protected Routes (Guarded by ProtectedRoute.jsx)
        Protected -->|Role: USER| UserDash[UserDashboard.jsx]
        Protected -->|Role: AUTHOR| AuthorDash[AuthorDashboard.jsx]
        Protected -->|Role: ADMIN| AdminDash[AdminDashboard.jsx]
        
        UserDash --> UHome[UserHome.jsx]
        AuthorDash --> Write[WriteArticle.jsx]
        AdminDash --> AHome[AdminHome.jsx]
    end

    Header -.->|Reads state| Zustand[(Zustand authStore)]
    Protected -.->|Verifies Role| Zustand
```

---

## 📦 2. Complete Technology Stack & Dependencies

| Package | Version | Technical Implementation Details |
| :--- | :--- | :--- |
| `react` & `dom` | `^19.2.0` | Uses modern hooks. `ErrorBoundary` wraps the router for graceful UI degradation on fatal JS errors. |
| `vite` | `^7.3.1` | Build tool. Replaces CRA/Webpack. Environment variables (`import.meta.env`) are used to switch API bases. |
| `tailwindcss` | `^4.2.1` | Utility classes injected directly into JSX. Responsive prefixes (`md:`, `lg:`) handle mobile-first design. |
| `react-router` | `^7.13.1` | Configured using the modern `createBrowserRouter` API. Enables nested layouts (e.g., persistent dashboards). |
| `zustand` | `^5.0.11` | Exposes `useAuthStore` hook. Contains `isAuth` boolean, `currentUser` object, and mutation functions (`login`, `logout`, `checkAuth`). |
| `react-hook-form` | `^7.71.2` | Uncontrolled form inputs. Handles validation for Auth forms and Article editors without causing expensive re-renders. |
| `axios` | `^1.13.6` | HTTP Client. **Critical:** Configured with `withCredentials: true` globally so that HTTP-Only JWT cookies are sent to the backend. |

---

## 🧠 3. State Management (Zustand) Deep Dive

Unlike Redux, Zustand provides a simplified, hook-based store. The `authStore.js` is the central brain of the client application.

**The `checkAuth` Lifecycle:**
1. Upon initial page load, `App.jsx` triggers `authStore.getState().checkAuth()`.
2. Axios hits `/common-api/check-auth` on the backend.
3. The backend reads the HTTP-Only cookie.
4. If valid, Zustand hydrates `currentUser` and sets `isAuth: true`.
5. *Result:* The user remains logged in across hard refreshes without exposing the JWT to client-side JavaScript.

---

## 📂 4. Deep-Dive Directory Structure

```text
frontend/src/
├── main.jsx                    # Entry point. Mounts React tree.
├── App.jsx                     # Router config. Maps URLs to Components.
├── index.css                   # Tailwind entry point.
│
├── config/                     
│   └── apiConfig.js            # Env-aware API base URL logic.
│
├── store/                      
│   └── authStore.js            # Zustand definition.
│
└── components/                 # View Layer
    ├── RootLayout.jsx          # Persistent UI (Nav/Footer).
    ├── ProtectedRoute.jsx      # HOC interceptor. Checks Role against Zustand.
    ├── Auth/                   # Login.jsx, Register.jsx
    ├── Dashboards/             # UserDashboard, AuthorDashboard, AdminDashboard
    └── Articles/               # ArticleByID, EditArticle, WriteArticle
```

---

## 🛡️ 5. Role-Based Route Guarding

The `<ProtectedRoute />` component is a Higher Order Component (HOC) that wraps sensitive dashboard routes.

**Logic Flow:**
1. Extracts `allowedRoles` array passed as a prop (e.g., `["AUTHOR"]`).
2. Reads current user role from Zustand.
3. **If not logged in:** Redirects `Navigate to="/login"`.
4. **If logged in but wrong role:** Redirects `Navigate to="/unauthorized"`.
5. **If valid:** Returns `<Outlet />` or `children`.

---
<div align="center">
  <i>Developed for maximum performance and UX.</i>
</div>
