

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Legend, CartesianGrid
} from "recharts";
import BudgetSection from "../Budget/BudgetSection";
import "./Dashboard.css";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE", "#FF6384", "#36A2EB", "#FFCE56", "#A28EFF"];

function formatCurrency(amount) {
  return amount?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }) || "₹0.00";
}

export default function Dashboard({ darkMode, toggleDarkMode }) {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transaction form
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Asset form
  const [assetForm, setAssetForm] = useState({
    name: "",
    value: "",
    date: "",
    notes: "",
  });
  const [assetFormErrors, setAssetFormErrors] = useState({});
  const [assetAddLoading, setAssetAddLoading] = useState(false);

  // Liability form
  const [liabilityForm, setLiabilityForm] = useState({
    name: "",
    value: "",
    date: "",
    notes: "",
  });
  const [liabilityFormErrors, setLiabilityFormErrors] = useState({});
  const [liabilityAddLoading, setLiabilityAddLoading] = useState(false);

  // Transaction edit
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    type: "",
    category: "",
    amount: "",
    date: "",
    notes: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Asset edit
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [editAssetForm, setEditAssetForm] = useState({
    name: "",
    value: "",
    date: "",
    notes: "",
  });
  const [editAssetErrors, setEditAssetErrors] = useState({});
  const [editAssetLoading, setEditAssetLoading] = useState(false);

  // Liability edit
  const [editingLiabilityId, setEditingLiabilityId] = useState(null);
  const [editLiabilityForm, setEditLiabilityForm] = useState({
    name: "",
    value: "",
    date: "",
    notes: "",
  });
  const [editLiabilityErrors, setEditLiabilityErrors] = useState({});
  const [editLiabilityLoading, setEditLiabilityLoading] = useState(false);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const navigate = useNavigate();

  // Initial fetch
  useEffect(() => {
    async function fetchAll() {
      try {
        const userRes = await fetch("http://localhost:5000/api/user", { credentials: "include" });
        const userData = await userRes.json();
        if (!userData || !userData.email) {
          navigate("/login");
          return;
        }
        setUser(userData);

        const [txRes, assetRes, liabilityRes] = await Promise.all([
          fetch("http://localhost:5000/api/transactions", { credentials: "include" }),
          fetch("http://localhost:5000/api/asset", { credentials: "include" }),
          fetch("http://localhost:5000/api/liability", { credentials: "include" }),
        ]);
        setTransactions(txRes.ok ? await txRes.json() : []);
        setAssets(assetRes.ok ? await assetRes.json() : []);
        setLiabilities(liabilityRes.ok ? await liabilityRes.json() : []);
      } catch (err) {
        setTransactions([]);
        setAssets([]);
        setLiabilities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [navigate]);

  // Transaction Add/Edit logic
  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors({});
    setSuccessMsg("");
  };
  const validateForm = () => {
    const errors = {};
    if (!form.type) errors.type = "Type is required";
    if (!form.category.trim()) errors.category = "Category is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errors.amount = "Enter a valid amount";
    if (!form.date) errors.date = "Date is required";
    else {
      const today = new Date();
      const input = new Date(form.date);
      if (input > today) errors.date = "Date cannot be in the future";
    }
    return errors;
  };
  const toISODate = (val) => {
    if (!val) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const parts = val.split("-");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (y && m && d) {
        return `${y.padStart(4, "20")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }
    }
    return val;
  };
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSuccessMsg("");
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          date: toISODate(form.date),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions((prev) => [data, ...prev]);
        setForm({ type: "expense", category: "", amount: "", date: "", notes: "" });
        setSuccessMsg("Transaction added!");
      } else {
        setFormErrors({ api: data.error || "Failed to add transaction." });
      }
    } catch {
      setFormErrors({ api: "Server error. Try again." });
    }
    setAddLoading(false);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      }
    } catch {}
  };
  const handleEditClick = (tx) => {
    setEditingId(tx._id);
    setEditForm({
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      date: new Date(tx.date).toISOString().split('T')[0],
      notes: tx.notes || ""
    });
    setEditErrors({});
  };
  const handleEditFormChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEditErrors({});
  };
  const handleEditSave = async (id) => {
    setEditErrors({});
    setEditLoading(true);
    if (!editForm.type || !editForm.category.trim() || !editForm.amount || isNaN(Number(editForm.amount)) || Number(editForm.amount) <= 0 || !editForm.date) {
      setEditErrors({ api: "All fields except notes are required and amount must be valid." });
      setEditLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...editForm,
          amount: Number(editForm.amount),
          date: editForm.date,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === id ? data : tx))
        );
        setEditingId(null);
      } else {
        setEditErrors({ api: data.error || "Failed to update transaction." });
      }
    } catch {
      setEditErrors({ api: "Server error. Try again." });
    }
    setEditLoading(false);
  };

  // Asset Add/Edit logic
  const handleAssetFormChange = (e) => {
    setAssetForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setAssetFormErrors({});
  };
  const validateAssetForm = () => {
    const errors = {};
    if (!assetForm.name.trim()) errors.name = "Name is required";
    if (!assetForm.value || isNaN(Number(assetForm.value)) || Number(assetForm.value) <= 0) errors.value = "Enter a valid value";
    if (!assetForm.date) errors.date = "Date is required";
    return errors;
  };
  const handleAddAsset = async (e) => {
    e.preventDefault();
    setAssetFormErrors({});
    const errors = validateAssetForm();
    if (Object.keys(errors).length > 0) {
      setAssetFormErrors(errors);
      return;
    }
    setAssetAddLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...assetForm,
          value: Number(assetForm.value)
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssets((prev) => [data, ...prev]);
        setAssetForm({ name: "", value: "", date: "", notes: "" });
      } else {
        setAssetFormErrors({ api: data.error || "Failed to add asset." });
      }
    } catch {
      setAssetFormErrors({ api: "Server error. Try again." });
    }
    setAssetAddLoading(false);
  };
  const handleDeleteAsset = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/asset/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a._id !== id));
      }
    } catch {}
  };
  const handleEditAssetClick = (a) => {
    setEditingAssetId(a._id);
    setEditAssetForm({
      name: a.name,
      value: a.value,
      date: new Date(a.date).toISOString().split('T')[0],
      notes: a.notes || ""
    });
    setEditAssetErrors({});
  };
  const handleEditAssetFormChange = (e) => {
    setEditAssetForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEditAssetErrors({});
  };
  const handleEditAssetSave = async (id) => {
    setEditAssetErrors({});
    setEditAssetLoading(true);
    if (!editAssetForm.name.trim() || !editAssetForm.value || isNaN(Number(editAssetForm.value)) || Number(editAssetForm.value) <= 0 || !editAssetForm.date) {
      setEditAssetErrors({ api: "All fields except notes are required and value must be valid." });
      setEditAssetLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/asset/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...editAssetForm,
          value: Number(editAssetForm.value),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssets((prev) =>
          prev.map((a) => (a._id === id ? data : a))
        );
        setEditingAssetId(null);
      } else {
        setEditAssetErrors({ api: data.error || "Failed to update asset." });
      }
    } catch {
      setEditAssetErrors({ api: "Server error. Try again." });
    }
    setEditAssetLoading(false);
  };

  // Liability Add/Edit logic
  const handleLiabilityFormChange = (e) => {
    setLiabilityForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLiabilityFormErrors({});
  };
  const validateLiabilityForm = () => {
    const errors = {};
    if (!liabilityForm.name.trim()) errors.name = "Name is required";
    if (!liabilityForm.value || isNaN(Number(liabilityForm.value)) || Number(liabilityForm.value) <= 0) errors.value = "Enter a valid value";
    if (!liabilityForm.date) errors.date = "Date is required";
    return errors;
  };
  const handleAddLiability = async (e) => {
    e.preventDefault();
    setLiabilityFormErrors({});
    const errors = validateLiabilityForm();
    if (Object.keys(errors).length > 0) {
      setLiabilityFormErrors(errors);
      return;
    }
    setLiabilityAddLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/liability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...liabilityForm,
          value: Number(liabilityForm.value)
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLiabilities((prev) => [data, ...prev]);
        setLiabilityForm({ name: "", value: "", date: "", notes: "" });
      } else {
        setLiabilityFormErrors({ api: data.error || "Failed to add liability." });
      }
    } catch {
      setLiabilityFormErrors({ api: "Server error. Try again." });
    }
    setLiabilityAddLoading(false);
  };
  const handleDeleteLiability = async (id) => {
    if (!window.confirm("Delete this liability?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/liability/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setLiabilities((prev) => prev.filter((l) => l._id !== id));
      }
    } catch {}
  };
  const handleEditLiabilityClick = (l) => {
    setEditingLiabilityId(l._id);
    setEditLiabilityForm({
      name: l.name,
      value: l.value,
      date: new Date(l.date).toISOString().split('T')[0],
      notes: l.notes || ""
    });
    setEditLiabilityErrors({});
  };
  const handleEditLiabilityFormChange = (e) => {
    setEditLiabilityForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEditLiabilityErrors({});
  };
  const handleEditLiabilitySave = async (id) => {
    setEditLiabilityErrors({});
    setEditLiabilityLoading(true);
    if (!editLiabilityForm.name.trim() || !editLiabilityForm.value || isNaN(Number(editLiabilityForm.value)) || Number(editLiabilityForm.value) <= 0 || !editLiabilityForm.date) {
      setEditLiabilityErrors({ api: "All fields except notes are required and value must be valid." });
      setEditLiabilityLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/liability/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...editLiabilityForm,
          value: Number(editLiabilityForm.value),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLiabilities((prev) =>
          prev.map((l) => (l._id === id ? data : l))
        );
        setEditingLiabilityId(null);
      } else {
        setEditLiabilityErrors({ api: data.error || "Failed to update liability." });
      }
    } catch {
      setEditLiabilityErrors({ api: "Server error. Try again." });
    }
    setEditLiabilityLoading(false);
  };

  // Upload Bank Statement Handler
  const handleFileUpload = async (e) => {
    setUploadError("");
    setUploadSuccess("");
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("statement", file);
    try {
      const res = await fetch("http://localhost:5000/api/upload-statement", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadSuccess(`Imported ${data.importedCount} transactions!`);
        setTransactions((prev) => [...data.newTransactions, ...prev]);
      } else {
        setUploadError(data.error || "Upload failed.");
      }
    } catch (err) {
      setUploadError("Upload failed. Try again.");
    }
    setUploading(false);
    e.target.value = "";
  };

  // Data calculations
  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const totalAssets = assets.reduce((a, b) => a + b.value, 0);
  const totalLiabilities = liabilities.reduce((a, b) => a + b.value, 0);
  const netWorth = netBalance + totalAssets - totalLiabilities;

  // Pie chart data
  const expenseByCategory = Object.values(
    transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
        return acc;
      }, {})
  );
  // Trend chart data (last 12 months)
  const monthFmt = (d) => {
    const dt = new Date(d);
    return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0");
  };
  const months = [...Array(12).keys()]
    .map(i => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return monthFmt(date);
    });
  const trendData = months.map(month => {
    const incomes = transactions
      .filter(t => t.type === "income" && monthFmt(t.date) === month)
      .reduce((a, b) => a + b.amount, 0);
    const expenses = transactions
      .filter(t => t.type === "expense" && monthFmt(t.date) === month)
      .reduce((a, b) => a + b.amount, 0);
    return { month, Income: incomes, Expense: expenses };
  });

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;
  if (!user) return null;

  return (
    <div className={`dashboard-root${darkMode ? " dark-mode" : ""}`}>
      <div className="dashboard-main">
        <div className="dashboard-header-row">
          <div className="profile-header">
            {user.photo && (
              <img src={user.photo} alt="Profile" className="profile-photo" />
            )}
            <div>
              <h2 className="dashboard-welcome">
                Welcome, {user.displayName || user.name}!
              </h2>
              <div className="dashboard-user-email">{user.email}</div>
            </div>
          </div>
          <div className="dashboard-header-btns">
            <button onClick={toggleDarkMode} className="dashboard-btn-mode">
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
              <a
              href="/stock"
              className="dashboard-btn dashboard-btn-budget"
            >
              Stocks
            </a>
               <a
              href="/goal"
              className="dashboard-btn dashboard-btn-budget"
            >
              Goal
            </a>
            <a
              href="/budget"
              className="dashboard-btn dashboard-btn-budget"
            >
              Budget
            </a>
            <a
              href="http://localhost:5000/logout"
              className="dashboard-btn dashboard-btn-logout"
            >
              Logout
            </a>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="dashboard-cards">
          <div className="card card-net-balance">
            <div>Net Balance</div>
            <div className="card-value">{formatCurrency(netBalance)}</div>
          </div>
          <div className="card card-income">
            <div>Total Income</div>
            <div className="card-value">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="card card-expense">
            <div>Total Expense</div>
            <div className="card-value">{formatCurrency(totalExpense)}</div>
          </div>
          <div className="card card-assets">
            <div>Total Assets</div>
            <div className="card-value">{formatCurrency(totalAssets)}</div>
          </div>
          <div className="card card-liabilities">
            <div>Total Liabilities</div>
            <div className="card-value">{formatCurrency(totalLiabilities)}</div>
          </div>
          <div className="card card-net-worth">
            <div>Net Worth</div>
            <div className="card-value">{formatCurrency(netWorth)}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="dashboard-charts">
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-title">
              Expenses by Category
            </div>
            {expenseByCategory.length === 0 ? (
              <div className="dashboard-chart-empty">No expenses yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {expenseByCategory.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatCurrency} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="dashboard-chart-card dashboard-chart-card-wide">
            <div className="dashboard-chart-title">
              Income vs Expense (Last 12 Months)
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#36a900" strokeWidth={3} />
                <Line type="monotone" dataKey="Expense" stroke="#e04a41" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upload Bank Statement Section */}
        <div className="dashboard-section-card">
          <h3>Upload Bank Statement (CSV)</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="dashboard-upload-input"
          />
          {uploading && <div className="dashboard-upload-msg">Uploading and parsing...</div>}
          {uploadSuccess && <div className="dashboard-upload-success">{uploadSuccess}</div>}
          {uploadError && <div className="dashboard-upload-error">{uploadError}</div>}
          <div className="dashboard-upload-hint">
            Supported: CSV with columns "Date", "Type", "Category/Description", "Amount", "Notes"<br />
            (You can export this from your bank's web portal)
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="dashboard-section-card">
          <h3>Add Transaction</h3>
          <form onSubmit={handleAddTransaction} className="dashboard-form">
            <select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              className="dashboard-input type"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input
              type="text"
              name="category"
              placeholder="Category (e.g. Food, Salary)"
              value={form.category}
              onChange={handleFormChange}
              className="dashboard-input category"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              min="1"
              onChange={handleFormChange}
              className="dashboard-input amount"
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleFormChange}
              className="dashboard-input date"
              max={new Date().toISOString().split('T')[0]}
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={handleFormChange}
              className="dashboard-input notes"
            />
            <button
              type="submit"
              className="dashboard-form-btn"
              disabled={addLoading}
            >
              {addLoading ? "Adding..." : "Add Transaction"}
            </button>
          </form>
          {Object.keys(formErrors).length > 0 &&
            <div className="dashboard-form-error">
              {Object.values(formErrors).join(", ")}
            </div>
          }
          {successMsg && <div className="dashboard-form-success">{successMsg}</div>}
        </div>

        {/* Assets Section */}
        <div className="dashboard-section-card">
          <h3>Assets</h3>
          <form onSubmit={handleAddAsset} className="asset-form">
            <input
              type="text"
              name="name"
              placeholder="Asset Name (e.g. Bank FD, Property)"
              value={assetForm.name}
              onChange={handleAssetFormChange}
              className="asset-input name"
            />
            <input
              type="number"
              name="value"
              placeholder="Value"
              value={assetForm.value}
              min="1"
              onChange={handleAssetFormChange}
              className="asset-input value"
            />
            <input
              type="date"
              name="date"
              value={assetForm.date}
              onChange={handleAssetFormChange}
              className="asset-input date"
              max={new Date().toISOString().split('T')[0]}
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes (optional)"
              value={assetForm.notes}
              onChange={handleAssetFormChange}
              className="asset-input notes"
            />
            <button
              type="submit"
              className="asset-form-btn"
              disabled={assetAddLoading}
            >
              {assetAddLoading ? "Adding..." : "Add Asset"}
            </button>
          </form>
          {Object.keys(assetFormErrors).length > 0 &&
            <div className="asset-form-error">
              {Object.values(assetFormErrors).join(", ")}
            </div>
          }
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {assets.map(a => (
                  <tr key={a._id}>
                    {editingAssetId === a._id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={editAssetForm.name}
                            onChange={handleEditAssetFormChange}
                            className="asset-edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="value"
                            value={editAssetForm.value}
                            min="1"
                            onChange={handleEditAssetFormChange}
                            className="asset-edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            name="date"
                            value={editAssetForm.date}
                            onChange={handleEditAssetFormChange}
                            className="asset-edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="notes"
                            value={editAssetForm.notes}
                            onChange={handleEditAssetFormChange}
                            className="asset-edit-input"
                          />
                        </td>
                        <td className="asset-edit-actions">
                          <button
                            onClick={() => handleEditAssetSave(a._id)}
                            className="asset-action-btn save"
                            title="Save"
                            disabled={editAssetLoading}
                          >💾</button>
                          <button
                            onClick={() => setEditingAssetId(null)}
                            className="asset-action-btn cancel"
                            title="Cancel"
                            disabled={editAssetLoading}
                          >❌</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{a.name}</td>
                        <td className="asset-value">{formatCurrency(a.value)}</td>
                        <td>{new Date(a.date).toLocaleDateString()}</td>
                        <td>{a.notes}</td>
                        <td className="asset-edit-actions">
                          <button
                            onClick={() => handleEditAssetClick(a)}
                            className="asset-action-btn edit"
                            title="Edit"
                          >✏️</button>
                          <button
                            onClick={() => handleDeleteAsset(a._id)}
                            className="asset-action-btn delete"
                            title="Delete"
                          >🗑️</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {(Object.keys(editAssetErrors).length > 0 && editingAssetId) && (
              <div className="asset-form-error asset-edit-error">
                {Object.values(editAssetErrors).join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="dashboard-section-card">
          <h3>Liabilities</h3>
          <form onSubmit={handleAddLiability} className="liability-form">
            <input
              type="text"
              name="name"
              placeholder="Liability Name (e.g. Loan, Credit Card)"
              value={liabilityForm.name}
              onChange={handleLiabilityFormChange}
              className="liability-input name"
            />
            <input
              type="number"
              name="value"
              placeholder="Value"
              value={liabilityForm.value}
              min="1"
              onChange={handleLiabilityFormChange}
              className="liability-input value"
            />
            <input
              type="date"
              name="date"
              value={liabilityForm.date}
              onChange={handleLiabilityFormChange}
              className="liability-input date"
              max={new Date().toISOString().split('T')[0]}
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes (optional)"
              value={liabilityForm.notes}
              onChange={handleLiabilityFormChange}
              className="liability-input notes"
            />
            <button
              type="submit"
              className="liability-form-btn"
              disabled={liabilityAddLoading}
            >
              {liabilityAddLoading ? "Adding..." : "Add Liability"}
            </button>
          </form>
          {Object.keys(liabilityFormErrors).length > 0 &&
            <div className="liability-form-error">
              {Object.values(liabilityFormErrors).join(", ")}
            </div>
          }
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {liabilities.map(l => (
                  <tr key={l._id}>
                    {editingLiabilityId === l._id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={editLiabilityForm.name}
                            onChange={handleEditLiabilityFormChange}
                            className="liability-edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="value"
                            value={editLiabilityForm.value}
                            min="1"
                            onChange={handleEditLiabilityFormChange}
                            className="liability-edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            name="date"
                            value={editLiabilityForm.date}
                            onChange={handleEditLiabilityFormChange}
                            className="liability-edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="notes"
                            value={editLiabilityForm.notes}
                            onChange={handleEditLiabilityFormChange}
                            className="liability-edit-input"
                          />
                        </td>
                        <td className="liability-edit-actions">
                          <button
                            onClick={() => handleEditLiabilitySave(l._id)}
                            className="liability-action-btn save"
                            title="Save"
                            disabled={editLiabilityLoading}
                          >💾</button>
                          <button
                            onClick={() => setEditingLiabilityId(null)}
                            className="liability-action-btn cancel"
                            title="Cancel"
                            disabled={editLiabilityLoading}
                          >❌</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{l.name}</td>
                        <td className="liability-value">{formatCurrency(l.value)}</td>
                        <td>{new Date(l.date).toLocaleDateString()}</td>
                        <td>{l.notes}</td>
                        <td className="liability-edit-actions">
                          <button
                            onClick={() => handleEditLiabilityClick(l)}
                            className="liability-action-btn edit"
                            title="Edit"
                          >✏️</button>
                          <button
                            onClick={() => handleDeleteLiability(l._id)}
                            className="liability-action-btn delete"
                            title="Delete"
                          >🗑️</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {(Object.keys(editLiabilityErrors).length > 0 && editingLiabilityId) && (
              <div className="liability-form-error liability-edit-error">
                {Object.values(editLiabilityErrors).join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="dashboard-section-card">
          <h3>Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div className="dashboard-table-empty">No transactions yet.</div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 20).map(tx => (
                    <tr key={tx._id}>
                      {editingId === tx._id ? (
                        <>
                          <td>
                            <input
                              type="date"
                              name="date"
                              value={editForm.date}
                              onChange={handleEditFormChange}
                              className="dashboard-edit-input"
                            />
                          </td>
                          <td>
                            <select
                              name="type"
                              value={editForm.type}
                              onChange={handleEditFormChange}
                              className="dashboard-edit-input"
                            >
                              <option value="expense">Expense</option>
                              <option value="income">Income</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              name="category"
                              value={editForm.category}
                              onChange={handleEditFormChange}
                              className="dashboard-edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="amount"
                              value={editForm.amount}
                              min="1"
                              onChange={handleEditFormChange}
                              className="dashboard-edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="notes"
                              value={editForm.notes}
                              onChange={handleEditFormChange}
                              className="dashboard-edit-input"
                            />
                          </td>
                          <td className="dashboard-edit-actions">
                            <button
                              onClick={() => handleEditSave(tx._id)}
                              className="dashboard-action-btn save"
                              title="Save"
                              disabled={editLoading}
                            >💾</button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="dashboard-action-btn cancel"
                              title="Cancel"
                              disabled={editLoading}
                            >❌</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{new Date(tx.date).toLocaleDateString()}</td>
                          <td className={tx.type === "income" ? "dashboard-tx-income" : "dashboard-tx-expense"}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </td>
                          <td>{tx.category}</td>
                          <td className={tx.type === "income" ? "dashboard-tx-income" : "dashboard-tx-expense"}>
                            {formatCurrency(tx.amount)}
                          </td>
                          <td>{tx.notes}</td>
                          <td className="dashboard-edit-actions">
                            <button
                              onClick={() => handleEditClick(tx)}
                              className="dashboard-action-btn edit"
                              title="Edit"
                            >✏️</button>
                            <button
                              onClick={() => handleDelete(tx._id)}
                              className="dashboard-action-btn delete"
                              title="Delete"
                            >🗑️</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {(Object.keys(editErrors).length > 0 && editingId) && (
                <div className="dashboard-form-error dashboard-edit-error">
                  {Object.values(editErrors).join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}