import React from 'react';
import '../stylesheets/Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">AP</div>
          <div className="footer-text">
            <span className="footer-system-name">AttendancePro</span>
            <p className="footer-tagline">Streamlined workforce management</p>
          </div>
        </div>
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} AttendancePro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;