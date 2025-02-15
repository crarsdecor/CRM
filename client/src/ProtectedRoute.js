import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Redirect to signin if no user is logged in
  // if (!user) {
  //   return <Navigate to="/signin" />;
  // }

  // Check if the user's role is allowed; redirect if not
  // if (!allowedRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" />;
  // }
  

  // Render the protected content if all checks pass
  return children;
};

export default ProtectedRoute;
