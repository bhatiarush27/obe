import React from "react";
import { Link } from "react-router-dom";

const Components = () => {
  return (
    <div style={containerStyle}>
      <h2>Components Actions</h2>
      <div style={actionContainerStyle}>
        <div style={actionStyle}>
          <Link to="/add-ct-details" style={linkStyle}>
            <span>Add CTs and SEE Question Details</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/add-ct-marks" style={linkStyle}>
            <span>Add CTs and SEE Results</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/add-assignment-marks" style={linkStyle}>
            <span>Add Assignment Results</span>
          </Link>
        </div>
        <div style={actionStyle}>
          <Link to="/add-survey-marks" style={linkStyle}>
            <span>Add Exit Survey Results</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  textAlign: "center",
  color: "gray",
};

const actionContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginTop: "30px",
  gap: "20px",
};

const actionStyle = {
  cursor: "pointer",
};

const linkStyle = {
  textDecoration: "none",
  color: "green",
};

export default Components;
