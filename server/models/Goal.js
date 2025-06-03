const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // or ObjectId if you have User model
  title: { type: String, required: true },
  description: String,
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);