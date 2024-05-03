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

function AddPO() {
  const [poDetails, setPoDetails] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5001/api/pos', poDetails);
      alert('po added successfully');
      setPoDetails({
        name: '',
        description: ''
      });
    } catch (error) {
      console.error('Error adding po:', error);
      alert('Failed to add po');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setPoDetails(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={containerStyle}>
      <h2>Add PO</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <input type="text" placeholder="po Name(Id)" value={poDetails.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} required />
        </div>
        <div style={formGroupStyle}>
          <input type="text" placeholder="description" value={poDetails.description} onChange={(e) => handleChange('description', e.target.value)} style={inputStyle} required />
        </div>
        <button type="submit" disabled={isLoading} style={isLoading ? disabledButtonStyle : buttonStyle}>{isLoading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}

export default AddPO;
