import React, { useEffect, useState } from "react";

function authHeader() {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ProfileUpdate() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", photo: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/user", {
          headers: { ...authHeader() }
        });
        const user = await res.json();
        if (res.ok) {
          setForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            photo: user.photo || "",
          });
        } else {
          setError("Failed to load user.");
        }
      } catch {
        setError("Failed to load user.");
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setMsg(""); setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(""); setError("");
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Profile updated!");
      } else {
        setError(data.error || "Update failed.");
      }
    } catch {
      setError("Server error.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Update Profile</h2>
      <label>Name:<br/>
        <input name="name" value={form.name} onChange={handleChange} required />
      </label><br/><br/>
      <label>Email:<br/>
        <input name="email" value={form.email} onChange={handleChange} required />
      </label><br/><br/>
      <label>Phone:<br/>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label><br/><br/>
      <label>Photo URL:<br/>
        <input name="photo" value={form.photo} onChange={handleChange} />
      </label><br/><br/>
      <button type="submit">Save</button>
      {msg && <div style={{color:"green"}}>{msg}</div>}
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}