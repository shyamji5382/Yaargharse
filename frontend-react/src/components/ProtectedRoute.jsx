import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Wraps a page and redirects to /login if no user is authenticated
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
