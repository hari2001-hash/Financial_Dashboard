import React, { useState } from "react";
import "./login.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: undefined,
    }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOAuthLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setApiError("");
    if (validate()) {
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccess(true);
          setFormData({ email: "", password: "" });
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        } else {
          setApiError(data.error || "Login failed.");
        }
      } catch (err) {
        setApiError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <h2 className="login-title">Log In</h2>
      
        <div className="or-divider">
          <span>or</span>
        </div>
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div style={{ width: "100%" }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              autoComplete="email"
            />
            {errors.email && <div className="login-error">{errors.email}</div>}
          </div>
          <div style={{ width: "100%" }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="login-error">{errors.password}</div>
            )}
          </div>
          {apiError && (
            <div className="login-error" style={{ marginTop: "10px" }}>
              {apiError}
            </div>
          )}
          <button type="submit" className="login-btn">
            Log In
          </button>
          {success && (
            <div className="login-success" style={{ marginTop: "10px" }}>
              Login successful! Redirecting...
            </div>
          )}
        </form>
        <p className="login-register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;



