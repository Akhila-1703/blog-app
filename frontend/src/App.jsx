import { createBrowserRouter, RouterProvider } from "react-router";

import RootLayout from "./components/RootLayout";

import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

import UserDashboard from "./components/UserDashboard";
import UserProfile from "./components/UserProfile";
import UserHome from "./components/UserHome";

import AuthorDashboard from "./components/AuthorDashboard";
import AuthorProfile from "./components/AuthorProfile";

import AdminDashboard from "./components/AdminDashboard";
import AdminProfile from "./components/AdminProfile";
import AdminHome from "./components/AdminHome";

import AuthorArticles from "./components/AuthorArticles";

import ArticleByID from "./components/ArticleByID";

import WriteArticle from "./components/WriteArticle";

import EditArticle from "./components/EditArticleForm";

import ProtectedRoute from "./components/ProtectedRoute";

import Unauthorized from "./components/Unauthorized";

import ErrorBoundary from "./components/ErrorBoundary";

import { Toaster } from "react-hot-toast";

function App() {

  const routerObj = createBrowserRouter([

    {
      path: "/",

      element: <RootLayout />,

      errorElement: <ErrorBoundary />,

      children: [

        // =================================================
        // HOME
        // =================================================

        {
          index: true,
          element: <Home />,
        },

        // =================================================
        // AUTH
        // =================================================

        {
          path: "register",
          element: <Register />,
        },

        {
          path: "login",
          element: <Login />,
        },

        // =================================================
        // USER
        // =================================================

        {
          path: "user-dashboard",

          element:
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>,

          children: [

            {
              index: true,
              element: <UserHome />,
            },

            {
              path: "profile",

              element:
                <ProtectedRoute allowedRoles={["USER"]}>
                  <UserProfile />
                </ProtectedRoute>,
            },

          ],
        },

        // =================================================
        // AUTHOR
        // =================================================

        {
          path: "author-dashboard",

          element:
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorDashboard />
            </ProtectedRoute>,

          children: [

            {
              index: true,
              element: <AuthorArticles />,
            },

            {
              path: "write-article",

              element:
                <ProtectedRoute allowedRoles={["AUTHOR"]}>
                  <WriteArticle />
                </ProtectedRoute>,
            },

            {
              path: "profile",

              element:
                <ProtectedRoute allowedRoles={["AUTHOR"]}>
                  <AuthorProfile />
                </ProtectedRoute>,
            },

          ],
        },

        // =================================================
        // ADMIN
        // =================================================

{
  path: "admin-dashboard",

  element:
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboard />
    </ProtectedRoute>,

  children: [

    {
      index: true,
      element: <AdminHome />,
    },

    {
      path: "profile",

      element:
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminProfile />
        </ProtectedRoute>,
    },

  ],
},

        // =================================================
        // ARTICLES
        // =================================================

        {
          path: "article/:id",
          element: <ArticleByID />,
        },

        {
          path: "edit-article/:id",

          element:
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <EditArticle />
            </ProtectedRoute>,
        },

        // =================================================
        // ERROR
        // =================================================

        {
          path: "unauthorized",
          element: <Unauthorized />,
        },

      ],
    },

  ]);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;