

import React, { useState, useEffect } from "react";

// You can expand this list as needed!
const currencies = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD"];

const API_KEY = process.env.REACT_APP_CURRENCY_KEY; // <-- Replace with your actual exchangerate-api.com key


export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("GBP");
  const [rate, setRate] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (from === to) {
      setRate(1);
      setResult(amount);
      setError(null);
      return;
    }
    setError(null);
    setRate(null);
    setResult(null);

    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.result === "success" && typeof data.conversion_rate === "number") {
          setRate(data.conversion_rate);
          setResult((amount * data.conversion_rate).toFixed(2));
        } else {
          setError("Conversion rate not found.");
        }
      })
      .catch(() => setError("Failed to fetch rates."));
  }, [from, to, amount]);

  // ---- Application Theme Styles ----
  const appTheme = {
    background: "linear-gradient(135deg, #213E60 0%, #1B2B45 100%)",
    minHeight: "100vh",
    padding: "0",
    margin: "0",
    fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardStyle = {
    maxWidth: 400,
    width: "90%",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 32,
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#E2E6EA",
  };

  const inputStyle = {
    width: 90,
    fontSize: 17,
    padding: "7px 10px",
    borderRadius: 7,
    border: "1px solid #2F4868",
    background: "#22385B",
    color: "#E2E6EA",
    outline: "none",
    marginRight: 8,
  };

  const selectStyle = {
    fontSize: 17,
    padding: "7px 10px",
    borderRadius: 7,
    border: "1px solid #2F4868",
    background: "#22385B",
    color: "#E2E6EA",
    outline: "none",
    marginRight: 8,
  };

  const buttonStyle = {
    padding: "7px 20px",
    background: "#56CCF2",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 16,
    boxShadow: "0 2px 8px #1b2b4555"
  };

  const errorStyle = {
    color: "#FF6B6B",
    fontWeight: 500,
    fontSize: 16,
    marginTop: 10,
  };

  const resultStyle = {
    marginTop: 20,
    padding: "16px 0 0 0",
    fontSize: 21,
    color: "#56CCF2",
    fontWeight: 700,
    letterSpacing: 0.5,
    textAlign: "center"
  };

  const labelStyle = {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 10,
    color: "#A4B0C0"
  };

  // ---- Component JSX ----
  return (
    <div style={appTheme}>
      <div style={cardStyle}>
        <h2 style={{
          fontWeight: 700,
          fontSize: 28,
          margin: "0 0 18px 0",
          color: "#56CCF2",
          letterSpacing: 1
        }}>
          Currency Converter
        </h2>
        
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Amount</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} style={selectStyle}>
              {currencies.map(cur => <option key={cur}>{cur}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 30, color: "#56CCF2", margin: "0 10px" }}>→</span>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>To</label>
            <select value={to} onChange={e => setTo(e.target.value)} style={selectStyle}>
              {currencies.map(cur => <option key={cur}>{cur}</option>)}
            </select>
          </div>
        </div>

        <div style={{ minHeight: 32, textAlign: "center" }}>
          {error && <span style={errorStyle}>{error}</span>}
          {result && !error &&
            <div style={resultStyle}>
              {amount} {from} = {result} {to}
              <div style={{ fontSize: 14, color: "#A4B0C0", marginTop: 6 }}>
                1 {from} = {rate} {to}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}