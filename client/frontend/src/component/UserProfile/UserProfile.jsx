import React, { useEffect, useState } from 'react';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch('http://localhost:5000/api/user/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setForm(data);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const res = await fetch('http://localhost:5000/api/user/profile', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setProfile(data);
    setEdit(false);
    setStatus("Profile updated!");
    setTimeout(() => setStatus(""), 1500);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{maxWidth: 500, margin: '2rem auto', border: '1px solid #ccc', padding: 20, borderRadius: 8}}>
      <h2>User Profile & Settings</h2>
      {!edit ? (
        <div>
          <p><b>Name:</b> {profile.name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Notifications:</b> {profile.notifications ? "On" : "Off"}</p>
          <p><b>Theme:</b> {profile.theme}</p>
          <button onClick={() => setEdit(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Name: <input name="name" value={form.name} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Email: <input name="email" value={form.email} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Notifications:{" "}
              <input type="checkbox" name="notifications" checked={form.notifications} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Theme:{" "}
              <select name="theme" value={form.theme} onChange={handleChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEdit(false)} style={{marginLeft:8}}>Cancel</button>
        </form>
      )}
      {status && <div style={{marginTop:8, color: 'green'}}>{status}</div>}
    </div>
  );
}

export default UserProfile;