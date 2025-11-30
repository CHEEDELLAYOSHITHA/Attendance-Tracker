import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '../fontAwesome';
import '../stylesheets/NotFound.css';

const NotFound = () => (
  <div className="not-found-container">
    <div className="not-found-content">
      <div className="error-illustration">
        <FontAwesomeIcon icon="map-marked-alt" />
      </div>
      <h1 className="error-title">Page Not Found</h1>
      <p className="error-message">
        The requested page doesn't exist or may have been moved.
      </p>
      <Link to="/" className="home-link">
        <FontAwesomeIcon icon="arrow-left" /> Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;