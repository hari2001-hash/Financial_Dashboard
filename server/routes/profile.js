// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// // Authentication middleware (reuse your ensureAuthenticated)
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated && req.isAuthenticated()) return next();
//   res.status(401).json({ error: "Unauthorized" });
// }

// // Get current user's profile
// router.get("/", ensureAuthenticated, async (req, res) => {
//   const user = await User.findById(req.user._id).select("name email");
//   res.json(user);
// });

// // Update name/email
// router.put("/", ensureAuthenticated, async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) return res.status(400).json({ error: "Name and email required." });
//   const updated = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, select: "name email" });
//   res.json(updated);
// });

// // routes/profile.js
// router.get("/", ensureAuthenticated, async (req, res) => {
//   const user = await User.findById(req.user._id).select("name email");
//   if (!user) return res.status(404).json({ error: "User not found" });
//   res.json(user);
// });

// // Update password
// router.put("/password", ensureAuthenticated, async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both passwords required." });
//   const user = await User.findById(req.user._id);
//   const match = await bcrypt.compare(currentPassword, user.password);
//   if (!match) return res.status(403).json({ error: "Current password is incorrect." });
//   user.password = await bcrypt.hash(newPassword, 10);
//   await user.save();
//   res.json({ success: true });
// });








// module.exports = router;




const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Replace this with your real authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// GET /api/profile
router.get("/", ensureAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id).select("name email");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// PUT /api/profile
router.put("/", ensureAuthenticated, async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email required." });
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, select: "name email" }
  );
  if (!updated) return res.status(404).json({ error: "User not found." });
  res.json(updated);
});

// PUT /api/profile/password
router.put("/password", ensureAuthenticated, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "Both passwords required." });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: "User not found." });
  const match = await user.comparePassword(currentPassword); // Make sure User schema has comparePassword method
  if (!match) return res.status(403).json({ error: "Current password is incorrect." });
  user.password = newPassword;
  await user.save();
  res.json({ success: true });
});

module.exports = router;