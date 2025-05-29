// import React, { useState, useEffect } from "react";

// export default function ProfilePage() {
//   const [profile, setProfile] = useState({ name: "", email: "" });
//   const [form, setForm] = useState({ name: "", email: "" });
//   const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
//   const [saving, setSaving] = useState(false);
//   const [passwordSaving, setPasswordSaving] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [pwMsg, setPwMsg] = useState("");

//   useEffect(() => {
//     fetch("/api/profile", { credentials: "include" })
//       .then(res => res.json())
//       .then(data => {
//         setProfile(data);
//         setForm(data);
//       });
//   }, []);

//   const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
//   const handlePwChange = (e) => setPasswordForm(f => ({ ...f, [e.target.name]: e.target.value }));

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setMsg("");
//     const res = await fetch("/api/profile", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(form),
//     });
//     if (res.ok) {
//       setMsg("Profile updated!");
//       setProfile(form);
//     } else {
//       setMsg("Failed to update profile.");
//     }
//     setSaving(false);
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     setPasswordSaving(true);
//     setPwMsg("");
//     const res = await fetch("/api/profile/password", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(passwordForm),
//     });
//     setPwMsg(res.ok ? "Password updated!" : "Failed to change password.");
//     setPasswordSaving(false);
//     if (res.ok) setPasswordForm({ currentPassword: "", newPassword: "" });
//   };

//   return (
//     <div style={{ maxWidth: 450, margin: "24px auto", background: "#fff", borderRadius: 10, padding: 28, boxShadow: "0 2px 12px #0001" }}>
//       <h2 style={{ marginTop: 0 }}>Profile</h2>
//       <form onSubmit={handleSave}>
//         <div>
//           <label>Name<br/>
//             <input name="name" type="text" value={form.name} onChange={handleChange} style={{ width: "100%", padding: 8, margin: "6px 0" }} />
//           </label>
//         </div>
//         <div>
//           <label>Email<br/>
//             <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: 8, margin: "6px 0" }} />
//           </label>
//         </div>
//         <button type="submit" disabled={saving} style={{ marginTop: 12, padding: "10px 22px" }}>
//           {saving ? "Saving..." : "Save"}
//         </button>
//         {msg && <div style={{ marginTop: 8, color: msg.includes("updated") ? "green" : "red" }}>{msg}</div>}
//       </form>
//       <hr style={{ margin: "24px 0" }} />
//       <h3>Change Password</h3>
//       <form onSubmit={handleChangePassword}>
//         <div>
//           <label>Current Password<br/>
//             <input name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePwChange} style={{ width: "100%", padding: 8, margin: "6px 0" }} />
//           </label>
//         </div>
//         <div>
//           <label>New Password<br/>
//             <input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePwChange} style={{ width: "100%", padding: 8, margin: "6px 0" }} />
//           </label>
//         </div>
//         <button type="submit" disabled={passwordSaving} style={{ marginTop: 12, padding: "10px 22px" }}>
//           {passwordSaving ? "Updating..." : "Change Password"}
//         </button>
//         {pwMsg && <div style={{ marginTop: 8, color: pwMsg.includes("updated") ? "green" : "red" }}>{pwMsg}</div>}
//       </form>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        // Defensive: check for error or null/undefined
        if (!data || data.error) {
          setLoadError(data?.error || "Failed to load profile. Are you logged in?");
          setProfile({ name: "", email: "" });
          setForm({ name: "", email: "" });
        } else {
          setProfile(data);
          setForm(data);
        }
      })
      .catch(() => {
        setLoadError("Failed to load profile. Are you logged in?");
        setProfile({ name: "", email: "" });
        setForm({ name: "", email: "" });
      });
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePwChange = (e) => setPasswordForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg("Profile updated!");
      setProfile(form);
    } else {
      const err = await res.json().catch(() => ({}));
      setMsg(err?.error || "Failed to update profile.");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPwMsg("");
    const res = await fetch("/api/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(passwordForm),
    });
    if (res.ok) {
      setPwMsg("Password updated!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } else {
      const err = await res.json().catch(() => ({}));
      setPwMsg(err?.error || "Failed to change password.");
    }
    setPasswordSaving(false);
  };

  if (loadError) {
    return (
      <div style={{ color: "red", textAlign: "center", margin: "40px auto" }}>
        {loadError}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 450, margin: "24px auto", background: "#fff", borderRadius: 10, padding: 28, boxShadow: "0 2px 12px #0001" }}>
      <h2 style={{ marginTop: 0 }}>Profile</h2>
      <form onSubmit={handleSave}>
        <div>
          <label>Name<br/>
            <input name="name" type="text" value={form.name} onChange={handleChange} style={{ width: "100%", padding: 8, margin: "6px 0" }} />
          </label>
        </div>
        <div>
          <label>Email<br/>
            <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: 8, margin: "6px 0" }} />
          </label>
        </div>
        <button type="submit" disabled={saving} style={{ marginTop: 12, padding: "10px 22px" }}>
          {saving ? "Saving..." : "Save"}
        </button>
        {msg && <div style={{ marginTop: 8, color: msg.includes("updated") ? "green" : "red" }}>{msg}</div>}
      </form>
      <hr style={{ margin: "24px 0" }} />
      <h3>Change Password</h3>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Current Password<br/>
            <input name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePwChange} style={{ width: "100%", padding: 8, margin: "6px 0" }} />
          </label>
        </div>
        <div>
          <label>New Password<br/>
            <input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePwChange} style={{ width: "100%", padding: 8, margin: "6px 0" }} />
          </label>
        </div>
        <button type="submit" disabled={passwordSaving} style={{ marginTop: 12, padding: "10px 22px" }}>
          {passwordSaving ? "Updating..." : "Change Password"}
        </button>
        {pwMsg && <div style={{ marginTop: 8, color: pwMsg.includes("updated") ? "green" : "red" }}>{pwMsg}</div>}
      </form>
    </div>
  );
}