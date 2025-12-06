// src/services/userService.js
const API_BASE = "http://localhost:5000/api";

function authHeader() {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUser() {
  const res = await fetch(`${API_BASE}/user`, {
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch user");
  return data;
}

export async function updateUser(profile) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(profile),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
}
