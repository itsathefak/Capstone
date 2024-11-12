import React, { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout: clientLogout } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`com-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="collapse-btn" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <ul className="com-sidebar-menu">
        {user && user.role === "Service Provider" && (
          <>
            <li>
              <NavLink to="/appointment-requests" activeClassName="active">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>Appointment Requests</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/create-service" activeClassName="active">
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>Create Service</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/upcoming-appointments" activeClassName="active">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>Upcoming Appointments</span>}
              </NavLink>
            </li>
          </>
        )}
        {user && user.role === "User" && (
          <>
            <li>
              <NavLink to="/service-list" activeClassName="active">
                <FontAwesomeIcon icon={faList} className="com-sidebar-icon" />
                {!isCollapsed && <span>Services</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/appointment-history" activeClassName="active">
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="com-sidebar-icon"
                />
                {!isCollapsed && <span>Appointment History</span>}
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
