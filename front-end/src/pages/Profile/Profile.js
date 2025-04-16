import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import BottomNav from "../../components/BottomNav/BottomNav";
import Header from "../../components/header/Header";

// Basic Modal Component Structure
const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match"); // English alert
      return;
    }
    onSubmit({ oldPassword, newPassword });
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
  };

  const handlePasswordChange = (passwords) => {
    console.log("Changing password:", passwords);
    // TODO: Implement actual password change logic with API call
    alert("Password change request submitted (backend function pending)"); // English alert
  };

  // Define menu items - conditional based on user existing
  const menuItems = user ? [
    { label: "Change Password", action: () => setIsModalOpen(true), clickable: true },
    // Display email directly, make it non-clickable by omitting action or setting clickable to false
    { label: `Email: ${user.email || 'N/A'}`, action: null, clickable: false },
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
                 {/* Placeholder for Time - Keep format or adjust as needed */}
                 <span>🕒 90 days 11 hours 9 minutes</span>
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePasswordChange}
      />

      <BottomNav />
    </div>
  );
};

export default Profile;
