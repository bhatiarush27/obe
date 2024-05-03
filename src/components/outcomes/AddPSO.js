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

function AddPSO() {
  const [psoDetails, setPsoDetails] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5001/api/psos', psoDetails);
      alert('pso added successfully');
      // Clear form fields after successful submission
      setPsoDetails({
        name: '',
        description: ''
      });
    } catch (error) {
      console.error('Error adding pso:', error);
      alert('Failed to add pso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setPsoDetails(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={containerStyle}>
      <h2>Add PSO</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <input type="text" placeholder="PSO Name(Id)" value={psoDetails.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} required />
        </div>
        <div style={formGroupStyle}>
          <input type="text" placeholder="description" value={psoDetails.psoname} onChange={(e) => handleChange('description', e.target.value)} style={inputStyle} required />
        </div>
        <button type="submit" disabled={isLoading} style={isLoading ? disabledButtonStyle : buttonStyle}>{isLoading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}

export default AddPSO;
