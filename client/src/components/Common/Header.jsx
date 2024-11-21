import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/auth";
import { useAuth } from "../../utils/AuthContext";
import { fetchServicesByProvider } from "../../api/services";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [fontScale, setFontScale] = useState(() => parseFloat(localStorage.getItem('fontScale')) || 1.0);

  // Access user data and logout function from AuthContext
  const { user, logout: clientLogout } = useAuth();

  // Fetch services created by the logged-in provider
  useEffect(() => {
    const fetchServices = async () => {
      if (user && user.id && user.role === "Service Provider") {
        setLoading(true);
        setError(null);
        try {
          const fetchedServices = await fetchServicesByProvider(user.id);
          setServices(fetchedServices);
        } catch (error) {
          console.error("Failed to fetch services:", error);
          setError("Failed to fetch services");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchServices();
  }, [user]);

  // font increase/decrease functionality
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-smaller', `${0.85 * fontScale}rem`);
    root.style.setProperty('--font-size-small', `${0.875 * fontScale}rem`);
    root.style.setProperty('--font-size-body', `${0.9 * fontScale}rem`);
    root.style.setProperty('--font-size-regular', `${1 * fontScale}rem`);
    root.style.setProperty('--font-size-highlight', `${1.125 * fontScale}rem`);
    root.style.setProperty('--font-size-page-header', `${1.25 * fontScale}rem`);
    root.style.setProperty('--font-size-larger', `${1.5 * fontScale}rem`);
    root.style.setProperty('--font-size-company-header', `${1.9 * fontScale}rem`);
    root.style.setProperty('--font-size-app-title', `${2.25 * fontScale}rem`);
    root.style.setProperty('--font-size-home-features', `${2.8 * fontScale}rem`);
    root.style.setProperty('--font-size-home-stat', `${3 * fontScale}rem`);
    root.style.setProperty('--font-size-hero-title', `${4 * fontScale}rem`);

    root.style.setProperty('--font-size-t-smaller', `${0.82 * fontScale}rem`);
    root.style.setProperty('--font-size-t-small', `${0.85 * fontScale}rem`);
    root.style.setProperty('--font-size-t-body', `${0.85 * fontScale}rem`);
    root.style.setProperty('--font-size-t-regular', `${0.95 * fontScale}rem`);
    root.style.setProperty('--font-size-t-highlight', `${1.05 * fontScale}rem`);
    root.style.setProperty('--font-size-t-page-header', `${1.18 * fontScale}rem`);
    root.style.setProperty('--font-size-t-larger', `${1.4 * fontScale}rem`);
    root.style.setProperty('--font-size-t-company-header', `${1.75 * fontScale}rem`);
    root.style.setProperty('--font-size-t-app-title', `${2.1 * fontScale}rem`);
    root.style.setProperty('--font-size-t-home-features', `${2.2 * fontScale}rem`);
    root.style.setProperty('--font-size-t-home-stat', `${2.5 * fontScale}rem`);
    root.style.setProperty('--font-size-t-hero-title', `${3.2 * fontScale}rem`);

    root.style.setProperty('--font-size-m-smaller', `${0.75 * fontScale}rem`);
    root.style.setProperty('--font-size-m-small', `${0.8 * fontScale}rem`);
    root.style.setProperty('--font-size-m-body', `${0.8 * fontScale}rem`);
    root.style.setProperty('--font-size-m-regular', `${0.9 * fontScale}rem`);
    root.style.setProperty('--font-size-m-highlight', `${1 * fontScale}rem`);
    root.style.setProperty('--font-size-m-page-header', `${1.125 * fontScale}rem`);
    root.style.setProperty('--font-size-m-larger', `${1.3 * fontScale}rem`);
    root.style.setProperty('--font-size-m-company-header', `${1.45 * fontScale}rem`);
    root.style.setProperty('--font-size-m-app-title', `${1.8 * fontScale}rem`);
    root.style.setProperty('--font-size-m-home-features', `${1.9 * fontScale}rem`);
    root.style.setProperty('--font-size-m-home-stat', `${2.1 * fontScale}rem`);
    root.style.setProperty('--font-size-m-hero-title', `${2.3 * fontScale}rem`);
    
    localStorage.setItem('fontScale', fontScale);

  }, [fontScale]);

  // Handlers to increase or decrease the font scale
  const increaseFontScale = () => setFontScale(prevScale => prevScale + 0.1);
  const decreaseFontScale = () => setFontScale(prevScale => Math.max(0.1, prevScale - 0.1));


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      clientLogout();
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/edit-service/${serviceId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="app-header">
      <div className="header-logo">
        <a href="/">
          <span className="logo-text">
            Appoint<span className="logo-highlight">ME</span>
          </span>
        </a>
      </div>



      <div className="header-user" ref={dropdownRef}>
        {user ? (
          <>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
              alt="User Avatar"
              className="user-avatar"
            />
            <h2 onClick={toggleDropdown} className="username">
              {user.firstName} {user.lastName}
            </h2>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li>
                    <a href="/profile">My Profile</a>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="link-button">
                      Logout
                    </button>
                  </li>

                  {/* Conditionally show "My Services" if the user is a Service Provider */}
                  {user.role === "Service Provider" && (
                    <li>
                      <strong>My Services</strong>
                      <ul>
                        {loading ? (
                          <li>Loading services...</li>
                        ) : error ? (
                          <li>{error}</li>
                        ) : services.length > 0 ? (
                          services.map((service) => (
                            <li key={service._id}>
                              <button
                                onClick={() => handleServiceClick(service._id)}
                                className="link-button"
                              >
                                {service.name}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li>No services found</li>
                        )}
                      </ul>
                    </li>
                  )}

                  <li>
                    <hr />
                  </li>

                  <li>
                    <strong>Font Scale</strong>
                    <div className="com-font-scale-controls">
                      <button onClick={increaseFontScale} className="com-secondary-btn">+</button>
                      <span>{Math.round(fontScale * 100)}%</span>
                      <button onClick={decreaseFontScale} className="com-secondary-btn">-</button>
                    </div>
                  </li>

                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="auth-links">
            <a href="/login">Login</a> | <a href="/register">Register</a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
