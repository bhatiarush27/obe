import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={brandStyle}>
          My App
        </Link>
        <ul style={navLinksStyle}>
          <li style={navItemStyle}>
            <Link to="/users" style={navLinkStyle}>
              Users
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link to="/subjects" style={navLinkStyle}>
              Subjects
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link to="/outcomes" style={navLinkStyle}>
              Outcomes
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link to="/final-report" style={navLinkStyle}>
              Reports
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Styles
const navStyle = {
  background: "#37474F", // Grey
  color: "#FFFFFF", // White
  padding: "10px 0",
};

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "1000px",
  margin: "0 auto",
};

const brandStyle = {
  textDecoration: "none",
  color: "#FFFFFF", // White
  fontSize: "1.5rem",
};

const navLinksStyle = {
  listStyle: "none",
  display: "flex",
  gap: "20px",
};

const navItemStyle = {
  position: "relative",
};

const navLinkStyle = {
  textDecoration: "none",
  color: "#FFFFFF", // White
};

const dropdownStyle = {
  position: "relative",
};

const dropdownContentStyle = {
  display: "none",
  position: "absolute",
  top: "100%",
  left: 0,
  background: "#FFFFFF", // White
  zIndex: 1,
};

const dropdownLinkStyle = {
  display: "block",
  padding: "10px",
  color: "#000000", // Black
  textDecoration: "none",
};

export default Navbar;
