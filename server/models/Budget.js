const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { type: String, enum: ["monthly", "weekly"], required: true }, // "monthly" or "weekly"
  startDate: { type: Date, required: true }, // Start of budget period (e.g., 1st of month)
}, { timestamps: true });

module.exports = mongoose.model("Budget", budgetSchema);