
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Alert = require("../models/Alert");
const User = require("../models/User");
const { sendBudgetAlertEmail } = require("../utils/email");

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// GET /api/transactions - Fetch all transactions for current user
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user._id }).sort({ date: -1, createdAt: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions." });
  }
});

// POST /api/transactions - Add a new transaction + alert logic
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { type, category, amount, date, notes } = req.body;
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }
    // Ensure date is a valid date object and not in the future
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }
    if (parsedDate > new Date()) {
      return res.status(400).json({ error: "Date cannot be in the future." });
    }
    const tx = new Transaction({
      userId: req.user._id,
      type,
      category,
      amount,
      date: parsedDate,
      notes,
    });
    await tx.save();

    // ------ ALERT LOGIC STARTS HERE ------
    // Always check budgets for "expense" transactions, case-insensitive
    if (type.toLowerCase() === "expense") {
      const budgets = await Budget.find({ userId: req.user._id, category });
      const user = await User.findById(req.user._id);

      function getPeriodStart(budget, now) {
        const start = new Date(budget.startDate);
        if (budget.period === "monthly") {
          const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return firstOfMonth > start ? firstOfMonth : start;
        } else if (budget.period === "weekly") {
          const day = now.getDay();
          const diff = now.getDate() - day + (day === 0 ? -6 : 1);
          const monday = new Date(now);
          monday.setDate(diff);
          monday.setHours(0, 0, 0, 0);
          return monday > start ? monday : start;
        } else {
          return start;
        }
      }

      for (const b of budgets) {
        const now = parsedDate;
        const periodStart = getPeriodStart(b, now);
        const periodEnd = now;

        const total = await Transaction.aggregate([
          {
            $match: {
              userId: b.userId,
              category: b.category,
              type: { $regex: /^expense$/i },
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
        const percentUsed = b.amount > 0 ? amountSpent / b.amount : 0;

        // Use custom threshold if set, else default to 1 (100%)
        const threshold = typeof b.threshold === "number" ? b.threshold : 1;

        // Trigger alert if above threshold
        if (percentUsed > threshold) {
          const percent = (threshold * 100).toFixed(0);
          const message = 
            percentUsed > 1
              ? `You have exceeded your budget for ${b.category} (${b.period})!\nBudget: ₹${b.amount}\nSpent: ₹${amountSpent}`
              : `You have used ${percent}% of your budget for ${b.category} (${b.period}).\nBudget: ₹${b.amount}\nSpent: ₹${amountSpent}`;
          await Alert.create({
            userId: b.userId,
            budgetId: b._id,
            category: b.category,
            period: b.period,
            message,
          });

          // Prefer user.email from DB, fallback to req.user.email
          const alertEmail = user?.email || req.user.email;
          if (alertEmail) {
            try {
              await sendBudgetAlertEmail(alertEmail, b.category, b.amount, amountSpent, percentUsed, threshold);
            } catch (emailErr) {
              console.error("Error sending alert email:", emailErr);
            }
          }
        }
      }
    }
    // ------ ALERT LOGIC ENDS HERE ------

    res.status(201).json(tx);
  } catch (err) {
    console.error("Error in POST /api/transactions:", err);
    res.status(500).json({ error: "Failed to add transaction." });
  }
});

// PUT /api/transactions/:id - Update a transaction
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { type, category, amount, date, notes } = req.body;
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }
    if (parsedDate > new Date()) {
      return res.status(400).json({ error: "Date cannot be in the future." });
    }
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { type, category, amount, date: parsedDate, notes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Transaction not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update transaction." });
  }
});

// DELETE /api/transactions/:id - Delete a transaction
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!tx) return res.status(404).json({ error: "Transaction not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transaction." });
  }
});

module.exports = router;