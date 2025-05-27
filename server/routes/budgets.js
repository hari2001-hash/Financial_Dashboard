const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction"); // <-- Add this line for usage calculation

// This middleware assumes req.user._id exists after authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// Create a new budget
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { category, amount, period, startDate } = req.body;
    if (!category || !amount || !period || !startDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const budget = new Budget({
      userId: req.user._id,
      category,
      amount,
      period,
      startDate,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error("Add budget error:", err);
    res.status(500).json({ error: "Failed to add budget" });
  }
});

// Get all budgets for the logged-in user
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

// --- BEGIN: Budget usage endpoint ---

// GET /api/budgets/usage
router.get("/usage", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const budgets = await Budget.find({ userId });

    const now = new Date();

    // Helper to get the period start for a budget
    function getPeriodStart(budget) {
      const start = new Date(budget.startDate);
      if (budget.period === "monthly") {
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return firstOfMonth > start ? firstOfMonth : start;
      } else if (budget.period === "weekly") {
        // Get the most recent Monday
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
        const monday = new Date(now);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        return monday > start ? monday : start;
      } else {
        return start;
      }
    }

    // For each budget, calculate usage
    const usagePromises = budgets.map(async (b) => {
      const periodStart = getPeriodStart(b);
      const periodEnd = now;

      // Sum transactions in this period for this user/category
      const total = await Transaction.aggregate([
        {
          $match: {
            userId: userId,
            category: b.category,
            date: { $gte: periodStart, $lte: periodEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const amountSpent = total[0]?.total || 0;
      return {
        budgetId: b._id,
        category: b.category,
        amountSpent,
        budgetAmount: b.amount,
        percentUsed: b.amount > 0 ? amountSpent / b.amount : 0,
      };
    });

    const usage = await Promise.all(usagePromises);
    res.json(usage);
  } catch (err) {
    console.error("Budget usage error:", err);
    res.status(500).json({ error: "Failed to calculate budget usage." });
  }
});

// --- END: Budget usage endpoint ---

// Update a budget
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { category, amount, period, startDate } = req.body;
    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { category, amount, period, startDate },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Budget not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update budget" });
  }
});

// Delete a budget
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ error: "Budget not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete budget" });
  }
});

module.exports = router;