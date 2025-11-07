import React from "react";
import { Navigate } from "react-router-dom";
import { checkUser } from "../Auth/AuthService";

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to /auth if user is not authenticated
 */
const ProtectedRoute = ({ element: Component, ...rest }) => {
  console.log("ProtectedRoute: Checking authentication for component:", Component);
  
  // Check if user is authenticated
  if (checkUser()) {
    // User is authenticated, render the component
    return <Component {...rest} />;
  } else {
    // User is not authenticated, redirect to auth
    console.log("ProtectedRoute: User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
};

export default ProtectedRoute;