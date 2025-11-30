import React, { useState, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';
import '../stylesheets/AdminDashboard.css';
import { FontAwesomeIcon } from '../fontAwesome';
import API from '../api';
import AdminUserManagement from './AdminUserManagement';

const AdminDashboard = ({ token }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('attendance');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/admin/attendance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
        setFilteredLogs(res.data);
      } catch {
        setLogs([]);
        setFilteredLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  useEffect(() => {
    let filtered = [...logs];

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(log =>
        log.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.checkIn && new Date(log.checkIn).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (fromDate) {
      filtered = filtered.filter(log => new Date(log.checkIn) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(log => new Date(log.checkIn) <= new Date(toDate));
    }

    setFilteredLogs(filtered);
  }, [searchTerm, fromDate, toDate, logs]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p className="dashboard-subtitle">Manage employee attendance and users</p>
      </div>

      <div className="tabs-filters-wrapper">
        <div className="admin-tabs">
          <button
            className={`admin-tab${activeTab === 'attendance' ? ' active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button
            className={`admin-tab${activeTab === 'users' ? ' active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </div>

        {activeTab === 'attendance' && (
          <div className="filters-container">
            <div className="search-box">
              <FontAwesomeIcon icon="search" />
              <input
                type="text"
                placeholder="Search username or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="date-filters">
              <label>
                From:
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </label>
              <label>
                To:
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
              </label>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'attendance' && (
        loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon="spinner" spin /> Loading attendance data...
          </div>
        ) : (
          <div className="attendance-section">
            <div className="section-header">
              <h3>Attendance Records</h3>
              <div className="records-count">
                Showing {filteredLogs.length} of {logs.length} records
              </div>
            </div>
            <AttendanceTable logs={filteredLogs} isAdmin={true} />
          </div>
        )
      )}

      {activeTab === 'users' && <AdminUserManagement token={token} />}
    </div>
  );
};

export default AdminDashboard;



