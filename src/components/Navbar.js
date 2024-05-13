import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("loggedInUsername") || null
  );
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUsername') || null)
  }, [localStorage.getItem('loggedInUsername')])

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      setLoggedInUser(null);
      localStorage.removeItem("loggedInUsername");
      localStorage.removeItem("loggedInUserLevel");
      navigate("/login");
    }
  }; 

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={brandStyle}>
          OBEasy
        </Link>
        <ul style={navLinksStyle}>
          {loggedInUser && (
            <>
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
                <Link to="/components" style={navLinkStyle}>
                  Components
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
            </>
          )}
          {loggedInUser ? (
            <li style={navItemStyle}>
              <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

const navStyle = {
  background: "#37474F",
  color: "#FFFFFF",
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
  color: "#FFFFFF", 
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
  color: "#FFFFFF",
};

const logoutButtonStyle = {
  background: "none",
  border: "none",
  color: "white",
  fontWeight: 'bold',
  backgroundColor: 'red',
  height: '20px',
  cursor: "pointer",
};

export default Navbar;
