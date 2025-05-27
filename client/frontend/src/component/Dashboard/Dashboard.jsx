

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Legend, CartesianGrid
} from "recharts";
import BudgetSection from "../Budget/BudgetSection";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE", "#FF6384", "#36A2EB", "#FFCE56", "#A28EFF"];

function formatCurrency(amount) {
  return amount?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }) || "₹0.00";
}

export default function Dashboard() {
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

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading dashboard...</div>;
  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)", padding: "0 0 40px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 0 0 0" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {user.photo && (
              <img src={user.photo} alt="Profile" style={{ width: 54, height: 54, borderRadius: "50%", marginRight: 20, border: "3px solid #0ba29d" }} />
            )}
            <div>
              <h2 style={{ margin: 0, color: "#0ba29d" }}>
                Welcome, {user.displayName || user.name}!
              </h2>
              <div style={{ color: "#666", fontSize: 15 }}>{user.email}</div>
            </div>
          </div>
          <a
            href="http://localhost:5000/logout"
            style={{
              background: "linear-gradient(90deg, #0ba29d, #c3ec52)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 26px",
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(11,162,157,0.09)",
              transition: "background 0.2s",
            }}
          >
            Logout
          </a>
        </div>

        {/* Overview Cards */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 180 }}>
            <div style={{ color: "#0ba29d", fontWeight: 600 }}>Net Balance</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0" }}>{formatCurrency(netBalance)}</div>
          </div>
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 180 }}>
            <div style={{ color: "#36a900", fontWeight: 600 }}>Total Income</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#36a900" }}>{formatCurrency(totalIncome)}</div>
          </div>
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 180 }}>
            <div style={{ color: "#e04a41", fontWeight: 600 }}>Total Expense</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#e04a41" }}>{formatCurrency(totalExpense)}</div>
          </div>
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 180 }}>
            <div style={{ color: "#0088FE", fontWeight: 600 }}>Total Assets</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#0088FE" }}>{formatCurrency(totalAssets)}</div>
          </div>
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 180 }}>
            <div style={{ color: "#FF8042", fontWeight: 600 }}>Total Liabilities</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#FF8042" }}>{formatCurrency(totalLiabilities)}</div>
          </div>
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 180 }}>
            <div style={{ color: "#36A2EB", fontWeight: 600 }}>Net Worth</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#36A2EB" }}>{formatCurrency(netWorth)}</div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: 28, marginBottom: 38, flexWrap: "wrap" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 26, flex: 1, minWidth: 330, boxShadow: "0 2px 12px #0001", height: 320 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Expenses by Category</div>
            {expenseByCategory.length === 0 ? (
              <div style={{ color: "#888", textAlign: "center", marginTop: 60 }}>No expenses yet.</div>
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
          <div style={{ background: "#fff", borderRadius: 12, padding: 26, flex: 2, minWidth: 370, boxShadow: "0 2px 12px #0001", height: 320 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Income vs Expense (Last 12 Months)</div>
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
        <div style={{ background: "#fff", borderRadius: 12, padding: 30, marginBottom: 32, boxShadow: "0 2px 12px #0001", maxWidth: 520 }}>
          <h3 style={{ marginTop: 0 }}>Upload Bank Statement (CSV)</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ marginBottom: 10 }}
          />
          {uploading && <div>Uploading and parsing...</div>}
          {uploadSuccess && <div style={{ color: "#36a900" }}>{uploadSuccess}</div>}
          {uploadError && <div style={{ color: "#e04a41" }}>{uploadError}</div>}
          <div style={{ fontSize: 13, color: "#888" }}>
            Supported: CSV with columns "Date", "Type", "Category/Description", "Amount", "Notes"<br />
            (You can export this from your bank's web portal)
          </div>
        </div>

        {/* Add Transaction Form */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 30, marginBottom: 32, boxShadow: "0 2px 12px #0001", maxWidth: 520 }}>
          <h3 style={{ marginTop: 0 }}>Add Transaction</h3>
          <form onSubmit={handleAddTransaction} style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
            <select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              style={{ flex: "1 1 110px", padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
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
              style={{ flex: 2, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              min="1"
              onChange={handleFormChange}
              style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleFormChange}
              style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
              max={new Date().toISOString().split('T')[0]}
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={handleFormChange}
              style={{ flex: 2, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <button
              type="submit"
              style={{
                flex: "1 1 170px",
                background: "linear-gradient(90deg, #0ba29d, #c3ec52)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 6,
                padding: "10px 0",
                fontSize: 16,
                marginTop: 8,
              }}
              disabled={addLoading}
            >
              {addLoading ? "Adding..." : "Add Transaction"}
            </button>
          </form>
          {Object.keys(formErrors).length > 0 &&
            <div style={{ color: "#e04a41", marginTop: 9 }}>
              {Object.values(formErrors).join(", ")}
            </div>
          }
          {successMsg && <div style={{ color: "#36a900", marginTop: 10 }}>{successMsg}</div>}
        </div>

        {/* Assets Section */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 28, marginBottom: 24, boxShadow: "0 2px 12px #0001" }}>
          <h3 style={{ marginTop: 0 }}>Assets</h3>
          <form onSubmit={handleAddAsset} style={{ display: "flex", gap: 18, marginBottom: 12, flexWrap: "wrap" }}>
            <input
              type="text"
              name="name"
              placeholder="Asset Name (e.g. Bank FD, Property)"
              value={assetForm.name}
              onChange={handleAssetFormChange}
              style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <input
              type="number"
              name="value"
              placeholder="Value"
              value={assetForm.value}
              min="1"
              onChange={handleAssetFormChange}
              style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <input
              type="date"
              name="date"
              value={assetForm.date}
              onChange={handleAssetFormChange}
              style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
              max={new Date().toISOString().split('T')[0]}
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes (optional)"
              value={assetForm.notes}
              onChange={handleAssetFormChange}
              style={{ flex: 2, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <button
              type="submit"
              style={{
                flex: "1 1 120px",
                background: "linear-gradient(90deg, #0088FE, #00C49F)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 6,
                padding: "10px 0",
                fontSize: 16,
                marginTop: 8,
              }}
              disabled={assetAddLoading}
            >
              {assetAddLoading ? "Adding..." : "Add Asset"}
            </button>
          </form>
          {Object.keys(assetFormErrors).length > 0 &&
            <div style={{ color: "#e04a41", marginTop: 5 }}>
              {Object.values(assetFormErrors).join(", ")}
            </div>
          }
          <div style={{ maxHeight: 180, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f6f6f6" }}>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "10px 8px", textAlign: "right" }}>Value</th>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {assets.map(a => (
                  <tr key={a._id} style={{ borderBottom: "1px solid #eee" }}>
                    {editingAssetId === a._id ? (
                      <>
                        <td style={{ padding: "7px 8px" }}>
                          <input
                            type="text"
                            name="name"
                            value={editAssetForm.name}
                            onChange={handleEditAssetFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          />
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right" }}>
                          <input
                            type="number"
                            name="value"
                            value={editAssetForm.value}
                            min="1"
                            onChange={handleEditAssetFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb", textAlign: "right", width: 90 }}
                          />
                        </td>
                        <td style={{ padding: "7px 8px" }}>
                          <input
                            type="date"
                            name="date"
                            value={editAssetForm.date}
                            onChange={handleEditAssetFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          />
                        </td>
                        <td style={{ padding: "7px 8px" }}>
                          <input
                            type="text"
                            name="notes"
                            value={editAssetForm.notes}
                            onChange={handleEditAssetFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          />
                        </td>
                        <td style={{ padding: "7px 8px", display: "flex", gap: 4 }}>
                          <button
                            onClick={() => handleEditAssetSave(a._id)}
                            style={{ background: "none", color: "#36a900", border: "none", fontSize: 18, cursor: "pointer" }}
                            title="Save"
                            disabled={editAssetLoading}
                          >💾</button>
                          <button
                            onClick={() => setEditingAssetId(null)}
                            style={{ background: "none", color: "#888", border: "none", fontSize: 18, cursor: "pointer" }}
                            title="Cancel"
                            disabled={editAssetLoading}
                          >❌</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "7px 8px" }}>{a.name}</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#0088FE" }}>{formatCurrency(a.value)}</td>
                        <td style={{ padding: "7px 8px" }}>{new Date(a.date).toLocaleDateString()}</td>
                        <td style={{ padding: "7px 8px" }}>{a.notes}</td>
                        <td style={{ padding: "7px 8px", display: "flex", gap: 4 }}>
                          <button
                            onClick={() => handleEditAssetClick(a)}
                            style={{ background: "none", color: "#007bff", border: "none", fontSize: 18, cursor: "pointer" }}
                            title="Edit"
                          >✏️</button>
                          <button
                            onClick={() => handleDeleteAsset(a._id)}
                            style={{
                              background: "none",
                              color: "#e04a41",
                              border: "none",
                              fontSize: 18,
                              cursor: "pointer",
                            }}
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
              <div style={{ color: "#e04a41", marginTop: 7, marginLeft: 4 }}>
                {Object.values(editAssetErrors).join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Liabilities Section */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 28, marginBottom: 24, boxShadow: "0 2px 12px #0001" }}>
          <h3 style={{ marginTop: 0 }}>Liabilities</h3>
          <form onSubmit={handleAddLiability} style={{ display: "flex", gap: 18, marginBottom: 12, flexWrap: "wrap" }}>
            <input
              type="text"
              name="name"
              placeholder="Liability Name (e.g. Loan, Credit Card)"
              value={liabilityForm.name}
              onChange={handleLiabilityFormChange}
              style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <input
              type="number"
              name="value"
              placeholder="Value"
              value={liabilityForm.value}
              min="1"
              onChange={handleLiabilityFormChange}
              style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <input
              type="date"
              name="date"
              value={liabilityForm.date}
              onChange={handleLiabilityFormChange}
              style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
              max={new Date().toISOString().split('T')[0]}
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes (optional)"
              value={liabilityForm.notes}
              onChange={handleLiabilityFormChange}
              style={{ flex: 2, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
            />
            <button
              type="submit"
              style={{
                flex: "1 1 120px",
                background: "linear-gradient(90deg, #FF8042, #FFBB28)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 6,
                padding: "10px 0",
                fontSize: 16,
                marginTop: 8,
              }}
              disabled={liabilityAddLoading}
            >
              {liabilityAddLoading ? "Adding..." : "Add Liability"}
            </button>
          </form>
          {Object.keys(liabilityFormErrors).length > 0 &&
            <div style={{ color: "#e04a41", marginTop: 5 }}>
              {Object.values(liabilityFormErrors).join(", ")}
            </div>
          }
          <div style={{ maxHeight: 180, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f6f6f6" }}>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "10px 8px", textAlign: "right" }}>Value</th>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "10px 8px", textAlign: "left" }}>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {liabilities.map(l => (
                  <tr key={l._id} style={{ borderBottom: "1px solid #eee" }}>
                    {editingLiabilityId === l._id ? (
                      <>
                        <td style={{ padding: "7px 8px" }}>
                          <input
                            type="text"
                            name="name"
                            value={editLiabilityForm.name}
                            onChange={handleEditLiabilityFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          />
                        </td>
                        <td style={{ padding: "7px 8px", textAlign: "right" }}>
                          <input
                            type="number"
                            name="value"
                            value={editLiabilityForm.value}
                            min="1"
                            onChange={handleEditLiabilityFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb", textAlign: "right", width: 90 }}
                          />
                        </td>
                        <td style={{ padding: "7px 8px" }}>
                          <input
                            type="date"
                            name="date"
                            value={editLiabilityForm.date}
                            onChange={handleEditLiabilityFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          />
                        </td>
                        <td style={{ padding: "7px 8px" }}>
                          <input
                            type="text"
                            name="notes"
                            value={editLiabilityForm.notes}
                            onChange={handleEditLiabilityFormChange}
                            style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                          />
                        </td>
                        <td style={{ padding: "7px 8px", display: "flex", gap: 4 }}>
                          <button
                            onClick={() => handleEditLiabilitySave(l._id)}
                            style={{ background: "none", color: "#36a900", border: "none", fontSize: 18, cursor: "pointer" }}
                            title="Save"
                            disabled={editLiabilityLoading}
                          >💾</button>
                          <button
                            onClick={() => setEditingLiabilityId(null)}
                            style={{ background: "none", color: "#888", border: "none", fontSize: 18, cursor: "pointer" }}
                            title="Cancel"
                            disabled={editLiabilityLoading}
                          >❌</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "7px 8px" }}>{l.name}</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: "#FF8042" }}>{formatCurrency(l.value)}</td>
                        <td style={{ padding: "7px 8px" }}>{new Date(l.date).toLocaleDateString()}</td>
                        <td style={{ padding: "7px 8px" }}>{l.notes}</td>
                        <td style={{ padding: "7px 8px", display: "flex", gap: 4 }}>
                          <button
                            onClick={() => handleEditLiabilityClick(l)}
                            style={{ background: "none", color: "#007bff", border: "none", fontSize: 18, cursor: "pointer" }}
                            title="Edit"
                          >✏️</button>
                          <button
                            onClick={() => handleDeleteLiability(l._id)}
                            style={{
                              background: "none",
                              color: "#e04a41",
                              border: "none",
                              fontSize: 18,
                              cursor: "pointer",
                            }}
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
              <div style={{ color: "#e04a41", marginTop: 7, marginLeft: 4 }}>
                {Object.values(editLiabilityErrors).join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 12px #0001" }}>
          <h3 style={{ marginTop: 0 }}>Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No transactions yet.</div>
          ) : (
            <div style={{ maxHeight: 390, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f6f6f6" }}>
                    <th style={{ padding: "10px 8px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "10px 8px", textAlign: "left" }}>Type</th>
                    <th style={{ padding: "10px 8px", textAlign: "left" }}>Category</th>
                    <th style={{ padding: "10px 8px", textAlign: "right" }}>Amount</th>
                    <th style={{ padding: "10px 8px", textAlign: "left" }}>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 20).map(tx => (
                    <tr key={tx._id} style={{ borderBottom: "1px solid #eee" }}>
                      {editingId === tx._id ? (
                        <>
                          <td style={{ padding: "7px 8px" }}>
                            <input
                              type="date"
                              name="date"
                              value={editForm.date}
                              onChange={handleEditFormChange}
                              style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                            />
                          </td>
                          <td style={{ padding: "7px 8px" }}>
                            <select
                              name="type"
                              value={editForm.type}
                              onChange={handleEditFormChange}
                              style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                            >
                              <option value="expense">Expense</option>
                              <option value="income">Income</option>
                            </select>
                          </td>
                          <td style={{ padding: "7px 8px" }}>
                            <input
                              type="text"
                              name="category"
                              value={editForm.category}
                              onChange={handleEditFormChange}
                              style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                            />
                          </td>
                          <td style={{ padding: "7px 8px", textAlign: "right" }}>
                            <input
                              type="number"
                              name="amount"
                              value={editForm.amount}
                              min="1"
                              onChange={handleEditFormChange}
                              style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb", textAlign: "right", width: 90 }}
                            />
                          </td>
                          <td style={{ padding: "7px 8px" }}>
                            <input
                              type="text"
                              name="notes"
                              value={editForm.notes}
                              onChange={handleEditFormChange}
                              style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid #bbb" }}
                            />
                          </td>
                          <td style={{ padding: "7px 8px", display: "flex", gap: 4 }}>
                            <button
                              onClick={() => handleEditSave(tx._id)}
                              style={{ background: "none", color: "#36a900", border: "none", fontSize: 18, cursor: "pointer" }}
                              title="Save"
                              disabled={editLoading}
                            >💾</button>
                            <button
                              onClick={() => setEditingId(null)}
                              style={{ background: "none", color: "#888", border: "none", fontSize: 18, cursor: "pointer" }}
                              title="Cancel"
                              disabled={editLoading}
                            >❌</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: "7px 8px" }}>{new Date(tx.date).toLocaleDateString()}</td>
                          <td style={{ padding: "7px 8px", color: tx.type === "income" ? "#36a900" : "#e04a41", fontWeight: 600 }}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
                          <td style={{ padding: "7px 8px" }}>{tx.category}</td>
                          <td style={{ padding: "7px 8px", textAlign: "right", color: tx.type === "income" ? "#36a900" : "#e04a41" }}>{formatCurrency(tx.amount)}</td>
                          <td style={{ padding: "7px 8px" }}>{tx.notes}</td>
                          <td style={{ padding: "7px 8px", display: "flex", gap: 4 }}>
                            <button
                              onClick={() => handleEditClick(tx)}
                              style={{ background: "none", color: "#007bff", border: "none", fontSize: 18, cursor: "pointer" }}
                              title="Edit"
                            >✏️</button>
                            <button
                              onClick={() => handleDelete(tx._id)}
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
                  ))}
                </tbody>
              </table>
              {(Object.keys(editErrors).length > 0 && editingId) && (
                <div style={{ color: "#e04a41", marginTop: 7, marginLeft: 4 }}>
                  {Object.values(editErrors).join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <BudgetSection/>
    </div>
  );
}