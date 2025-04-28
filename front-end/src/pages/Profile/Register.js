import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Header2 from "../../components/header/Header2";
import BottomNav from "../../components/BottomNav/BottomNav";
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // https://localhost:3001/auth/api/signup
      const response = await axios.post(API_ENDPOINTS.PROFILE.REGISTER, {
        user_id: email,
        username,
        password
      },
      {
        withCredentials: true 
      });
      // console.log(email,username,password,confirmPassword);

      if (response.data.success) {
        alert("Registration successful!");
        navigate("/signin");
      } else {
        alert("Registration failed: " + response.data.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Error registering user. Please try again.");
    }

    // // Simulating user registration by saving to localStorage
    // const newUser = { username, email };
    // localStorage.setItem("user", JSON.stringify(newUser));

    // alert("Registration successful! You can now sign in.");
    // navigate("/signin"); // Navigate to SignIn page after registration
  };

  return (
    <div>
      <Header2 title="Register" />
      <div className="register-container">
        <h2>Create an Account</h2>

        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />

        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />

        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />

        <button onClick={handleRegister}>Register</button>
        <p className="signin-text">
          Already have an account? <span className="signin-link" onClick={() => navigate("/signin")}>Sign In</span>
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Register;
