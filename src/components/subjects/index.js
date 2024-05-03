import React from 'react';
import { Link } from 'react-router-dom';

const Users = () => {
  return (
    <div style={containerStyle}>
      <h2>Subjects Actions</h2>
      <div style={actionContainerStyle}>
        <div style={actionStyle}>
          <Link to="/subjects" style={linkStyle}>
            {/* <img src="/images/view-users-icon.png" alt="View Users" style={iconStyle} /> */}
            <span>View all Subject list</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/add-subject" style={linkStyle}>
            {/* <img src="/images/add-user-icon.png" alt="Add User" style={iconStyle} /> */}
            <span>Add a Subject</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/edit-subject" style={linkStyle}>
            {/* <img src="/images/view-users-icon.png" alt="View Users" style={iconStyle} /> */}
            <span>Edit a Subject</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/add-ct-details" style={linkStyle}>
            <span>Add CTs and SEE question details</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/add-ct-marks" style={linkStyle}>
            <span>Add CTs and SEE results</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/add-assignment-marks" style={linkStyle}>
            <span>Add Assignment results</span>
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

export default Users;
