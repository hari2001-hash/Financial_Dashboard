// const express = require("express");
// const router = express.Router();
// const Transaction = require("../models/Transaction");
// const Budget = require("../models/Budget");
// const Alert = require("../models/Alert");
// const User = require("../models/User");
// const { sendBudgetAlertEmail } = require("../utils/email"); // Create this util as shown previously

// // Middleware to check authentication
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated && req.isAuthenticated()) return next();
//   res.status(401).json({ error: "Unauthorized" });
// }

// // GET /api/transactions - Fetch all transactions for current user
// router.get("/", ensureAuthenticated, async (req, res) => {
//   try {
//     const txs = await Transaction.find({ userId: req.user._id }).sort({ date: -1, createdAt: -1 });
//     res.json(txs);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch transactions." });
//   }
// });

// // POST /api/transactions - Add a new transaction + alert logic
// router.post("/", ensureAuthenticated, async (req, res) => {
//   try {
//     const { type, category, amount, date, notes } = req.body;
//     if (!type || !category || !amount || !date) {
//       return res.status(400).json({ error: "All required fields must be provided." });
//     }
//     // Ensure date is a valid date object and not in the future
//     const parsedDate = new Date(date);
//     if (isNaN(parsedDate.getTime())) {
//       return res.status(400).json({ error: "Invalid date format." });
//     }
//     if (parsedDate > new Date()) {
//       return res.status(400).json({ error: "Date cannot be in the future." });
//     }
//     const tx = new Transaction({
//       userId: req.user._id,
//       type,
//       category,
//       amount,
//       date: parsedDate,
//       notes,
//     });
//     await tx.save();

//     // ------ ALERT LOGIC STARTS HERE ------
//     // Only check budgets for "expense" transactions
//     if (type === "expense") {
//       const budgets = await Budget.find({ userId: req.user._id, category });
//       const user = await User.findById(req.user._id);

//       function getPeriodStart(budget, now) {
//         const start = new Date(budget.startDate);
//         if (budget.period === "monthly") {
//           const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//           return firstOfMonth > start ? firstOfMonth : start;
//         } else if (budget.period === "weekly") {
//           const day = now.getDay();
//           const diff = now.getDate() - day + (day === 0 ? -6 : 1);
//           const monday = new Date(now);
//           monday.setDate(diff);
//           monday.setHours(0, 0, 0, 0);
//           return monday > start ? monday : start;
//         } else {
//           return start;
//         }
//       }

//       for (const b of budgets) {
//         const now = parsedDate;
//         const periodStart = getPeriodStart(b, now);
//         const periodEnd = now;

//         // Sum transactions for this user/category/period/type=expense
//         const total = await Transaction.aggregate([
//           {
//             $match: {
//               userId: b.userId,
//               category: b.category,
//               type: "expense",
//               date: { $gte: periodStart, $lte: periodEnd },
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               total: { $sum: "$amount" },
//             },
//           },
//         ]);
//         const amountSpent = total[0]?.total || 0;
//         const percentUsed = b.amount > 0 ? amountSpent / b.amount : 0;

//         // Check if already alerted for this budget/period and unread
//         const existingAlert = await Alert.findOne({
//           userId: b.userId,
//           budgetId: b._id,
//           category: b.category,
//           period: b.period,
//           read: false,
//           createdAt: { $gte: periodStart }
//         });

//         // You can also add a NEAR-BUDGET warning, e.g. percentUsed > 0.8

//         // Trigger alert if over budget (percentUsed > 1), and no active alert this period
//         if (percentUsed > 1 && !existingAlert) {
//           const message = `You have exceeded your budget for ${b.category} (${b.period})!\nBudget: ₹${b.amount}\nSpent: ₹${amountSpent}`;
//           await Alert.create({
//             userId: b.userId,
//             budgetId: b._id,
//             category: b.category,
//             period: b.period,
//             message,
//           });
//           if (user && user.email) {
//             try {
//               await sendBudgetAlertEmail(user.email, b.category, b.amount, amountSpent);
//             } catch (emailErr) {
//               // Optional: log email errors but don't block saving the transaction
//               console.error("Email send error:", emailErr);
//             }
//           }
//         }
//       }
//     }
//     // ------ ALERT LOGIC ENDS HERE ------

//     res.status(201).json(tx);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add transaction." });
//   }
// });

// // PUT /api/transactions/:id - Update a transaction
// router.put("/:id", ensureAuthenticated, async (req, res) => {
//   try {
//     const { type, category, amount, date, notes } = req.body;
//     if (!type || !category || !amount || !date) {
//       return res.status(400).json({ error: "All required fields must be provided." });
//     }
//     // Validate date
//     const parsedDate = new Date(date);
//     if (isNaN(parsedDate.getTime())) {
//       return res.status(400).json({ error: "Invalid date format." });
//     }
//     if (parsedDate > new Date()) {
//       return res.status(400).json({ error: "Date cannot be in the future." });
//     }
//     const updated = await Transaction.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user._id },
//       { type, category, amount, date: parsedDate, notes },
//       { new: true }
//     );
//     if (!updated) return res.status(404).json({ error: "Transaction not found." });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update transaction." });
//   }
// });

// // DELETE /api/transactions/:id - Delete a transaction
// router.delete("/:id", ensureAuthenticated, async (req, res) => {
//   try {
//     const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
//     if (!tx) return res.status(404).json({ error: "Transaction not found." });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete transaction." });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Alert = require("../models/Alert");
const User = require("../models/User");
const { sendBudgetAlertEmail } = require("../utils/email"); // Create this util as shown previously

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
    // Only check budgets for "expense" transactions
    if (type === "expense") {
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

        // Sum transactions for this user/category/period/type=expense
        const total = await Transaction.aggregate([
          {
            $match: {
              userId: b.userId,
              category: b.category,
              type: "expense",
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

        // Check if already alerted for this budget/period and unread
        const existingAlert = await Alert.findOne({
          userId: b.userId,
          budgetId: b._id,
          category: b.category,
          period: b.period,
          read: false,
          createdAt: { $gte: periodStart }
        });

        // Trigger alert if over budget (percentUsed > 1), and no active alert this period
        if (percentUsed > 1 && !existingAlert) {
          const message = `You have exceeded your budget for ${b.category} (${b.period})!\nBudget: ₹${b.amount}\nSpent: ₹${amountSpent}`;
          await Alert.create({
            userId: b.userId,
            budgetId: b._id,
            category: b.category,
            period: b.period,
            message,
          });
          if (user && user.email) {
            console.log("Attempting to send alert email to", user.email, b.category, b.amount, amountSpent); // <-- Added log
            try {
              await sendBudgetAlertEmail(user.email, b.category, b.amount, amountSpent);
              console.log("Alert email sent to", user.email); // <-- Added log
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
    // Validate date
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