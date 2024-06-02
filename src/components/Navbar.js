import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import permissions from "../utils/permissions";
import userImage from '../user.png';

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState({
    name: localStorage.getItem("loggedInUsername") || null,
    level: localStorage.getItem("loggedInUserLevel") || null,
  });
  const navigate = useNavigate();

  const userPermissions = permissions[loggedInUser.level] || [];

  useEffect(() => {
    setLoggedInUser({
      name: localStorage.getItem("loggedInUsername") || null,
      level: localStorage.getItem("loggedInUserLevel") || null,
    });
  }, [localStorage.getItem("loggedInUsername")]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      setLoggedInUser({});
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
          {loggedInUser.name && (
            <>
              {userPermissions.includes("userActions") ? (
                <li style={navItemStyle}>
                  <Link to="/users" style={navLinkStyle}>
                    Users
                  </Link>
                </li>
              ) : null}
              {userPermissions.includes("subjectActions") ? (
                <li style={navItemStyle}>
                  <Link to="/subject-list" style={navLinkStyle}>
                    Subjects
                  </Link>
                </li>
              ) : null}
              {userPermissions.includes("componentActions") ? (
                <li style={navItemStyle}>
                  <Link to="/components" style={navLinkStyle}>
                    Components
                  </Link>
                </li>
              ) : null}
              {userPermissions.includes("outcomeActions") ? (
                <li style={navItemStyle}>
                  <Link to="/outcomes" style={navLinkStyle}>
                    Outcomes
                  </Link>
                </li>
              ) : null}
              {userPermissions.includes("reportActions") ? (
                <li style={navItemStyle}>
                  <Link to="/reports" style={navLinkStyle}>
                    Reports
                  </Link>
                </li>
              ) : null}
            </>
          )}
        </ul>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px'}}>
          <img src={userImage} style={{width: '40px', height: '40px', borderRadius: '20px'}} alt="" />
          {loggedInUser ? (
              <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout
              </button>
          ) : null}
        </div>
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
  maxWidth: "90%",
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
  fontWeight: "bold",
  backgroundColor: "#ff6242",
  borderRadius: '10px',
  height: "30px",
  width: '80px',
  cursor: "pointer",
};

export default Navbar;
