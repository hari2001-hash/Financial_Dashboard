

// import React, { useState } from "react";
// import "./Register.css";

// // Dummy function for OAuth (replace with real logic)
// const handleOAuthRegister = () => {
//   // Redirect to your OAuth provider here (example: Google)
//   window.location.href = "http://localhost:5000/auth/google"; // Replace with your OAuth URL
// };

// const validateEmail = (email) => {
//   // Simple email regex
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// };

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     setErrors((prev) => ({
//       ...prev,
//       [e.target.name]: undefined,
//     }));
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     } else if (formData.name.trim().length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!validateEmail(formData.email.trim())) {
//       newErrors.email = "Enter a valid email address";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccess(false);
//     if (validate()) {
//       try {
//         const response = await fetch("http://localhost:5000/api/register", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             name: formData.name,
//             email: formData.email,
//             password: formData.password,
//             phone: formData.phone,
//           }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setSuccess(true);
//           setFormData({
//             name: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//             phone: "",
//           });
//         } else {
//           setErrors({ api: data.error || "Registration failed" });
//         }
//       } catch (err) {
//         setErrors({ api: "Server error. Please try again later." });
//       }
//     }
//   };

//   return (
//     <div className="register-bg">
//       <div className="register-container">
//         <h2 className="register-title">Create Account</h2>
//         <button
//           type="button"
//           className="oauth-btn"
//           onClick={handleOAuthRegister}
//         >
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
//             alt="Google"
//             className="oauth-icon"
//           />
//           Register with Google
//         </button>
//         <div className="or-divider">
//           <span>or</span>
//         </div>
//         <form onSubmit={handleSubmit} className="register-form" noValidate>
//           <div style={{ width: "100%" }}>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="register-input"
//               autoComplete="name"
//             />
//             {errors.name && <div className="register-error">{errors.name}</div>}
//           </div>
//           <div style={{ width: "100%" }}>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className="register-input"
//               autoComplete="email"
//             />
//             {errors.email && <div className="register-error">{errors.email}</div>}
//           </div>
//           <div style={{ width: "100%" }}>
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="register-input"
//               autoComplete="new-password"
//             />
//             {errors.password && <div className="register-error">{errors.password}</div>}
//           </div>
//           <div style={{ width: "100%" }}>
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="register-input"
//               autoComplete="new-password"
//             />
//             {errors.confirmPassword && (
//               <div className="register-error">{errors.confirmPassword}</div>
//             )}
//           </div>
//           <div style={{ width: "100%" }}>
//             <input
//               type="text"
//               name="phone"
//               placeholder="Phone (optional)"
//               value={formData.phone}
//               onChange={handleChange}
//               className="register-input"
//               autoComplete="tel"
//             />
//           </div>
//           {errors.api && (
//             <div className="register-error" style={{ marginTop: "10px" }}>
//               {errors.api}
//             </div>
//           )}
//           <button type="submit" className="register-btn">
//             Register
//           </button>
//           {success && (
//             <div className="register-success" style={{ marginTop: "10px" }}>
//               Registration successful! You can now <a href="/login">log in</a>.
//             </div>
//           )}
//         </form>
//         <p className="register-login-link">
//           Already have an account? <a href="/login">Log in</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;


import React, { useState } from "react";
import "./Register.css";

const handleOAuthRegister = () => {
  window.location.href = "http://localhost:5000/auth/google";
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: undefined,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (validate()) {
      try {
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setSuccess(true);
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
          });
        } else {
          setErrors({ api: data.error || "Registration failed" });
        }
      } catch (err) {
        setErrors({ api: "Server error. Please try again later." });
      }
    }
  };

  return (
    <div className="register-bg">
      <div className="register-container">
        <h2 className="register-title">Create Account</h2>
        <button
          type="button"
          className="oauth-btn"
          onClick={handleOAuthRegister}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google"
            className="oauth-icon"
          />
          Register with Google
        </button>
        <div className="or-divider">
          <span>or</span>
        </div>
        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div style={{ width: "100%" }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="register-input"
              autoComplete="name"
            />
            {errors.name && <div className="register-error">{errors.name}</div>}
          </div>
          <div style={{ width: "100%" }}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="register-input"
              autoComplete="email"
            />
            {errors.email && <div className="register-error">{errors.email}</div>}
          </div>
          <div style={{ width: "100%" }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="register-input"
              autoComplete="new-password"
            />
            {errors.password && <div className="register-error">{errors.password}</div>}
          </div>
          <div style={{ width: "100%" }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="register-input"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="register-error">{errors.confirmPassword}</div>
            )}
          </div>
          <div style={{ width: "100%" }}>
            <input
              type="text"
              name="phone"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="register-input"
              autoComplete="tel"
            />
          </div>
          {errors.api && (
            <div className="register-error" style={{ marginTop: "10px" }}>
              {errors.api}
            </div>
          )}
          <button type="submit" className="register-btn">
            Register
          </button>
          {success && (
            <div className="register-success" style={{ marginTop: "10px" }}>
              Registration successful! You can now <a href="/login">log in</a>.
            </div>
          )}
        </form>
        <p className="register-login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;