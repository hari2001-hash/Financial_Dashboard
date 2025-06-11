import React, { useState } from "react";
import "./RetirementCalculator.css";

function calculateRetirementCorpus(currentAge, retireAge, monthlyExpense, inflationRate, withdrawalRate = 4) {
  const yearsToRetire = retireAge - currentAge;
  const futureExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetire);
  const annualExpense = futureExpense * 12;
  // withdrawalRate is in percent (use 4 for 4% rule)
  return annualExpense / (withdrawalRate / 100);
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [expense, setExpense] = useState(30000);
  const [inflation, setInflation] = useState(6);
  const [withdrawal, setWithdrawal] = useState(4);

  const corpus = calculateRetirementCorpus(currentAge, retireAge, expense, inflation, withdrawal);

  return (
    <div className="retire-app-theme">
      <div className="retire-card">
        <h2 className="retire-title">Retirement Corpus Calculator</h2>
        <div className="retire-input-row">
          <label className="retire-label">Current Age</label>
          <input
            type="number"
            min="18"
            max="80"
            value={currentAge}
            onChange={e => setCurrentAge(+e.target.value)}
            className="retire-input"
          />
        </div>
        <div className="retire-input-row">
          <label className="retire-label">Retirement Age</label>
          <input
            type="number"
            min={currentAge + 1}
            max="80"
            value={retireAge}
            onChange={e => setRetireAge(Math.max(+e.target.value, currentAge + 1))}
            className="retire-input"
          />
        </div>
        <div className="retire-input-row">
          <label className="retire-label">Current Monthly Expense</label>
          <input
            type="number"
            min="0"
            value={expense}
            onChange={e => setExpense(+e.target.value)}
            className="retire-input"
          />
        </div>
        <div className="retire-input-row">
          <label className="retire-label">Inflation Rate (%)</label>
          <input
            type="number"
            min="0"
            max="15"
            step="0.1"
            value={inflation}
            onChange={e => setInflation(+e.target.value)}
            className="retire-input"
          />
        </div>
        <div className="retire-input-row">
          <label className="retire-label">Withdrawal Rate (%)</label>
          <input
            type="number"
            min="3"
            max="8"
            step="0.1"
            value={withdrawal}
            onChange={e => setWithdrawal(+e.target.value)}
            className="retire-input"
          />
        </div>
        <div className="retire-results">
          <div>
            <span className="retire-results-label">Estimated Retirement Corpus Needed</span>
            <span className="retire-results-value">₹{corpus.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
          </div>
        </div>
      </div>
    </div>
  );
}