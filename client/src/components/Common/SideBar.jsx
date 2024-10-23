import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlusSquare, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink exact to="/" activeClassName="active">
            <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/create-service" activeClassName="active">
            <FontAwesomeIcon icon={faPlusSquare} className="sidebar-icon" />
            Create Service
          </NavLink>
        </li>
        <li>
          <NavLink to="/appointments" activeClassName="active">
            <FontAwesomeIcon icon={faCalendarAlt} className="sidebar-icon" />
            Appointments
          </NavLink>
        </li>
        <li>
          <NavLink to="/upcoming-appointments" activeClassName="active">
          <FontAwesomeIcon icon={faCalendarAlt} className='sidebar-icon' />
          Upcoming Appointments
          </NavLink>
        </li>
        <li>
          <NavLink to="/appointment-history" activeClassName="active">
          <FontAwesomeIcon icon={faCalendarAlt} className="sidebar-icon" />
          Appointment History
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
