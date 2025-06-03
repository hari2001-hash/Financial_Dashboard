import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GoalDashboard.css"; // Import the CSS file

const API_URL = "http://localhost:5000/api/goals";
const USER_ID = "USER123"; // Replace with your authentication logic

function GoalProgressBar({ current, target }) {
  const percent = Math.min(100, (current / target) * 100);
  return (
    <div className="goal-progress-bar">
      <div className="goal-progress-bar-bg">
        <div
          className="goal-progress-bar-fg"
          style={{
            width: `${percent}%`,
            background: percent === 100 ? "#4caf50" : "#2196f3",
          }}
        />
      </div>
      <span className="goal-progress-bar-label">
        ${current.toLocaleString()} / ${target.toLocaleString()} ({percent.toFixed(1)}%)
      </span>
    </div>
  );
}

export default function GoalDashboard() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: 0,
    deadline: "",
  });

  useEffect(() => {
    axios.get(`${API_URL}/${USER_ID}`).then((res) => setGoals(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, userId: USER_ID, targetAmount: Number(form.targetAmount), currentAmount: Number(form.currentAmount) };
    await axios.post(API_URL, data);
    setGoals((await axios.get(`${API_URL}/${USER_ID}`)).data);
    setForm({ title: "", description: "", targetAmount: "", currentAmount: 0, deadline: "" });
    setShowForm(false);
  };

  const updateCurrentAmount = async (goalId, newAmount) => {
    await axios.put(`${API_URL}/${goalId}`, { currentAmount: Number(newAmount) });
    setGoals((await axios.get(`${API_URL}/${USER_ID}`)).data);
  };

  const deleteGoal = async (goalId) => {
    await axios.delete(`${API_URL}/${goalId}`);
    setGoals((await axios.get(`${API_URL}/${USER_ID}`)).data);
  };

  return (
    <div className="goal-dashboard-container">
      <h2 className="goal-dashboard-title">My Financial Goals</h2>
      <button className="goal-toggle-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Goal"}
      </button>
      {showForm && (
        <form className="goal-form" onSubmit={handleSubmit}>
          <input
            className="goal-form-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Goal Title"
            required
          />
          <input
            className="goal-form-input"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            className="goal-form-input"
            name="targetAmount"
            type="number"
            value={form.targetAmount}
            onChange={handleChange}
            placeholder="Target Amount"
            required
          />
          <input
            className="goal-form-input"
            name="currentAmount"
            type="number"
            value={form.currentAmount}
            onChange={handleChange}
            placeholder="Current Amount"
          />
          <input
            className="goal-form-input"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            placeholder="Deadline"
            required
          />
          <button className="goal-create-btn" type="submit">Create Goal</button>
        </form>
      )}
      <ul className="goal-list">
        {goals.map((g) => (
          <li key={g._id} className="goal-item">
            <div className="goal-header">
              <h3>{g.title}</h3>
              <button className="goal-delete-btn" onClick={() => deleteGoal(g._id)}>
                &times;
              </button>
            </div>
            <p className="goal-description">{g.description}</p>
            <GoalProgressBar current={g.currentAmount} target={g.targetAmount} />
            <div className="goal-deadline">Deadline: {new Date(g.deadline).toLocaleDateString()}</div>
            <form
              className="goal-update-form"
              onSubmit={(e) => {
                e.preventDefault();
                updateCurrentAmount(g._id, e.target.elements.updAmount.value);
                e.target.reset();
              }}
            >
              <input
                className="goal-update-input"
                name="updAmount"
                type="number"
                min="0"
                placeholder="Update Amount"
              />
              <button className="goal-update-btn" type="submit">Update Progress</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}