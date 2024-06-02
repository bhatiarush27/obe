import React from 'react';
import { Link } from 'react-router-dom';

const Outcomes = () => {
  return (
    <div style={containerStyle}>
      <h2>Outcomes Actions</h2>
      <div style={actionContainerStyle}>
        <div style={actionStyle}>
          <Link to="/program-outcomes" style={linkStyle}>
            {/* <img src="/images/add-user-icon.png" alt="Add User" style={iconStyle} /> */}
            <span>Program Outcomes</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/program-specific-outcomes" style={linkStyle}>
            {/* <img src="/images/view-users-icon.png" alt="View Users" style={iconStyle} /> */}
            <span>Program Specific Outcomes</span>
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

export default Outcomes;
