const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: "Budget", required: true },
  category: String,
  period: String,
  type: { type: String, default: "budget" }, // e.g. 'budget'
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);