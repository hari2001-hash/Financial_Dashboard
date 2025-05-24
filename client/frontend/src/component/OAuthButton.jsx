import React from 'react';

export default function OAuthButton() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };
  return (
    <button className="oauth-btn" onClick={handleGoogleLogin}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
        alt="Google"
        className="oauth-icon"
      />
      Register with Google
    </button>
  );
}