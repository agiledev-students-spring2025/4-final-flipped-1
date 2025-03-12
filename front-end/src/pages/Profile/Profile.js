import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Header from "../../components/header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check for user authentication on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/signin"); // Redirect if not logged in
    }
  }, [navigate]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Force UI update
    navigate("/signin"); // Redirect to sign-in page
  };

  return (
    <div className="profile-container">
      <Header title="Profile" />

      <div className="profile-content">
        {user ? (
          <div className="profile-info">
            <div className="profile-photo">
              <p>Upload Photo</p>
            </div>
            <p><strong>Username:</strong> {user.username || "Lorem Ipsum"}</p>
            <p><strong>Email:</strong> {user.email || "example@email.com"}</p>

            <div className="password-section">
              <label>Original Password:</label>
              <input type="password" placeholder="Enter current password" />
              <label>New Password:</label>
              <input type="password" placeholder="Enter new password" />
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <p>Redirecting...</p> // Shows briefly before redirection
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
