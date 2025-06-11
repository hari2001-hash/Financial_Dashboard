import React, { useState } from "react";
import "./SIPCalculator.css";

function calculateSIP(P, rate, months) {
  const r = rate / 12 / 100;
  return P * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

export default function SIPCalculator() {
  const [amount, setAmount] = useState(2000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(60);

  const futureValue = calculateSIP(amount, rate, months);
  const totalInvested = amount * months;
  const gain = futureValue - totalInvested;

  return (
    <div className="sip-app-theme">
      <div className="sip-card">
        <h2 className="sip-title">SIP Calculator</h2>
        <div className="sip-input-row">
          <label className="sip-label">Monthly Investment</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(+e.target.value)}
            className="sip-input"
          />
        </div>
        <div className="sip-input-row">
          <label className="sip-label">Annual Return Rate (%)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={rate}
            onChange={e => setRate(+e.target.value)}
            className="sip-input"
          />
        </div>
        <div className="sip-input-row">
          <label className="sip-label">Investment Tenure (months)</label>
          <input
            type="number"
            min="1"
            value={months}
            onChange={e => setMonths(+e.target.value)}
            className="sip-input"
          />
        </div>
        <div className="sip-results">
          <div>
            <span className="sip-results-label">Future Value</span>
            <span className="sip-results-value">₹{futureValue.toFixed(2)}</span>
          </div>
          <div>
            <span className="sip-results-label">Total Invested</span>
            <span className="sip-results-value">₹{totalInvested.toFixed(2)}</span>
          </div>
          <div>
            <span className="sip-results-label">Total Gain</span>
            <span className="sip-results-value">₹{gain.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}