import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import Header2 from "../../components/header/Header2";
import BottomNav from "../../components/BottomNav/BottomNav";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fakeUser = { username: "John Doe", email: "test@example.com" };

  const handleSignIn = () => {
    if (email === "test@example.com" && password === "password123") {
      localStorage.setItem("user", JSON.stringify(fakeUser));
      navigate("/profile"); // Navigate to Profile page after login
    } else {
      alert("Invalid email or password. Use 'test@example.com' and 'password123'.");
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
