// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./GoalDashboard.css";

// const API_URL = "http://localhost:5000/api/goals";
// // const userId = "USER123"; // Replace with your authentication logic

// const getCurrentUserId = () => {
//   const token = localStorage.getItem('token');
//   if (!token) return null;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.userId;
//   } catch {
//     return null;
//   }
// };

// const userId = getCurrentUserId();
// function GoalProgressBar({ current, target }) {
//   const percent = Math.min(100, (current / target) * 100);
//   return (
//     <div className="goal-progress-bar">
//       <div className="goal-progress-bar-bg">
//         <div
//           className="goal-progress-bar-fg"
//           style={{
//             width: `${percent}%`,
//             background: percent === 100 ? "#4caf50" : "#2196f3",
//           }}
//         />
//       </div>
//       <span className="goal-progress-bar-label">
//         ${current.toLocaleString()} / ${target.toLocaleString()} ({percent.toFixed(1)}%)
//       </span>
//     </div>
//   );
// }

// export default function GoalDashboard() {
//   const [goals, setGoals] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     targetAmount: "",
//     currentAmount: 0,
//     deadline: "",
//   });

//   useEffect(() => {
//     axios.get(`${API_URL}/${userId}`).then((res) => setGoals(res.data));
//   }, []);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = { ...form, userId: userId, targetAmount: Number(form.targetAmount), currentAmount: Number(form.currentAmount) };
//     await axios.post(API_URL, data);
//     setGoals((await axios.get(`${API_URL}/${userId}`)).data);
//     setForm({ title: "", description: "", targetAmount: "", currentAmount: 0, deadline: "" });
//     setShowForm(false);
//   };

//   const updateCurrentAmount = async (goalId, newAmount) => {
//     await axios.put(`${API_URL}/${goalId}`, { currentAmount: Number(newAmount) });
//     setGoals((await axios.get(`${API_URL}/${userId}`)).data);
//   };

//   const deleteGoal = async (goalId) => {
//     await axios.delete(`${API_URL}/${goalId}`);
//     setGoals((await axios.get(`${API_URL}/${userId}`)).data);
//   };

//   return (
//     <div className="goal-dashboard-container">
//       <h2 className="goal-dashboard-title">My Financial Goals</h2>
//       <button className="goal-toggle-btn" onClick={() => setShowForm(!showForm)}>
//         {showForm ? "Cancel" : "Add New Goal"}
//       </button>
//       {showForm && (
//         <form className="goal-form" onSubmit={handleSubmit}>
//           <input
//             className="goal-form-input"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Goal Title"
//             required
//           />
//           <input
//             className="goal-form-input"
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Description"
//           />
//           <input
//             className="goal-form-input"
//             name="targetAmount"
//             type="number"
//             value={form.targetAmount}
//             onChange={handleChange}
//             placeholder="Target Amount"
//             required
//           />
//           <input
//             className="goal-form-input"
//             name="currentAmount"
//             type="number"
//             value={form.currentAmount}
//             onChange={handleChange}
//             placeholder="Current Amount"
//           />
//           <input
//             className="goal-form-input"
//             name="deadline"
//             type="date"
//             value={form.deadline}
//             onChange={handleChange}
//             placeholder="Deadline"
//             required
//           />
//           <button className="goal-create-btn" type="submit">Create Goal</button>
//         </form>
//       )}
//       <h3 className="goal-list-title">Your Goals</h3>
//       <ul className="goal-list">
//         {goals.length === 0 && (
//           <li className="goal-empty">No goals added yet. Start by adding a new goal!</li>
//         )}
//         {goals.map((g) => (
//           <li key={g._id} className="goal-item">
//             <div className="goal-header">
//               <h4>{g.title}</h4>
//               <button className="goal-delete-btn" onClick={() => deleteGoal(g._id)}>
//                 &times;
//               </button>
//             </div>
//             {g.description && <p className="goal-description">{g.description}</p>}
//             <GoalProgressBar current={g.currentAmount} target={g.targetAmount} />
//             <div className="goal-deadline">Deadline: {new Date(g.deadline).toLocaleDateString()}</div>
//             <form
//               className="goal-update-form"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 updateCurrentAmount(g._id, e.target.elements.updAmount.value);
//                 e.target.reset();
//               }}
//             >
//               <input
//                 className="goal-update-input"
//                 name="updAmount"
//                 type="number"
//                 min="0"
//                 placeholder="Update Amount"
//               />
//               <button className="goal-update-btn" type="submit">Update Progress</button>
//             </form>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GoalDashboard.css";

