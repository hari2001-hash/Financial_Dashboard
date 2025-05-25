// const mongoose = require("mongoose");

// const TransactionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   amount: Number,
//   category: String,
//   type: { type: String, enum: ["income", "expense"] },
//   date: { type: Date, default: Date.now },
//   note: String,
// });

// module.exports = mongoose.model("Transaction", TransactionSchema);

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);