import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    username: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch all users from the database
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user selection from dropdown
  const handleUserSelect = (userId) => {
    const selectedUserData = users.find(user => user._id === userId);
    setSelectedUser(userId);
    setUserDetails(selectedUserData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:5001/api/users/${selectedUser}`, userDetails);
      alert('User updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleChange = (field, value) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={containerStyle}>
      <h2>Edit User</h2>
      <select value={selectedUser} onChange={(e) => handleUserSelect(e.target.value)} style={selectStyle}>
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      {selectedUser && (
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
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: '400px',
  margin: '0 auto',
  padding: '50px',
  borderRadius: '5px',
  backgroundColor: 'white',
  textAlign: 'center',
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  marginBottom: '20px',
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

export default EditUser;
