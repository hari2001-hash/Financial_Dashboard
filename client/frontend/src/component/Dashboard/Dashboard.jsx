


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
//   LineChart, Line, XAxis, YAxis, Legend, CartesianGrid
// } from "recharts";

// const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE", "#FF6384", "#36A2EB", "#FFCE56", "#A28EFF"];

// function formatCurrency(amount) {
//   return amount?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }) || "₹0.00";
// }

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({
//     type: "expense",
//     category: "",
//     amount: "",
//     date: "",
//     notes: "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [addLoading, setAddLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const navigate = useNavigate();

//   // Fetch user and transactions
//   useEffect(() => {
//     async function fetchUserAndTransactions() {
//       try {
//         const userRes = await fetch("http://localhost:5000/api/user", { credentials: "include" });
//         const userData = await userRes.json();
//         if (!userData || !userData.email) {
//           navigate("/login");
//           return;
//         }
//         setUser(userData);

//         const txRes = await fetch("http://localhost:5000/api/transactions", { credentials: "include" });
//         if (txRes.ok) {
//           const txData = await txRes.json();
//           setTransactions(txData);
//         } else {
//           setTransactions([]);
//         }
//       } catch (err) {
//         setTransactions([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchUserAndTransactions();
//   }, [navigate]);

//   // Add transaction handler
//   const handleFormChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setFormErrors({});
//     setSuccessMsg("");
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!form.type) errors.type = "Type is required";
//     if (!form.category.trim()) errors.category = "Category is required";
//     if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errors.amount = "Enter a valid amount";
//     if (!form.date) errors.date = "Date is required";
//     else {
//       // Prevent future dates
//       const today = new Date();
//       const input = new Date(form.date);
//       if (input > today) errors.date = "Date cannot be in the future";
//     }
//     return errors;
//   };

//   // Converts dd-MM-yyyy or similar to yyyy-MM-dd
//   const toISODate = (val) => {
//     if (!val) return "";
//     // If already yyyy-MM-dd (from <input type="date"/>) just return
//     if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
//     // Try to parse dd-MM-yyyy or d-M-yyyy
//     const parts = val.split("-");
//     if (parts.length === 3) {
//       const [d, m, y] = parts;
//       if (y && m && d) {
//         return `${y.padStart(4, "20")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
//       }
//     }
//     return val;
//   };

//   const handleAddTransaction = async (e) => {
//     e.preventDefault();
//     setFormErrors({});
//     setSuccessMsg("");
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
//     setAddLoading(true);
//     try {
//       const res = await fetch("http://localhost:5000/api/transactions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           ...form,
//           amount: Number(form.amount),
//           date: toISODate(form.date),
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setTransactions((prev) => [data, ...prev]);
//         setForm({ type: "expense", category: "", amount: "", date: "", notes: "" });
//         setSuccessMsg("Transaction added!");
//       } else {
//         setFormErrors({ api: data.error || "Failed to add transaction." });
//       }
//     } catch {
//       setFormErrors({ api: "Server error. Try again." });
//     }
//     setAddLoading(false);
//   };

//   // Delete transaction
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this transaction?")) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (res.ok) {
//         setTransactions((prev) => prev.filter((tx) => tx._id !== id));
//       }
//     } catch {
//       // ignore
//     }
//   };

//   // Derived Data
//   const totalIncome = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
//   const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
//   const netBalance = totalIncome - totalExpense;

//   // Pie chart data
//   const expenseByCategory = Object.values(
//     transactions
//       .filter(t => t.type === "expense")
//       .reduce((acc, t) => {
//         acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
//         acc[t.category].value += t.amount;
//         return acc;
//       }, {})
//   );

//   // Trend chart data (last 12 months)
//   const monthFmt = (d) => {
//     const dt = new Date(d);
//     return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0");
//   };
//   const months = [...Array(12).keys()]
//     .map(i => {
//       const date = new Date();
//       date.setMonth(date.getMonth() - (11 - i));
//       return monthFmt(date);
//     });
//   const trendData = months.map(month => {
//     const incomes = transactions
//       .filter(t => t.type === "income" && monthFmt(t.date) === month)
//       .reduce((a, b) => a + b.amount, 0);
//     const expenses = transactions
//       .filter(t => t.type === "expense" && monthFmt(t.date) === month)
//       .reduce((a, b) => a + b.amount, 0);
//     return { month, Income: incomes, Expense: expenses };
//   });

//   if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading dashboard...</div>;
//   if (!user) return null;

//   return (
//     <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)", padding: "0 0 40px 0" }}>
//       <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 0 0 0" }}>
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             {user.photo && (
//               <img src={user.photo} alt="Profile" style={{ width: 54, height: 54, borderRadius: "50%", marginRight: 20, border: "3px solid #0ba29d" }} />
//             )}
//             <div>
//               <h2 style={{ margin: 0, color: "#0ba29d" }}>
//                 Welcome, {user.displayName || user.name}!
//               </h2>
//               <div style={{ color: "#666", fontSize: 15 }}>{user.email}</div>
//             </div>
//           </div>
//           <a
//             href="http://localhost:5000/logout"
//             style={{
//               background: "linear-gradient(90deg, #0ba29d, #c3ec52)",
//               color: "#fff",
//               border: "none",
//               borderRadius: 6,
//               padding: "10px 26px",
//               fontWeight: 600,
//               fontSize: 16,
//               textDecoration: "none",
//               boxShadow: "0 2px 8px rgba(11,162,157,0.09)",
//               transition: "background 0.2s",
//             }}
//           >
//             Logout
//           </a>
//         </div>

//         {/* Overview Cards */}
//         <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
//           <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 220 }}>
//             <div style={{ color: "#0ba29d", fontWeight: 600 }}>Net Balance</div>
//             <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0" }}>{formatCurrency(netBalance)}</div>
//           </div>
//           <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 220 }}>
//             <div style={{ color: "#36a900", fontWeight: 600 }}>Total Income</div>
//             <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#36a900" }}>{formatCurrency(totalIncome)}</div>
//           </div>
//           <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 220 }}>
//             <div style={{ color: "#e04a41", fontWeight: 600 }}>Total Expense</div>
//             <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#e04a41" }}>{formatCurrency(totalExpense)}</div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div style={{ display: "flex", gap: 28, marginBottom: 38, flexWrap: "wrap" }}>
//           <div style={{ background: "#fff", borderRadius: 12, padding: 26, flex: 1, minWidth: 330, boxShadow: "0 2px 12px #0001", height: 320 }}>
//             <div style={{ fontWeight: 600, marginBottom: 12 }}>Expenses by Category</div>
//             {expenseByCategory.length === 0 ? (
//               <div style={{ color: "#888", textAlign: "center", marginTop: 60 }}>No expenses yet.</div>
//             ) : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <PieChart>
//                   <Pie
//                     dataKey="value"
//                     data={expenseByCategory}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
//                   >
//                     {expenseByCategory.map((entry, i) => (
//                       <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={formatCurrency} />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//           <div style={{ background: "#fff", borderRadius: 12, padding: 26, flex: 2, minWidth: 370, boxShadow: "0 2px 12px #0001", height: 320 }}>
//             <div style={{ fontWeight: 600, marginBottom: 12 }}>Income vs Expense (Last 12 Months)</div>
//             <ResponsiveContainer width="100%" height={220}>
//               <LineChart data={trendData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip formatter={formatCurrency} />
//                 <Legend />
//                 <Line type="monotone" dataKey="Income" stroke="#36a900" strokeWidth={3} />
//                 <Line type="monotone" dataKey="Expense" stroke="#e04a41" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Add Transaction Form */}
//         <div style={{ background: "#fff", borderRadius: 12, padding: 30, marginBottom: 32, boxShadow: "0 2px 12px #0001", maxWidth: 520 }}>
//           <h3 style={{ marginTop: 0 }}>Add Transaction</h3>
//           <form onSubmit={handleAddTransaction} style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
//             <select
//               name="type"
//               value={form.type}
//               onChange={handleFormChange}
//               style={{ flex: "1 1 110px", padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
//             >
//               <option value="expense">Expense</option>
//               <option value="income">Income</option>
//             </select>
//             <input
//               type="text"
//               name="category"
//               placeholder="Category (e.g. Food, Salary)"
//               value={form.category}
//               onChange={handleFormChange}
//               style={{ flex: 2, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
//             />
//             <input
//               type="number"
//               name="amount"
//               placeholder="Amount"
//               value={form.amount}
//               min="1"
//               onChange={handleFormChange}
//               style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
//             />
//             <input
//               type="date"
//               name="date"
//               value={form.date}
//               onChange={handleFormChange}
//               style={{ flex: 1, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
//               max={new Date().toISOString().split('T')[0]}
//             />
//             <input
//               type="text"
//               name="notes"
//               placeholder="Notes (optional)"
//               value={form.notes}
//               onChange={handleFormChange}
//               style={{ flex: 2, padding: 8, fontSize: 15, borderRadius: 5, border: "1px solid #bbb" }}
//             />
//             <button
//               type="submit"
//               style={{
//                 flex: "1 1 170px",
//                 background: "linear-gradient(90deg, #0ba29d, #c3ec52)",
//                 color: "#fff",
//                 fontWeight: 700,
//                 border: "none",
//                 borderRadius: 6,
//                 padding: "10px 0",
//                 fontSize: 16,
//                 marginTop: 8,
//               }}
//               disabled={addLoading}
//             >
//               {addLoading ? "Adding..." : "Add Transaction"}
//             </button>
//           </form>
//           {Object.keys(formErrors).length > 0 &&
//             <div style={{ color: "#e04a41", marginTop: 9 }}>
//               {Object.values(formErrors).join(", ")}
//             </div>
//           }
//           {successMsg && <div style={{ color: "#36a900", marginTop: 10 }}>{successMsg}</div>}
//         </div>

//         {/* Transactions Table */}
//         <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 12px #0001" }}>
//           <h3 style={{ marginTop: 0 }}>Recent Transactions</h3>
//           {transactions.length === 0 ? (
//             <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No transactions yet.</div>
//           ) : (
//             <div style={{ maxHeight: 390, overflowY: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: "#f6f6f6" }}>
//                     <th style={{ padding: "10px 8px", textAlign: "left" }}>Date</th>
//                     <th style={{ padding: "10px 8px", textAlign: "left" }}>Type</th>
//                     <th style={{ padding: "10px 8px", textAlign: "left" }}>Category</th>
//                     <th style={{ padding: "10px 8px", textAlign: "right" }}>Amount</th>
//                     <th style={{ padding: "10px 8px", textAlign: "left" }}>Notes</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactions.slice(0, 20).map(tx => (
//                     <tr key={tx._id} style={{ borderBottom: "1px solid #eee" }}>
//                       <td style={{ padding: "7px 8px" }}>{new Date(tx.date).toLocaleDateString()}</td>
//                       <td style={{ padding: "7px 8px", color: tx.type === "income" ? "#36a900" : "#e04a41", fontWeight: 600 }}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
//                       <td style={{ padding: "7px 8px" }}>{tx.category}</td>
//                       <td style={{ padding: "7px 8px", textAlign: "right", color: tx.type === "income" ? "#36a900" : "#e04a41" }}>{formatCurrency(tx.amount)}</td>
//                       <td style={{ padding: "7px 8px" }}>{tx.notes}</td>
//                       <td style={{ padding: "7px 8px" }}>
//                         <button
//                           onClick={() => handleDelete(tx._id)}
//                           style={{
//                             background: "none",
//                             color: "#e04a41",
//                             border: "none",
//                             fontSize: 18,
//                             cursor: "pointer",
//                           }}
//                           title="Delete"
//                         >
//                           🗑️
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Legend, CartesianGrid
} from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE", "#FF6384", "#36A2EB", "#FFCE56", "#A28EFF"];

function formatCurrency(amount) {
  return amount?.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }) || "₹0.00";
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch user and transactions
  useEffect(() => {
    async function fetchUserAndTransactions() {
      try {
        const userRes = await fetch("http://localhost:5000/api/user", { credentials: "include" });
        const userData = await userRes.json();
        if (!userData || !userData.email) {
          navigate("/login");
          return;
        }
        setUser(userData);

        const txRes = await fetch("http://localhost:5000/api/transactions", { credentials: "include" });
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndTransactions();
  }, [navigate]);

  // Add transaction handler
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
      // Prevent future dates
      const today = new Date();
      const input = new Date(form.date);
      if (input > today) errors.date = "Date cannot be in the future";
    }
    return errors;
  };

  // Converts dd-MM-yyyy or similar to yyyy-MM-dd
  const toISODate = (val) => {
    if (!val) return "";
    // If already yyyy-MM-dd (from <input type="date"/>) just return
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    // Try to parse dd-MM-yyyy or d-M-yyyy
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

  // Upload Bank Statement Handler
  const handleFileUpload = async (e) => {
    setUploadError("");
    setUploadSuccess("");
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    // Upload to backend for parsing
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

  // Delete transaction
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
    } catch {
      // ignore
    }
  };

  // Derived Data
  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const netBalance = totalIncome - totalExpense;

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
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 220 }}>
            <div style={{ color: "#0ba29d", fontWeight: 600 }}>Net Balance</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0" }}>{formatCurrency(netBalance)}</div>
          </div>
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 220 }}>
            <div style={{ color: "#36a900", fontWeight: 600 }}>Total Income</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#36a900" }}>{formatCurrency(totalIncome)}</div>
          </div>
          <div className="card" style={{ flex: 1, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 28, minWidth: 220 }}>
            <div style={{ color: "#e04a41", fontWeight: 600 }}>Total Expense</div>
            <div style={{ fontSize: 28, fontWeight: 700, margin: "16px 0", color: "#e04a41" }}>{formatCurrency(totalExpense)}</div>
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
                      <td style={{ padding: "7px 8px" }}>{new Date(tx.date).toLocaleDateString()}</td>
                      <td style={{ padding: "7px 8px", color: tx.type === "income" ? "#36a900" : "#e04a41", fontWeight: 600 }}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
                      <td style={{ padding: "7px 8px" }}>{tx.category}</td>
                      <td style={{ padding: "7px 8px", textAlign: "right", color: tx.type === "income" ? "#36a900" : "#e04a41" }}>{formatCurrency(tx.amount)}</td>
                      <td style={{ padding: "7px 8px" }}>{tx.notes}</td>
                      <td style={{ padding: "7px 8px" }}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}