const API_URL = "http://localhost:5000/api/goals";

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
  const [userId, setUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: 0,
    deadline: "",
  });
  const [loading, setLoading] = useState(true);

  // ✅ IMPROVED: Debug token extraction
  useEffect(() => {
    console.log('🔍 Checking token...');
    const token = localStorage.getItem('token');
    console.log('Token found:', !!token, token ? token.substring(0, 20) + '...' : 'null');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('✅ Decoded payload:', payload);
        setUserId(payload.userId || payload.id); // Try both userId and id
        console.log('✅ Set userId:', payload.userId || payload.id);
      } catch (err) {
        console.error('❌ Token decode error:', err);
      }
    } else {
      console.log('❌ No token in localStorage');
    }
    setLoading(false); // ✅ Stop loading even if no token
  }, []);

  // ✅ Load goals when userId changes
  useEffect(() => {
    if (userId) {
      console.log('📥 Fetching goals for userId:', userId);
      axios.get(`${API_URL}/${userId}`)
        .then((res) => {
          console.log('✅ Goals loaded:', res.data);
          setGoals(res.data);
        })
        .catch(err => {
          console.error('❌ Goals fetch error:', err.response?.data || err.message);
        });
    }
  }, [userId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('Please login first');
      return;
    }
    try {
      const data = { 
        ...form, 
        userId, 
        targetAmount: Number(form.targetAmount), 
        currentAmount: Number(form.currentAmount) 
      };
      await axios.post(API_URL, data);
      const res = await axios.get(`${API_URL}/${userId}`);
      setGoals(res.data);
      setForm({ title: "", description: "", targetAmount: "", currentAmount: 0, deadline: "" });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating goal:', err.response?.data || err.message);
      alert('Failed to create goal');
    }
  };

  const updateCurrentAmount = async (goalId, newAmount) => {
    if (!userId) return;
    try {
      await axios.put(`${API_URL}/${goalId}`, { 
        currentAmount: Number(newAmount),
        userId 
      });
      const res = await axios.get(`${API_URL}/${userId}`);
      setGoals(res.data);
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const deleteGoal = async (goalId) => {
    if (!userId) return;
    try {
      await axios.delete(`${API_URL}/${goalId}`, { data: { userId } });
      const res = await axios.get(`${API_URL}/${userId}`);
      setGoals(res.data);
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  // ✅ Fixed loading logic
  if (loading) {
    return (
      <div className="goal-dashboard-container">
        <div className="goal-empty">
          🔍 Initializing... Check console for debug info
        </div>
      </div>
    );
  }

  // ✅ Show appropriate message
  if (!userId) {
    return (
      <div className="goal-dashboard-container">
        <div className="goal-empty">
          <p>👤 Please login to view goals</p>
          <p><small>No token found in localStorage</small></p>
        </div>
      </div>
    );
  }

  return (
    <div className="goal-dashboard-container">
      <div style={{ color: 'green', fontSize: '12px', marginBottom: '10px' }}>
        ✅ Logged in as: {userId}
      </div>
      <h2 className="goal-dashboard-title">My Financial Goals</h2>
      <button className="goal-toggle-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Goal"}
      </button>
      {/* Rest of your JSX remains exactly the same */}
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
            required
          />
          <button className="goal-create-btn" type="submit">Create Goal</button>
        </form>
      )}
      <h3 className="goal-list-title">Your Goals</h3>
      <ul className="goal-list">
        {goals.length === 0 && (
          <li className="goal-empty">No goals added yet. Start by adding a new goal!</li>
        )}
        {goals.map((g) => (
          <li key={g._id} className="goal-item">
            <div className="goal-header">
              <h4>{g.title}</h4>
              <button className="goal-delete-btn" onClick={() => deleteGoal(g._id)}>
                &times;
              </button>
            </div>
            {g.description && <p className="goal-description">{g.description}</p>}
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
