import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Protected = ({ children, role }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check only if role prop is provided
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;