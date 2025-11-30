import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '../fontAwesome';
import '../stylesheets/Register.css';
import API from '../api';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const res = await API.post(`/auth/register`, formData);
      setSuccess('Account created successfully! You can now log in.');
      setFormData({
        username: '',
        password: '',
        role: 'employee'
      });
      if (onRegister) onRegister(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Register for your AttendancePro account</p>
        </div>
        
        {error && (
          <div className="alert error">
            <FontAwesomeIcon icon="circle-exclamation" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert success">
            <FontAwesomeIcon icon="circle-check" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon="user" className="input-icon" />
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon="lock" className="input-icon" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon="user-tag" className="input-icon" />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="employee">Employee</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="register-btn">
            {loading ? (
              <>
                <FontAwesomeIcon icon="spinner" spin /> Creating Account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;