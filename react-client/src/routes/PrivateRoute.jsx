import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

    // Not logged in
  if (!userRole) {
    return <Navigate to="/" />;
  }

  // Rote for only admin
  if (role && userRole !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
