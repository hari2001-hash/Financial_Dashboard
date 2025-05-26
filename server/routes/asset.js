const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { name, value, notes, date } = req.body;
    if (!name || !value || !date) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }
    const asset = new Asset({
      userId: req.user._id,
      name,
      value,
      notes,
      date
    });
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    console.error(err); // <--- ADD THIS to see the error in your console
    res.status(500).json({ error: "Failed to add asset." });
  }

  router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { name, value, notes, date } = req.body;
    if (!name || !value || !date) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }
    const updated = await Asset.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, value, notes, date },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Asset not found." });
    res.json(updated);
  } catch (err) {
    console.error("Asset edit error:", err); // <- This will show the real error in your log!
    res.status(500).json({ error: "Failed to update asset." });
  }
});
});
module.exports = router;