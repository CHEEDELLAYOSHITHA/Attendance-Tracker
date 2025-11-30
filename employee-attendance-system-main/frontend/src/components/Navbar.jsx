import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '../fontAwesome'; 
import '../stylesheets/Navbar.css';

const Navbar = ({ user, onLogout }) => (
  <nav className="navbar">
    <div className="navbar-container">
      <div className="navbar-brand">
        <span className="system-name">AttendancePro</span>
        <span className="system-tagline">Streamlined Workforce Management</span>
      </div>
      <div className="navbar-actions">
        {user ? (
          <div className="user-profile">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button onClick={onLogout} className="logout-btn" aria-label="Logout">
              <FontAwesomeIcon icon="sign-out-alt" />
            </button>
          </div>
        ) : (
          <Link to="/register" className="login-btn">
            <FontAwesomeIcon icon="user-plus" /> Register
          </Link>
        )}
      </div>
    </div>
  </nav>
);

export default Navbar;