import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import Header from "../../components/header/Header2";
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { toast } from 'react-toastify';

// Basic Modal Component Structure
const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  // 清空所有输入框
  const clearInputs = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // 取消时：先清空，再关闭
  const handleCancel = () => {
    clearInputs();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match"); // English alert
      return;
    }
    onSubmit({ oldPassword, newPassword });
    clearInputs(); 
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Password</h2> {/* English Title */}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Current Password" // English Placeholder
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password" // English Placeholder
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password" // English Placeholder
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="modal-buttons">
            {/* English Button Text */}
            <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
            <button type="submit" className="confirm-btn">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ChangeUsernameModal = ({ isOpen, onClose, onSubmit }) => {
  const [newUsername, setNewUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUsername) {
      alert("Please enter a new username");
      return;
    }
    onSubmit({ newUsername });
    setNewUsername("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Username</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="confirm-btn">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};




const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isPasswordModalOpen, setisPasswordModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [totalFlipTime, setTotalFlipTime] = useState(0)


  //进入页面的时候拉用户
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser)
    if (storedUser) { setUser(storedUser); } 
    else { navigate("/signin"); }
  }, [navigate]);

  useEffect(() => {
    if (!user) return
    const fetchTotal = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.FLIPLOG.TOTAL, {
          headers: { Authorization: `jwt ${user.token}` },
          withCredentials: true
        })
        setTotalFlipTime(res.data.totalDuration)
        setError(null); 
      } catch (err) {
        console.error('fail to fetch total flip time:', err)
        if (err.response?.status === 401) {
          setError('You are not logged in');
        } else {
          setError('Failed to load total focus time');
        }
      }
    }
    fetchTotal()
  }, [user])

  //logout
const handleLogout = async () => {
  try {
    await axios.get(API_ENDPOINTS.PROFILE.LOGOUT, {
      withCredentials: true,
    });
  } catch (err) {
    console.warn("Logout request failed (can be ignored for JWT):", err);
  }

  localStorage.removeItem("user");
  localStorage.removeItem("token"); // 必加这一行
  setUser(null);
  navigate("/signin");
  window.location.reload();
};


  const handlePasswordChange = async ({ oldPassword, newPassword }) => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    try {
      const response = await axios.post(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, {
        user_id: user.user_id,
        oldPassword,
        newPassword
      });
  
      if (response.data.success) {
        alert("Password changed successfully!");
      } else {
        alert("Failed to change password: " + response.data.message);
      }
    } catch (err) {
      console.error("Change password error:", err);
      alert("Error while changing password. Please try again.");
    }
  };

  const handleUsernameChange = async ({ newUsername }) => {
    try {
      const res = await axios.post(API_ENDPOINTS.PROFILE.CHANGE_USERNAME, {
        user_id: user.user_id,
        newUsername
      }, {
        headers: {
          Authorization: `jwt ${user.token}`,
        },
        withCredentials: true
      });
  
      if (res.data.success) {
        const updatedUser = { ...user, username: res.data.username };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // toast.success("Username updated successfully!");
      } else {
        alert("Failed to update username: " + res.data.message);
      }
    } catch (err) {
      console.error("Error updating username:", err);
      alert("Server error while updating username.");
    }
  };
  
  
  // Define menu items - conditional based on user existing
  const menuItems = user ? [
    { label: `Email: ${user.user_id || 'N/A'}`, action: null, clickable: false },
    { label: "Change Password", action: () => setisPasswordModalOpen(true), clickable: true },
    // Display email directly, make it non-clickable by omitting action or setting clickable to false
    { label: "Change Username", action: () => setIsUsernameModalOpen(true), clickable: true },
    { label: "Logout", action: handleLogout, clickable: true },
  ] : []; // Empty array if user is not loaded yet

  return (
    <div className="profile-page-container">
      <Header title="Account" />

      <div className="profile-content-area">
        {user ? (
          <>
            <div className="profile-user-info">
              <div className="profile-avatar-placeholder">
                {/* Placeholder Icon/Image */}
              </div>
              <div className="profile-name-edit">
                 <span className="profile-username">{user.username || "User"}</span>
                 <div className="edit-icon-placeholder"></div>
              </div>
              <div className="profile-stats">
                {error ? ( <span className="error-text"> {error} </span> )
                  : ( <span>🕒 Total focus time: {totalFlipTime} seconds</span> ) }
              </div>
               <div className="profile-summary-stats">
                 <span><div className="stat-icon-placeholder green"></div> 98%</span>
                 <span><div className="stat-icon-placeholder blue"></div> 4039</span>
                 <span><div className="stat-icon-placeholder teal"></div> 1</span>
              </div>
            </div>

            <div className="profile-menu">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`profile-menu-item ${!item.clickable ? 'non-clickable' : ''}`}
                  onClick={item.clickable ? item.action : undefined} // Only attach onClick if clickable
                 >
                  {item.label}
                  {/* Only show arrow if clickable */}
                  {item.clickable && <span className="menu-arrow">&gt;</span>}
                </div>
              ))}
            </div>

            {/* Footer Info - Removed the server line */}
            {/* Email is now shown in the menu, so this section might be redundant or used for other info */}
            {/* <div className="profile-footer-info">
              <p>{user.email || "your-email@example.com"}</p>
            </div> */}
          </>
        ) : (
          <p>Loading...</p> // English Loading text
        )}
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setisPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />

      <ChangeUsernameModal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        onSubmit={handleUsernameChange}
      />

      <BottomNav />
    </div>
  );
};

export default Profile;
