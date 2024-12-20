import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faPlusSquare,
  faCalendarCheck,
  faCalendarAlt,
  faList,
  faBars,
  faUserCog,
  faEnvelope,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`com-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="collapse-btn" onClick={toggleSidebar} aria-label="Menu">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <ul className="com-sidebar-menu">
        {/* Service Provider */}
        {user && user.role === "Service Provider" && (
          <>
            <li>
              <NavLink to="/appointment-requests" activeclassname="active" aria-label="Appointment Requests">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>Appointment Requests</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/service-list" activeclassname="active" aria-label="Services">
                <FontAwesomeIcon icon={faList} className="com-sidebar-icon" />
                {!isCollapsed && <span>Services</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/create-service" activeclassname="active" aria-label="Create Service">
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>Create Service</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/upcoming-appointments" activeclassname="active" aria-label="Upcoming Appointments">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>Upcoming Appointments</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-service" activeclassname="active" aria-label="My Services">
                <FontAwesomeIcon
                  icon={faWrench}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>My Services</span>}
              </NavLink>
            </li>
          </>
        )}

        {/* User */}
        {user && user.role === "User" && (
          <>
            <li>
              <NavLink to="/service-list" activeclassname="active" aria-label="Services">
                <FontAwesomeIcon icon={faList} className="com-sidebar-icon" />
                {!isCollapsed && <span>Services</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/appointment-history" activeclassname="active" aria-label="Appointment History">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>Appointment History</span>}
              </NavLink>
            </li>
          </>
        )}

        {/* Admin */}
        {user && user.role === "Admin" && (
          <>
            <li>
              <NavLink to="/service-list" activeclassname="active" aria-label="Service List">
                <FontAwesomeIcon icon={faList} className="com-sidebar-icon" />
                {!isCollapsed && <span>Service List</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin-contact" activeclassname="active" aria-label="Admin Contact">
                <FontAwesomeIcon icon={faEnvelope} className="com-sidebar-icon" />
                {!isCollapsed && <span>Admin Contact</span>}
              </NavLink>
            </li>
          </>
        )}

        {/* Contact Us (visible to all users) */}
        <li>
          <NavLink to="/contact-us" activeclassname="active" aria-label="Contact Us">
            <FontAwesomeIcon icon={faEnvelope} className="com-sidebar-icon" />
            {!isCollapsed && <span>Contact Us</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
