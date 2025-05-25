const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser"); // npm install csv-parser
const Transaction = require("../models/Transaction");

// Use multer for file uploads


const upload = multer({ dest: "uploads/" });

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

// POST /api/upload-statement
router.post("/", ensureAuthenticated, upload.single("statement"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fs = require("fs");
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      // Expecting columns: Date, Type, Category, Amount, Notes
      // You may need to customize based on your bank's CSV format!
      try {
        if (!row.Date || !row.Amount) return;
        results.push({
          userId: req.user._id,
          type: row.Type?.toLowerCase() === "income" ? "income" : "expense",
          category: row.Category || row.Description || "Uncategorized",
          amount: Number(row.Amount),
          date: new Date(row.Date),
          notes: row.Notes || row.Description || "",
        });
      } catch (err) {/* skip row */}
    })
    .on("end", async () => {
      try {
        // Save all transactions to DB
        const inserted = await Transaction.insertMany(results);
        fs.unlinkSync(req.file.path); // remove uploaded file
        res.json({ importedCount: inserted.length, newTransactions: inserted });
      } catch (e) {
        res.status(500).json({ error: "Failed to import transactions" });
      }
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Failed to parse CSV" });
    });
});

module.exports = router;