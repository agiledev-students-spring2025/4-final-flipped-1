import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import Header from "../../components/header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fakeUser = { username: "John Doe", email: "test@example.com" };

  const handleSignIn = () => {
    if (email === "test@example.com" && password === "password123") {
      localStorage.setItem("user", JSON.stringify(fakeUser));
      navigate(0); // Refresh page after login to force Profile reload
    } else {
      alert("Invalid email or password. Use 'test@example.com' and 'password123'.");
    }
  };

  return (
    <div className="signin-container">
    <Header title="Profile" />
      <h2>Sign In</h2>
      <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
    
    <BottomNav />
    </div>
  );
};

export default SignIn;
