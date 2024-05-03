import React from 'react';
import { Link } from 'react-router-dom';

const Users = () => {
  return (
    <div style={containerStyle}>
      <h2>User Actions</h2>
      <div style={actionContainerStyle}>
        <div style={actionStyle}>
          <Link to="/user" style={linkStyle}>
            {/* <img src="/images/view-users-icon.png" alt="View Users" style={iconStyle} /> */}
            <span>View Users</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/add-user" style={linkStyle}>
            {/* <img src="/images/add-user-icon.png" alt="Add User" style={iconStyle} /> */}
            <span>Add User</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/edit-user" style={linkStyle}>
            {/* <img src="/images/view-users-icon.png" alt="View Users" style={iconStyle} /> */}
            <span>Edit user</span>
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
