const mongoose = require("mongoose");
const assetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  notes: { type: String },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Asset", assetSchema);