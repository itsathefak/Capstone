import React, { useState, useEffect, useRef } from 'react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
          <span className="logo-text">Appoint<span className="logo-highlight">ME</span></span>
        </a>
      </div>

      <div className="header-search">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <div className="header-user" ref={dropdownRef}>
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="User Avatar"
          className="user-avatar"
        />
        <h2 onClick={toggleDropdown} className="username">
          Ronnie Woodkin
        </h2>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li><a href="/profile">My Profile</a></li>
              <li><a href="/logout">Logout</a></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
