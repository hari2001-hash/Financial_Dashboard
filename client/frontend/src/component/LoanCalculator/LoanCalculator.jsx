import React, { useState } from "react";
import "./LoanCalculator.css";

function calculateEMI(P, annualRate, N) {
  const R = annualRate / 12 / 100;
  return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
}

export default function LoanCalculator() {
  const [P, setP] = useState(100000);
  const [rate, setRate] = useState(8);
  const [months, setMonths] = useState(60);
  const emi = calculateEMI(P, rate, months);
  const total = emi * months;
  const interest = total - P;

  return (
    <div className="loan-app-theme">
      <div className="loan-card">
        <h2 className="loan-title">Loan EMI Calculator</h2>
        <div className="loan-input-row">
          <label className="loan-label">Loan Amount</label>
          <input
            type="number"
            value={P}
            min={0}
            onChange={e => setP(+e.target.value)}
            className="loan-input"
          />
        </div>
        <div className="loan-input-row">
          <label className="loan-label">Annual Rate (%)</label>
          <input
            type="number"
            value={rate}
            min={0}
            step={0.01}
            onChange={e => setRate(+e.target.value)}
            className="loan-input"
          />
        </div>
        <div className="loan-input-row">
          <label className="loan-label">Tenure (months)</label>
          <input
            type="number"
            value={months}
            min={1}
            onChange={e => setMonths(+e.target.value)}
            className="loan-input"
          />
        </div>
        <div className="loan-results">
          <div>
            <span className="loan-results-label">Monthly EMI</span>
            <span className="loan-results-value">₹{emi.toFixed(2)}</span>
          </div>
          <div>
            <span className="loan-results-label">Total Interest</span>
            <span className="loan-results-value">₹{interest.toFixed(2)}</span>
          </div>
          <div>
            <span className="loan-results-label">Total Payment</span>
            <span className="loan-results-value">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}