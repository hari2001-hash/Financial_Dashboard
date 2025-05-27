import React, { useState, useEffect } from "react";

// Helper for currency formatting
const formatCurrency = (amount) =>
  amount?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }) || "₹0.00";

// Helper for progress bar color
const getBarColor = (percent) => {
  if (percent > 1) return "#e04a41"; // Over budget - red
  if (percent > 0.8) return "#ffbb28"; // Nearing budget - yellow
  return "#0ba29d"; // Under budget - green
};

const defaultForm = {
  category: "",
  amount: "",
  period: "monthly",
  startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0],
};

export default function BudgetSection() {
  const [budgets, setBudgets] = useState([]);
  const [usage, setUsage] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [fetching, setFetching] = useState(true);

  // Fetch budgets and usage on mount
  useEffect(() => {
    const fetchBudgets = async () => {
      setFetching(true);
      const [budgetsRes, usageRes] = await Promise.all([
        fetch("/api/budgets", { credentials: "include" }),
        fetch("/api/budgets/usage", { credentials: "include" }),
      ]);
      setBudgets(budgetsRes.ok ? await budgetsRes.json() : []);
      setUsage(usageRes.ok ? await usageRes.json() : []);
      setFetching(false);
    };
    fetchBudgets();
  }, []);

  // Usage lookup
  const getUsage = (budget) =>
    usage.find((u) => u.budgetId === budget._id) || { amountSpent: 0, percentUsed: 0 };

  // Handle form changes for add
  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormErrors({});
  };

  // Add budget
  const handleAddBudget = async (e) => {
    e.preventDefault();
    setFormErrors({});
    if (
      !form.category.trim() ||
      !form.amount ||
      isNaN(Number(form.amount)) ||
      Number(form.amount) <= 0 ||
      !form.period ||
      !form.startDate
    ) {
      setFormErrors({ api: "All fields required and amount must be positive." });
      return;
    }
    setLoading(true);
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    if (res.ok) {
      const data = await res.json();
      setBudgets((b) => [...b, data]);
      setForm(defaultForm);
      // Refresh usage
      const usageRes = await fetch("/api/budgets/usage", { credentials: "include" });
      setUsage(usageRes.ok ? await usageRes.json() : []);
    } else {
      setFormErrors({ api: "Failed to add budget." });
    }
    setLoading(false);
  };

  // Edit logic
  const handleEditClick = (b) => {
    setEditingId(b._id);
    setEditForm({
      category: b.category,
      amount: b.amount,
      period: b.period,
      startDate: b.startDate.split("T")[0],
    });
    setEditErrors({});
  };
  const handleEditFormChange = (e) => {
    setEditForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setEditErrors({});
  };
  const handleEditSave = async (id) => {
    setEditErrors({});
    if (
      !editForm.category.trim() ||
      !editForm.amount ||
      isNaN(Number(editForm.amount)) ||
      Number(editForm.amount) <= 0 ||
      !editForm.period ||
      !editForm.startDate
    ) {
      setEditErrors({ api: "All fields required and amount > 0." });
      return;
    }
    const res = await fetch(`/api/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...editForm, amount: Number(editForm.amount) }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBudgets((b) => b.map((x) => (x._id === id ? updated : x)));
      setEditingId(null);
      // Refresh usage
      const usageRes = await fetch("/api/budgets/usage", { credentials: "include" });
      setUsage(usageRes.ok ? await usageRes.json() : []);
    } else {
      setEditErrors({ api: "Failed to update budget." });
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    const res = await fetch(`/api/budgets/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setBudgets((b) => b.filter((x) => x._id !== id));
      // Refresh usage
      const usageRes = await fetch("/api/budgets/usage", { credentials: "include" });
      setUsage(usageRes.ok ? await usageRes.json() : []);
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 28, marginBottom: 24, boxShadow: "0 2px 12px #0001" }}>
      <h3 style={{ marginTop: 0 }}>Budgets & Alerts</h3>
      {/* Add Budget Form */}
      <form onSubmit={handleAddBudget} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Food)"
          value={form.category}
          onChange={handleFormChange}
          style={{ flex: 2, minWidth: 100, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          min="1"
          onChange={handleFormChange}
          style={{ flex: 1, minWidth: 80, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
        />
        <select
          name="period"
          value={form.period}
          onChange={handleFormChange}
          style={{ flex: 1, minWidth: 80, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleFormChange}
          style={{ flex: 1, minWidth: 120, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
        />
        <button
          type="submit"
          style={{
            flex: "1 1 120px",
            background: "linear-gradient(90deg, #0ba29d, #c3ec52)",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 6,
            padding: "10px 0",
            fontSize: 16,
            minWidth: 100,
          }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Budget"}
        </button>
      </form>
      {Object.keys(formErrors).length > 0 && (
        <div style={{ color: "#e04a41", marginBottom: 10 }}>
          {Object.values(formErrors).join(", ")}
        </div>
      )}

      {/* Budgets Table */}
      {fetching ? (
        <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No budgets added yet.</div>
      ) : (
        <div style={{ maxHeight: 220, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f6f6f6" }}>
                <th style={{ padding: "9px 6px", textAlign: "left" }}>Category</th>
                <th style={{ padding: "9px 6px", textAlign: "right" }}>Budget</th>
                <th style={{ padding: "9px 6px", textAlign: "left" }}>Period</th>
                <th style={{ padding: "9px 6px", textAlign: "left" }}>Start</th>
                <th style={{ padding: "9px 6px", textAlign: "left" }}>Used</th>
                <th style={{ padding: "9px 6px", textAlign: "left" }}>Progress</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => {
                const u = getUsage(b);
                const percent = u.percentUsed || 0;
                return (
                  <tr key={b._id} style={{ borderBottom: "1px solid #eee" }}>
                    {editingId === b._id ? (
                      <>
                        <td style={{ padding: "7px 6px" }}>
                          <input
                            type="text"
                            name="category"
                            value={editForm.category}
                            onChange={handleEditFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          />
                        </td>
                        <td style={{ padding: "7px 6px", textAlign: "right" }}>
                          <input
                            type="number"
                            name="amount"
                            value={editForm.amount}
                            min="1"
                            onChange={handleEditFormChange}
                            style={{
                              padding: "4px 6px",
                              borderRadius: 5,
                              border: "1px solid #bbb",
                              textAlign: "right",
                              width: 80,
                            }}
                          />
                        </td>
                        <td style={{ padding: "7px 6px" }}>
                          <select
                            name="period"
                            value={editForm.period}
                            onChange={handleEditFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          >
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </td>
                        <td style={{ padding: "7px 6px" }}>
                          <input
                            type="date"
                            name="startDate"
                            value={editForm.startDate}
                            onChange={handleEditFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          />
                        </td>
                        <td colSpan={2}></td>
                        <td style={{ padding: "7px 6px", display: "flex", gap: 4 }}>
                          <button
                            onClick={() => handleEditSave(b._id)}
                            style={{
                              background: "none",
                              color: "#36a900",
                              border: "none",
                              fontSize: 18,
                              cursor: "pointer",
                            }}
                            title="Save"
                          >
                            💾
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              background: "none",
                              color: "#888",
                              border: "none",
                              fontSize: 18,
                              cursor: "pointer",
                            }}
                            title="Cancel"
                          >
                            ❌
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "7px 6px" }}>{b.category}</td>
                        <td style={{ padding: "7px 6px", textAlign: "right" }}>{formatCurrency(b.amount)}</td>
                        <td style={{ padding: "7px 6px" }}>
                          {b.period.charAt(0).toUpperCase() + b.period.slice(1)}
                        </td>
                        <td style={{ padding: "7px 6px" }}>
                          {new Date(b.startDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "7px 6px" }}>
                          {formatCurrency(u.amountSpent)}{" "}
                          <span style={{ color: percent > 1 ? "#e04a41" : "#0ba29d", fontWeight: 600 }}>
                            ({Math.round(percent * 100)}%)
                          </span>
                        </td>
                        <td style={{ padding: "7px 6px", minWidth: 110 }}>
                          <div
                            style={{
                              background: "#f2f2f2",
                              borderRadius: 5,
                              width: 100,
                              height: 12,
                              overflow: "hidden",
                              display: "inline-block",
                              marginRight: 6,
                            }}
                          >
                            <div
                              style={{
                                width: Math.min(100, percent * 100) + "%",
                                height: "100%",
                                background: getBarColor(percent),
                                transition: "width 0.4s",
                              }}
                            />
                          </div>
                          {percent > 1 && (
                            <span style={{ color: "#e04a41", fontSize: 15, fontWeight: 700 }}>⚠️</span>
                          )}
                        </td>
                        <td style={{ padding: "7px 6px", display: "flex", gap: 4 }}>
                          <button
                            onClick={() => handleEditClick(b)}
                            style={{
                              background: "none",
                              color: "#007bff",
                              border: "none",
                              fontSize: 18,
                              cursor: "pointer",
                            }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            style={{
                              background: "none",
                              color: "#e04a41",
                              border: "none",
                              fontSize: 18,
                              cursor: "pointer",
                            }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {Object.keys(editErrors).length > 0 && editingId && (
            <div style={{ color: "#e04a41", marginTop: 7, marginLeft: 4 }}>
              {Object.values(editErrors).join(", ")}
            </div>
          )}
        </div>
      )}
      <div style={{ fontSize: 13, color: "#888", marginTop: 10 }}>
        <strong>Alert:</strong> If the progress bar turns red or shows ⚠️, you have exceeded your budget for that category and period.
      </div>
    </div>
  );
}