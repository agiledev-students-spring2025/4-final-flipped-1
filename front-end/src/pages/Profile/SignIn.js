import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import Header2 from "../../components/header/Header2";
import BottomNav from "../../components/BottomNav/BottomNav";
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 检查是否有跳转提示信息
  useEffect(() => {
    const message = localStorage.getItem("loginMessage");
    if (message) {
      alert(message);
      localStorage.removeItem("loginMessage");
    }
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.PROFILE.LOGIN, {
        user_id: email,
        password: password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        const user = {
          token: response.data.token,
          user_id: response.data.user_id,
          username: response.data.username
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", response.data.token);

        // 检查用户原来想跳转的页面（redirectAfterLogin）
        const redirect = localStorage.getItem("redirectAfterLogin");
        if (redirect) {
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirect);
        } else {
          navigate("/profile");
        }

      } else {
        alert("Login failed: " + response.data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div>
      <Header2 title="Sign In" />
      <div className="signin-container">
        <div className="logo-container">
          <img src="./logo.jpg" alt="App Logo" className="app-logo" />
          <h1 className="app-title">
            Start your journey <span className="flip-highlight">with a FLIP!</span>
          </h1>
        </div>
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
        <button onClick={handleSignIn}>Sign In</button>
        <p className="register-text">
          Don't have an account with us? <span className="register-link" onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default SignIn;
