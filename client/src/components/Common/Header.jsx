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

      <div className="header-search">
        <input type="text" placeholder="Search..." className="search-input" />
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
