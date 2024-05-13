// Login.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = await axios.get("http://localhost:5001/api/users");
      const currentUser = loginUser?.data.filter(
        (user) =>
          user.email === formData.email && user.username === formData.userName
      );
      console.log("arush2222", loginUser, currentUser);
      if (currentUser.length) {
        localStorage.setItem("loggedInUsername", currentUser[0].username);
        localStorage.setItem("loggedInUserLevel", currentUser[0].level);
        navigate("/");
      }
    } catch (e) {
      console.error("Error fetching login details:");
      alert(
        "Error logging in. Please check your credentials, or contact for help."
      );
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="userName">Username: </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
