const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  category: String,
  type: { type: String, enum: ["income", "expense"] },
  date: { type: Date, default: Date.now },
  note: String,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
