import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import permissions from "../utils/permissions";

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
                  <Link to="/subjects" style={navLinkStyle}>
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
  fontWeight: "bold",
  backgroundColor: "red",
  height: "20px",
  cursor: "pointer",
};

export default Navbar;
