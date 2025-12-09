import React, { useState } from "react";
import { updateUserProfile } from "../Auth/AuthService";
import "./ProfileSettings.css";

const ProfileSettings = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user.username || "",
    profilePicture: user.profilePicture || "",
    reviewsAnonymous: user.reviewsAnonymous || false
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = async () => {
    if (isSaving) return;

    // Validate username
    if (editData.username.length < 3 || editData.username.length > 20) {
      alert("Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(editData.username)) {
      alert("Username can only contain letters, numbers, and underscores");
      return;
    }

    setIsSaving(true);

    try {
      const updates = {};
      
      // Only include changed fields
      if (editData.username !== user.username) {
        updates.username = editData.username;
      }
      if (editData.profilePicture !== user.profilePicture) {
        updates.profilePicture = editData.profilePicture;
      }
      if (editData.reviewsAnonymous !== user.reviewsAnonymous) {
        updates.reviewsAnonymous = editData.reviewsAnonymous;
      }

      if (Object.keys(updates).length === 0) {
        alert("No changes to save");
        setIsEditing(false);
        return;
      }

      const result = await updateUserProfile(updates);
      
      if (result) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        
        // Notify parent to refresh user data
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      username: user.username || "",
      profilePicture: user.profilePicture || "",
      reviewsAnonymous: user.reviewsAnonymous || false
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="profile-settings-edit-btn"
      >
        Edit Profile
      </button>
    );
  }

  return (
    <div className="profile-settings-form">
      <h3>Edit Profile Settings</h3>

      <div className="profile-settings-field">
        <label className="profile-settings-label">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={editData.username}
          onChange={handleChange}
          className="profile-settings-input"
          minLength="3"
          maxLength="20"
          pattern="[a-zA-Z0-9_]+"
        />
        <small className="profile-settings-help-text">
          3-20 characters, letters, numbers, and underscores only
        </small>
      </div>

      <div className="profile-settings-field">
        <label className="profile-settings-label">
          Profile Picture URL (optional)
        </label>
        <input
          type="url"
          name="profilePicture"
          value={editData.profilePicture}
          onChange={handleChange}
          placeholder="https://example.com/your-photo.jpg"
          className="profile-settings-input"
        />
        <small className="profile-settings-help-text">
          Enter a URL to your profile picture
        </small>
      </div>

      <div className="profile-settings-checkbox-container">
        <label className="profile-settings-checkbox-label">
          <input
            type="checkbox"
            name="reviewsAnonymous"
            checked={editData.reviewsAnonymous}
            onChange={handleChange}
            className="profile-settings-checkbox"
          />
          <span className="profile-settings-checkbox-text">Post reviews anonymously</span>
        </label>
        <small className="profile-settings-checkbox-help">
          When enabled, your reviews will show "Anonymous" instead of your username
        </small>
      </div>

      <div className="profile-settings-actions">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`profile-settings-save-btn ${isSaving ? "disabled" : "enabled"}`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className={`profile-settings-cancel-btn ${isSaving ? "disabled" : "enabled"}`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;