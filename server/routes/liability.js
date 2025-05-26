const express = require("express");
const router = express.Router();
const Liability = require("../models/liability");

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// GET /api/liabilities - Fetch all liabilities for current user
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const liabilities = await Liability.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(liabilities);
  } catch {
    res.status(500).json({ error: "Failed to fetch liabilities." });
  }
});

// POST /api/liabilities - Add a new liability
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { name, value, notes, date } = req.body;
    if (!name || !value || !date) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }
    const liability = new Liability({ userId: req.user._id, name, value, notes, date });
    await liability.save();
    res.status(201).json(liability);
  } catch {
    res.status(500).json({ error: "Failed to add liability." });
  }
});

// PUT /api/liabilities/:id - Update a liability
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { name, value, notes, date } = req.body;
    if (!name || !value || !date) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }
    const updated = await Liability.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, value, notes, date },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Liability not found." });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update liability." });
  }
});

// DELETE /api/liabilities/:id - Delete a liability
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const liability = await Liability.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!liability) return res.status(404).json({ error: "Liability not found." });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete liability." });
  }
});

module.exports = router;