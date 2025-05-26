const mongoose = require("mongoose");
const liabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  type: { type: String, enum: ["asset", "liability"], default: "liability" },
  notes: { type: String },
  date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Liability", liabilitySchema);