import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '../fontAwesome';
import API from '../api';
import '../stylesheets/AdminUserManagement.css';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'employee', label: 'Employee' },
];

const AdminUserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({ username: '', role: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditData({ username: user.username, role: user.role });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditData({ username: '', role: '' });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    setError('');
    setSuccess('');
    try {
      await API.put(`/admin/users/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User updated successfully');
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setError('');
    setSuccess('');
    try {
      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-user-management">
      <div className="dashboard-header">
        <div>
          <h2>User Management</h2>
          <p className="dashboard-subtitle">Manage all system users and permissions</p>
        </div>
        <div className="search-box">
          <FontAwesomeIcon icon="search" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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

      {loading ? (
        <div className="loading-spinner">
          <FontAwesomeIcon icon="spinner" spin /> Loading users...
        </div>
      ) : (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {editUserId === user._id ? (
                        <div className="input-wrapper">
                          <FontAwesomeIcon icon="user" className="input-icon" />
                          <input
                            type="text"
                            name="username"
                            value={editData.username}
                            onChange={handleChange}
                          />
                        </div>
                      ) : (
                        <div className="user-info">
                          <FontAwesomeIcon icon="user" />
                          <span>{user.username}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      {editUserId === user._id ? (
                        <div className="input-wrapper">
                          <FontAwesomeIcon icon="user-tag" className="input-icon" />
                          <select
                            name="role"
                            value={editData.role}
                            onChange={handleChange}
                          >
                            {roleOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className={`role-badge ${user.role}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="actions-cell">
                      {editUserId === user._id ? (
                        <>
                          <button className="btn btn-success" onClick={() => handleSave(user._id)}>
                            <FontAwesomeIcon icon="check" /> Save
                          </button>
                          <button className="btn btn-secondary" onClick={handleCancel}>
                            <FontAwesomeIcon icon="times" /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-primary" onClick={() => handleEdit(user)}>
                            <FontAwesomeIcon icon="edit" /> Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>
                            <FontAwesomeIcon icon="trash" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-results">
                    <FontAwesomeIcon icon="user-slash" />
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;