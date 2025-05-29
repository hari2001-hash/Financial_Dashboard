const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// Get all alerts for logged-in user
router.get("/", ensureAuthenticated, async (req, res) => {
  const alerts = await Alert.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(alerts);
});

// Mark an alert as read
router.post("/:id/read", ensureAuthenticated, async (req, res) => {
  await Alert.updateOne({ _id: req.params.id, userId: req.user._id }, { $set: { read: true } });
  res.json({ success: true });
});
router.get("/", ensureAuthenticated, async (req, res) => {
  const alerts = await Alert.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(alerts);
});

router.post("/:id/read", ensureAuthenticated, async (req, res) => {
  await Alert.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

module.exports = router;