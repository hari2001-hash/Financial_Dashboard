// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");

// // Transaction Schema
// const transactionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
//   type: { type: String, enum: ["income", "expense"], required: true },
//   category: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { type: Date, required: true },
//   notes: { type: String },
// }, { timestamps: true });

// const Transaction = mongoose.model("Transaction", transactionSchema);

// // Middleware to check authentication
// function ensureAuthenticated(req, res, next) {
//   if (!req.isAuthenticated || !req.isAuthenticated()) {
//     return res.status(401).json({ error: "Not authenticated" });
//   }
//   next();
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

// // POST /api/transactions - Add a new transaction
// router.post("/", ensureAuthenticated, async (req, res) => {
//   try {
//     const { type, category, amount, date, notes } = req.body;
//     if (!type || !category || !amount || !date) {
//       return res.status(400).json({ error: "All required fields must be provided." });
//     }
//     const tx = new Transaction({
//       userId: req.user._id,
//       type,
//       category,
//       amount,
//       date,
//       notes,
//     });
//     await tx.save();
//     res.status(201).json(tx);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add transaction." });
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


// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");

// // Transaction Schema
// const transactionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
//   type: { type: String, enum: ["income", "expense"], required: true },
//   category: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { type: Date, required: true },
//   notes: { type: String },
// }, { timestamps: true });

// const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

// // Middleware to check authentication
// function ensureAuthenticated(req, res, next) {
//   if (!req.isAuthenticated || !req.isAuthenticated()) {
//     return res.status(401).json({ error: "Not authenticated" });
//   }
//   next();
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

// // POST /api/transactions - Add a new transaction
// router.post("/", ensureAuthenticated, async (req, res) => {
//   try {
//     const { type, category, amount, date, notes } = req.body;
//     if (!type || !category || !amount || !date) {
//       return res.status(400).json({ error: "All required fields must be provided." });
//     }
//     // Ensure date is a valid date object
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
//     res.status(201).json(tx);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add transaction." });
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




// const express = require("express");
// const router = express.Router();
// const Transaction = require("../models/Transaction");

// // (Assume you have a middleware like ensureAuthenticated)
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated && req.isAuthenticated()) return next();
//   res.status(401).json({ error: "Unauthorized" });
// }

// // PUT /api/transactions/:id - Update a transaction
// router.put("/:id", ensureAuthenticated, async (req, res) => {
//   try {
//     const { type, category, amount, date, notes } = req.body;
//     if (!type || !category || !amount || !date) {
//       return res.status(400).json({ error: "All required fields must be provided." });
//     }
//     const updated = await Transaction.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user._id },
//       { type, category, amount, date, notes },
//       { new: true }
//     );
//     if (!updated) return res.status(404).json({ error: "Transaction not found." });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update transaction." });
//   }
// });






// module.exports = router;

const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

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

// POST /api/transactions - Add a new transaction
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