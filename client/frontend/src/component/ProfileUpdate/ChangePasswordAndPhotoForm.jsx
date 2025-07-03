import React, { useState } from "react";

const ChangePasswordAndPhotoForm = ({ onPhotoUploaded }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [photoStatus, setPhotoStatus] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus("Password updated successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.error || "Failed to change password.");
      }
    } catch (err) {
      setPasswordError("Network error. Try again.");
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setPhotoStatus("");
    setPhotoError("");
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    setPhotoStatus("");
    setPhotoError("");
    if (!photoFile) {
      setPhotoError("Please select a photo to upload.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", photoFile);

      const res = await fetch("http://localhost:5000/users/upload-photo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setPhotoStatus("Profile picture updated!");
        setPhotoFile(null);
        setPreviewUrl("");
        if (onPhotoUploaded) onPhotoUploaded(data.photo);
      } else {
        setPhotoError(data.error || "Upload failed");
      }
    } catch (err) {
      setPhotoError("Network error. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Change Password</h2>
      <form onSubmit={handlePasswordSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Current Password
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
              style={{ width: "100%", marginTop: 6 }}
              autoComplete="current-password"
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              style={{ width: "100%", marginTop: 6 }}
              autoComplete="new-password"
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Confirm New Password
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", marginTop: 6 }}
              autoComplete="new-password"
            />
          </label>
        </div>
        <button type="submit" style={{ width: "100%" }}>Change Password</button>
      </form>
      {passwordStatus && <div style={{ color: "green", marginTop: 12 }}>{passwordStatus}</div>}
      {passwordError && <div style={{ color: "red", marginTop: 12 }}>{passwordError}</div>}

      <hr style={{ margin: "2rem 0" }} />

      <h2>Update Profile Picture</h2>
      <form onSubmit={handlePhotoSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ width: "100%" }}
          />
        </div>
        {previewUrl && (
          <div style={{ marginBottom: 12 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 150, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </div>
        )}
        <button type="submit" style={{ width: "100%" }}>Upload Photo</button>
      </form>
      {photoStatus && <div style={{ color: "green", marginTop: 12 }}>{photoStatus}</div>}
      {photoError && <div style={{ color: "red", marginTop: 12 }}>{photoError}</div>}
    </div>
  );
};

export default ChangePasswordAndPhotoForm;