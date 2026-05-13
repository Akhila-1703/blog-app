import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {

  const {
    loading,
    currentUser,
    isAuthenticated
  } = useAuth();

  //auth loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  //not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //role authorization
  if (
    allowedRoles &&
    !allowedRoles.includes(currentUser?.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ redirectTo: "/" }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;