

// import React, { useEffect, useState } from 'react';

// function PlaidDashboard() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");

//   const fetchPlaidData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch('http://localhost:5000/api/plaid-data');
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const resData = await res.json();
//       // Defensive: if it's an array, it's probably just transactions
//       if (Array.isArray(resData)) setTransactions(resData);
//       else if (resData.transactions && Array.isArray(resData.transactions)) setTransactions(resData.transactions);
//       else if (Array.isArray(resData.data)) setTransactions(resData.data);
//       else setTransactions([]);
//     } catch (e) {
//       setError(e.message || "Unknown error");
//       setTransactions([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => { fetchPlaidData(); }, []);

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
//       {loading && <div>Loading...</div>}
//       {error && <div style={{ color: 'red' }}>Error: {error}</div>}

//       {!loading && !error && transactions.length > 0 && (
//         <div>
//           <h2>All Transaction Details</h2>
//           <table border="1" cellPadding="7" style={{ borderCollapse: 'collapse', width: '100%' }}>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>Name</th>
//                 <th>Amount</th>
//                 <th>Account Id</th>
//                 <th>Merchant Name</th>
//                 <th>Pending</th>
//                 <th>Category</th>
//                 <th>Category ID</th>
//                 <th>Personal Finance Category</th>
//                 <th>Personal Finance Icon</th>
//                 <th>Payment Channel</th>
//                 <th>Authorized Date</th>
//                 <th>Transaction Type</th>
//                 <th>Website</th>
//                 <th>Location</th>
//                 <th>Payment Meta</th>
//                 <th>Counterparties</th>
//                 <th>Transaction ID</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((tx, idx) => (
//                 <tr key={tx.transaction_id || idx}>
//                   <td>{tx.date}</td>
//                   <td>{tx.name}</td>
//                   <td>${tx.amount}</td>
//                   <td>{tx.account_id}</td>
//                   <td>{tx.merchant_name || ''}</td>
//                   <td>{tx.pending ? "Yes" : "No"}</td>
//                   <td>{tx.category ? JSON.stringify(tx.category) : ''}</td>
//                   <td>{tx.category_id || ''}</td>
//                   <td>
//                     {tx.personal_finance_category
//                       ? `${tx.personal_finance_category.primary} (${tx.personal_finance_category.detailed})`
//                       : ''}
//                   </td>
//                   <td>
//                     {tx.personal_finance_category_icon_url
//                       ? <a href={tx.personal_finance_category_icon_url} target="_blank" rel="noopener noreferrer">Icon</a>
//                       : ''}
//                   </td>
//                   <td>{tx.payment_channel}</td>
//                   <td>{tx.authorized_date}</td>
//                   <td>{tx.transaction_type}</td>
//                   <td>{tx.website ? <a href={tx.website}>{tx.website}</a> : ''}</td>
//                   <td>
//                     {tx.location ? (
//                       <pre style={{whiteSpace:'pre-wrap',margin:0,fontFamily:'inherit'}}>
//                         {JSON.stringify(tx.location, null, 1)}
//                       </pre>
//                     ) : ''}
//                   </td>
//                   <td>
//                     {tx.payment_meta ? (
//                       <pre style={{whiteSpace:'pre-wrap',margin:0,fontFamily:'inherit'}}>
//                         {JSON.stringify(tx.payment_meta, null, 1)}
//                       </pre>
//                     ) : ''}
//                   </td>
//                   <td>
//                     {tx.counterparties && tx.counterparties.length > 0 ? (
//                       <pre style={{whiteSpace:'pre-wrap',margin:0,fontFamily:'inherit'}}>
//                         {JSON.stringify(tx.counterparties, null, 1)}
//                       </pre>
//                     ) : ''}
//                   </td>
//                   <td>{tx.transaction_id}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {!loading && !error && transactions.length === 0 && (
//         <div>No transactions to display.</div>
//       )}
//     </div>
//   );
// }

// export default PlaidDashboard;


import React, { useEffect, useState } from 'react';

function PlaidDashboard() {
  const [transactions, setTransactions] = useState([]);
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
      // Defensive: if it's an array, it's probably just transactions
      if (Array.isArray(resData)) setTransactions(resData);
      else if (resData.transactions && Array.isArray(resData.transactions)) setTransactions(resData.transactions);
      else if (Array.isArray(resData.data)) setTransactions(resData.data);
      else setTransactions([]);
    } catch (e) {
      setError(e.message || "Unknown error");
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchPlaidData(); }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', fontFamily: "system-ui" }}>
      <h1>Plaid Financial Dashboard</h1>
      <button
        onClick={() => { setRefreshing(true); fetchPlaidData(); }}
        disabled={loading || refreshing}
        style={{marginBottom: 20}}
      >
        {refreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!loading && !error && transactions.length > 0 && (
        <div style={{overflowX: 'auto'}}>
          <h2>All Transaction Details</h2>
          <table border="1" cellPadding="7" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Account Id</th>
                <th>Merchant Name</th>
                <th>Pending</th>
                <th>Category</th>
                <th>Category ID</th>
                <th>Personal Finance Category</th>
                <th>Personal Finance Icon</th>
                <th>Payment Channel</th>
                <th>Authorized Date</th>
                <th>Transaction Type</th>
                <th>Website</th>
                <th>Location</th>
                <th>Payment Meta</th>
                <th>Counterparties</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={tx.transaction_id || idx}>
                  <td>{tx.date}</td>
                  <td>{tx.name}</td>
                  <td>${tx.amount}</td>
                  <td>{tx.account_id}</td>
                  <td>{tx.merchant_name || ''}</td>
                  <td>{tx.pending ? "Yes" : "No"}</td>
                  <td>{tx.category ? JSON.stringify(tx.category) : ''}</td>
                  <td>{tx.category_id || ''}</td>
                  <td>
                    {tx.personal_finance_category
                      ? `${tx.personal_finance_category.primary} (${tx.personal_finance_category.detailed})`
                      : ''}
                  </td>
                  <td>
                    {tx.personal_finance_category_icon_url && (
                      <img
                        src={tx.personal_finance_category_icon_url}
                        alt={tx.personal_finance_category?.primary || "Category Icon"}
                        style={{ width: 32, height: 32, objectFit: 'contain' }}
                      />
                    )}
                  </td>
                  <td>{tx.payment_channel}</td>
                  <td>{tx.authorized_date}</td>
                  <td>{tx.transaction_type}</td>
                  <td>{tx.website ? <a href={tx.website}>{tx.website}</a> : ''}</td>
                  <td>
                    {tx.location ? (
                      <pre style={{whiteSpace:'pre-wrap',margin:0,fontFamily:'inherit'}}>
                        {JSON.stringify(tx.location, null, 1)}
                      </pre>
                    ) : ''}
                  </td>
                  <td>
                    {tx.payment_meta ? (
                      <pre style={{whiteSpace:'pre-wrap',margin:0,fontFamily:'inherit'}}>
                        {JSON.stringify(tx.payment_meta, null, 1)}
                      </pre>
                    ) : ''}
                  </td>
                  <td>
                    {tx.counterparties && tx.counterparties.length > 0 ? (
                      <pre style={{whiteSpace:'pre-wrap',margin:0,fontFamily:'inherit'}}>
                        {JSON.stringify(tx.counterparties, null, 1)}
                      </pre>
                    ) : ''}
                  </td>
                  <td>{tx.transaction_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div>No transactions to display.</div>
      )}
    </div>
  );
}

export default PlaidDashboard;