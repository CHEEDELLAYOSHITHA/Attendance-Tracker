import React, { useState, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';
import '../stylesheets/EmployeeDashboard.css';
import { FontAwesomeIcon } from '../fontAwesome';
import API from '../api';
import { CSVLink } from "react-csv";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EmployeeDashboard = ({ token }) => {
  const [logs, setLogs] = useState([]);
  const [teamLogs, setTeamLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [date, setDate] = useState(new Date());
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [teamSummary, setTeamSummary] = useState(null);

  // Fetch personal logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await API.get('/attendance/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);

      if (res.data.length > 0) {
        const lastLog = res.data[0];
        if (lastLog.checkIn && !lastLog.checkOut) setCurrentStatus('checked-in');
        else setCurrentStatus('checked-out');
      } else setCurrentStatus('checked-out');

      generateMonthlySummary(res.data); // Auto-generate monthly summary
    } catch {
      setLogs([]);
      setMonthlySummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch team logs
  const fetchTeamLogs = async () => {
    try {
      const res = await API.get('/attendance/team', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamLogs(res.data);
      generateTeamSummary(res.data); // Auto-generate team summary
    } catch {
      setTeamLogs([]);
      setTeamSummary(null);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchTeamLogs();
  }, []);

  const handleCheckIn = async () => {
    setMessage('');
    try {
      await API.post('/attendance/checkin', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Check-in recorded successfully');
      setCurrentStatus('checked-in');
      fetchLogs();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to check in. Please try again.');
    }
  };

  const handleCheckOut = async () => {
    setMessage('');
    try {
      await API.post('/attendance/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Check-out recorded successfully');
      setCurrentStatus('checked-out');
      fetchLogs();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to check out. Please try again.');
    }
  };

  // Generate monthly summary
  const generateMonthlySummary = (personalLogs) => {
    if (!personalLogs || personalLogs.length === 0) {
      setMonthlySummary(null);
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyLogs = personalLogs.filter(log => {
      const logDate = new Date(log.checkIn || log.createdAt);
      return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
    });

    const totalDays = monthlyLogs.length;
    const presentDays = monthlyLogs.filter(log => log.checkIn).length;
    const absentDays = totalDays - presentDays;
    const totalHours = monthlyLogs.reduce((sum, log) => {
      if (log.checkIn && log.checkOut) {
        const start = new Date(log.checkIn);
        const end = new Date(log.checkOut);
        sum += (end - start) / 3600000; // hours
      }
      return sum;
    }, 0).toFixed(2);

    setMonthlySummary({
      totalDays,
      presentDays,
      absentDays,
      totalHours
    });
  };

  // Generate team summary
  const generateTeamSummary = (teamLogsData) => {
    if (!teamLogsData || teamLogsData.length === 0) {
      setTeamSummary(null);
      return;
    }

    const today = new Date();
    const todayDateStr = today.toISOString().slice(0,10);

    const totalEmployees = new Set(teamLogsData.map(log => log.user?._id || log.employeeId)).size;
    const presentToday = teamLogsData.filter(log => log.checkIn && (new Date(log.checkIn).toISOString().slice(0,10) === todayDateStr)).length;
    const absentToday = totalEmployees - presentToday;
    const lateArrivals = teamLogsData.filter(log => log.checkIn && new Date(log.checkIn).getHours() > 9).length;

    setTeamSummary({
      totalEmployees,
      presentToday,
      absentToday,
      lateArrivals
    });
  };

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Attendance Dashboard</h2>
        <p className="dashboard-subtitle">Manage your attendance & view team stats</p>
        <div className={`status-badge ${currentStatus}`}>
          {currentStatus === 'checked-in' ? (
            <><FontAwesomeIcon icon="circle-check" /> Checked In</>
          ) : (
            <><FontAwesomeIcon icon="circle-xmark" /> Checked Out</>
          )}
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`action-message ${message.includes('successfully') ? 'success' : 'error'}`}>
          <FontAwesomeIcon icon={message.includes('successfully') ? "check-circle" : "exclamation-circle"} />
          <span>{message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={handleCheckIn} disabled={currentStatus === 'checked-in'} className="checkin-btn">
          <FontAwesomeIcon icon="fingerprint" /> Check In
        </button>
        <button onClick={handleCheckOut} disabled={currentStatus === 'checked-out'} className="checkout-btn">
          <FontAwesomeIcon icon="right-from-bracket" /> Check Out
        </button>
        <CSVLink data={logs} filename={"attendance-report.csv"} className="export-btn">
          <FontAwesomeIcon icon="file-csv" /> Export CSV
        </CSVLink>
      </div>

      {/* Monthly Summary */}
      {monthlySummary && (
        <div className="monthly-summary-card">
          <h3>Monthly Summary</h3>
          <p>Total Attendance Logs: {monthlySummary.totalDays}</p>
          <p>Present Days: {monthlySummary.presentDays}</p>
          <p>Absent Days: {monthlySummary.absentDays}</p>
          <p>Total Hours Worked: {monthlySummary.totalHours}h</p>
        </div>
      )}

      {/* Team Summary */}
      {teamSummary && (
        <div className="monthly-summary-card">
          <h3>Team Summary</h3>
          <p>Total Employees: {teamSummary.totalEmployees}</p>
          <p>Present Today: {teamSummary.presentToday}</p>
          <p>Absent Today: {teamSummary.absentToday}</p>
          <p>Late Arrivals Today: {teamSummary.lateArrivals}</p>
        </div>
      )}

      {/* Calendar Section */}
      <div className="calendar-section">
        <h3>Attendance Calendar</h3>
        <Calendar onChange={setDate} value={date} />
      </div>

      {/* Personal Attendance Table */}
      <div className="attendance-section">
        <h3>Your Attendance History</h3>
        {loading ? (
          <div className="loading-spinner">
            <FontAwesomeIcon icon="spinner" spin /> Loading records...
          </div>
        ) : (
          <AttendanceTable logs={logs} isAdmin={false} />
        )}
      </div>

      {/* Team Attendance Table */}
      <div className="team-section">
        <h3>Team Attendance Logs</h3>
        <AttendanceTable logs={teamLogs} isAdmin={true} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
