import React from 'react';
import { Link } from 'react-router-dom';

const Reports = () => {
  return (
    <div style={containerStyle}>
      <h2>Report Actions</h2>
      <div style={actionContainerStyle}>
        <div style={actionStyle}>
          <Link to="/final-report" style={linkStyle}>
            <span>View Subject Report</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/semester-report" style={linkStyle}>
            <span>View Semester report</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  textAlign: 'center',
  color: 'gray'
};

const actionContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: '30px',
  gap: '20px'
};

const actionStyle = {
  cursor: 'pointer',
};

const linkStyle = {
  textDecoration: 'none',
  color: 'green',
};

export default Reports;
