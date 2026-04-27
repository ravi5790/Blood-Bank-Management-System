import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-neutral-500" data-testid="auth-loading">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role && user.role !== "admin") {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }
  return children;
};
