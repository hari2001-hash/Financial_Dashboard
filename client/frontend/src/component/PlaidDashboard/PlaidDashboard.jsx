// import React, { useEffect, useState } from 'react';

// function PlaidDashboard() {
//   const [data, setData] = useState({ accounts: [], transactions: [] });
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch data from backend API
//   const fetchPlaidData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch('http://localhost:5000/api/plaid-data');
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const resData = await res.json();
//       setData(resData);
//     } catch (e) {
//       setError(e.message || "Unknown error");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchPlaidData();
//   }, []);

//   // Map transactions to accounts
//   const transactionsByAccount = {};
//   data.transactions.forEach(tx => {
//     if (!transactionsByAccount[tx.account_id]) transactionsByAccount[tx.account_id] = [];
//     transactionsByAccount[tx.account_id].push(tx);
//   });

//   return (
//     <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: "system-ui" }}>
//       <h1>Plaid Financial Dashboard</h1>
//       <button
//         onClick={() => { setRefreshing(true); fetchPlaidData(); }}
//         disabled={loading || refreshing}
//         style={{marginBottom: 20}}
//       >
//         {refreshing ? 'Refreshing...' : 'Refresh Data'}
//       </button>
//       {loading ? <div>Loading...</div> : null}
//       {error && <div style={{ color: 'red' }}>Error: {error}</div>}
//       {!loading && !error && data.accounts.map(account => (
//         <div key={account.account_id} style={{ marginBottom: 40 }}>
//           <h3>{account.name} ({account.official_name || account.subtype})</h3>
//           <p>
//             <b>Type:</b> {account.type} | <b>Subtype:</b> {account.subtype} | <b>Mask:</b> {account.mask}<br/>
//             <b>Balance:</b> ${account.balances.current} {account.balances.iso_currency_code}
//           </p>
//           <table border="1" cellPadding="7" style={{ borderCollapse: 'collapse', width: '100%' }}>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Name</th>
//                 <th>Amount</th>
//                 <th>Merchant</th>
//                 <th>Category</th>
//                 <th>Website</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(transactionsByAccount[account.account_id] || []).length === 0
//                 ? <tr><td colSpan={6}><i>No transactions</i></td></tr>
//                 : transactionsByAccount[account.account_id].map((tx, idx) => (
//                   <tr key={idx}>
//                     <td>{tx.date}</td>
//                     <td>{tx.name}</td>
//                     <td>${tx.amount}</td>
//                     <td>{tx.merchant_name || ''}</td>
//                     <td>{tx.personal_finance_category?.primary || ''}</td>
//                     <td>{tx.website || ''}</td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default PlaidDashboard;



import React, { useEffect, useState } from 'react';

function PlaidDashboard() {
  const [data, setData] = useState({ accounts: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchPlaidData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('http://localhost:5000/api/plaid-data');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const resData = await res.json();
      setData(resData);
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlaidData();
  }, []);

  // Group transactions by account_id for display
  const transactionsByAccount = {};
  data.transactions.forEach(tx => {
    if (!transactionsByAccount[tx.account_id]) transactionsByAccount[tx.account_id] = [];
    transactionsByAccount[tx.account_id].push(tx);
  });

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: "system-ui" }}>
      <h1>Plaid Financial Dashboard</h1>
      <button
        onClick={() => { setRefreshing(true); fetchPlaidData(); }}
        disabled={loading || refreshing}
        style={{marginBottom: 20}}
      >
        {refreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>
      {loading ? <div>Loading...</div> : null}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {!loading && !error && data.accounts.map(account => (
        <div key={account.account_id} style={{ marginBottom: 40 }}>
          <h3>{account.name} ({account.official_name || account.subtype})</h3>
          <p>
            <b>Type:</b> {account.type} | <b>Subtype:</b> {account.subtype} | <b>Mask:</b> {account.mask}<br/>
            <b>Balance:</b> ${account.balances.current} {account.balances.iso_currency_code}
          </p>
          <table border="1" cellPadding="7" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {(transactionsByAccount[account.account_id] || []).length === 0
                ? <tr><td colSpan={6}><i>No transactions</i></td></tr>
                : transactionsByAccount[account.account_id].map((tx, idx) => (
                  <tr key={idx}>
                    <td>{tx.date}</td>
                    <td>{tx.name}</td>
                    <td>${tx.amount}</td>
                    <td>{tx.merchant_name || ''}</td>
                    <td>{tx.personal_finance_category?.primary || ''}</td>
                    <td>{tx.website || ''}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default PlaidDashboard;