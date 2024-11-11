import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const Unauthorized = () => {
  const { user, isAuthenticated } = useAuth();

  // Check if the user is authenticated and their role
  const message = !isAuthenticated()
    ? "Please log in to continue."
    : `You do not have permission to view this page as a ${user.role}.`;

  return (
    <section className="Unauthorized-hero">
      <div className="Unauthorized-hero-content">
        <h1 className="Unauthorized-title">Access Denied</h1>
        <p className="Unauthorized-subtitle">{message}</p>
        <div className="Unauthorized-buttons">
          {/* Show Login button if not authenticated */}
          {!isAuthenticated() ? (
            <>
              <Link to="/login">
                <button className="Unauthorized-button Unauthorized-button-primary">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="Unauthorized-button Unauthorized-button-secondary">
                  Register
                </button>
              </Link>
            </>
          ) : (
            // Show a generic message for users who are logged in but don't have permission
            <Link to="/">
              <button className="Unauthorized-button Unauthorized-button-primary">
                Go Back Home
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Unauthorized;
