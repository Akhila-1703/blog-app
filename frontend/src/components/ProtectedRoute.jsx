import { useAuth } from "../store/authStore";

import { Navigate } from "react-router";

function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const {
    loading,
    currentUser,
    isAuthenticated,
  } = useAuth();

  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen">

        <p className="text-lg text-gray-500">
          Loading...
        </p>

      </div>

    );
  }

  // ============================================
  // NOT AUTHENTICATED
  // ============================================

  if (
    !isAuthenticated ||
    !currentUser
  ) {

    return (

      <Navigate
        to="/login"
        replace
      />

    );
  }

  // ============================================
  // ROLE AUTHORIZATION
  // ============================================

  const userRole =
    currentUser?.role?.toUpperCase();

  if (
    allowedRoles &&
    !allowedRoles.includes(userRole)
  ) {

    return (

      <Navigate
        to="/unauthorized"
        replace
      />

    );
  }

  // ============================================
  // ACCESS GRANTED
  // ============================================

  return children;
}

export default ProtectedRoute;