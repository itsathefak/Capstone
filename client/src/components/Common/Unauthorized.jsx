import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <section className="Unauthorized-hero">
      <div className="Unauthorized-hero-content">
        <h1 className="Unauthorized-title">Access Denied</h1>
        <p className="Unauthorized-subtitle">
          You do not have permission to view this page.
        </p>
        <p className="Unauthorized-message">
          Please log in or register to continue.
        </p>
        <div className="Unauthorized-buttons">
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
        </div>
      </div>
    </section>
  );
};

export default Unauthorized;
