import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { Helmet } from "react-helmet";

const Unauthorized = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if the state indicates a 404 error
  const is404 = location.state?.is404 || false;

  // Determine the message
  const message = is404
    ? "Sorry, the page you are looking for does not exist."
    : !isAuthenticated()
    ? "Please log in to continue."
    : `You do not have permission to view this page as a ${user.role}.`;

  return (
    <section className="Unauthorized-hero">
      <Helmet>
        <title>
          {is404 ? "404 Not Found | AppointMe" : "Unauthorized | AppointMe"}
        </title>
        <meta
          name="description"
          content={
            is404
              ? "The page you are looking for does not exist. Please return to the home page."
              : "You have been denied access to this page. Contact us to know more."
          }
        />
        <meta
          name="keywords"
          content={
            is404
              ? "404, not found, page not found"
              : "unauthorized, access denied, no permission"
          }
        />
      </Helmet>

      <div className="Unauthorized-hero-content">
        <h1 className="Unauthorized-title">
          {is404 ? "404 - Page Not Found" : "Access Denied"}
        </h1>
        <p className="Unauthorized-subtitle">{message}</p>
        <div className="Unauthorized-buttons">
          {is404 ? (
            <Link to="/">
              <button className="Unauthorized-button Unauthorized-button-primary">
                Go Back Home
              </button>
            </Link>
          ) : !isAuthenticated() ? (
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
