import React from 'react';
import '../stylesheets/AttendanceTable.css';
import { FontAwesomeIcon } from '../fontAwesome';
  // import { API } from '../App';

const formatDuration = (start, end) => {
  if (!start || !end) return '-';
  
  const diffMs = end - start;
  const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
  
  return `${diffHrs.toString().padStart(2, '0')}h ${diffMins.toString().padStart(2, '0')}m`;
};

const AttendanceTable = ({ logs, isAdmin = false }) => {
  if (!logs.length) return (
    <div className="no-records">
      <div className="no-records-icon">
        <FontAwesomeIcon icon="clipboard" />
      </div>
      <h4>No attendance records</h4>
      <p>Your attendance history will appear here</p>
    </div>
  );

  return (
    <div className="table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Duration</th>
            {isAdmin && <th>Employee</th>}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => {
            const checkInDate = log.checkIn ? new Date(log.checkIn) : null;
            const checkOutDate = log.checkOut ? new Date(log.checkOut) : null;
            
            return (
              <tr key={log._id || i}>
                <td>
                  {checkInDate ? checkInDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  }) : '-'}
                </td>
                <td className={!checkInDate ? 'text-muted' : ''}>
                  {checkInDate ? checkInDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : 'Not recorded'}
                </td>
                <td className={!checkOutDate ? 'text-muted' : ''}>
                  {checkOutDate ? checkOutDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : 'Not recorded'}
                </td>
                <td>
                  {checkInDate && checkOutDate ? (
                    <span className="duration-badge">
                      {formatDuration(checkInDate, checkOutDate)}
                    </span>
                  ) : '-'}
                </td>
                {isAdmin && log.user && <td>{log.user.username}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;