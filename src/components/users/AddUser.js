import React, { useState } from 'react';
import axios from 'axios';

// Define CSS styles as JavaScript constants
const containerStyle = {
  maxWidth: '400px',
  margin: '0 auto',
  padding: '50px',
  borderRadius: '5px',
  backgroundColor: 'white',
  textAlign: 'center',
};

const formGroupStyle = {
  marginBottom: '25px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#ccc',
  cursor: 'not-allowed',
};

function AddUser() {
  const [userDetails, setUserDetails] = useState({
    name: '',
    username: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5001/api/users', userDetails);
      alert('User added successfully');
      // Clear form fields after successful submission
      setUserDetails({
        name: '',
        username: '',
        email: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUserDetails(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={containerStyle}>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <input type="text" placeholder="Full Name" value={userDetails.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} required />
        </div>
        <div style={formGroupStyle}>
          <input type="text" placeholder="Username" value={userDetails.username} onChange={(e) => handleChange('username', e.target.value)} style={inputStyle} required />
        </div>
        <div style={formGroupStyle}>
          <input type="email" placeholder="Email" value={userDetails.email} onChange={(e) => handleChange('email', e.target.value)} style={inputStyle} required />
        </div>
        <button type="submit" disabled={isLoading} style={isLoading ? disabledButtonStyle : buttonStyle}>{isLoading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}

export default AddUser;
