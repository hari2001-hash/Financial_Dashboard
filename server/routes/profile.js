const express = require("express");
const router = express.Router();
const User = require("../models/User");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const csvParser = require('csv-parser');
const fs = require('fs');





// Authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// GET /api/profile - Get current user's profile
router.get("/", ensureAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id).select("name email");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// PUT /api/profile - Update name/email
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

// PUT /api/profile/password - Update password
router.put("/password", ensureAuthenticated, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "Both passwords required." });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: "User not found." });
  // Make sure User schema has comparePassword method
  const match = await user.comparePassword(currentPassword);
  if (!match) return res.status(403).json({ error: "Current password is incorrect." });
  user.password = newPassword;
  await user.save();
  res.json({ success: true });
});

// GET /api/profile/2fa/setup - Begin 2FA setup
router.get('/2fa/setup', ensureAuthenticated, async (req, res) => {
  const secret = speakeasy.generateSecret({ name: `YourApp (${req.user.email})` });
  await User.findByIdAndUpdate(req.user._id, { twoFactorSecret: secret.base32 });
  const qr = await QRCode.toDataURL(secret.otpauth_url);
  res.json({ qr, secret: secret.base32 });
});

// POST /api/profile/2fa/verify - Verify 2FA token
router.post('/2fa/verify', ensureAuthenticated, async (req, res) => {
  console.log("HIT /api/profile/2fa/verify");
  
  const { token } = req.body;
  console.log("Request body token:", token);

  // Log req.user object
  console.log("req.user:", req.user);

  const user = await User.findById(req.user._id);
  
  console.log("User from DB:", user);

  if (!user) {
    console.log("User not found, returning 404.");
    return res.status(404).json({ error: "User not found." });
  }

  if (!user.twoFactorSecret) {
    console.log("User does not have twoFactorSecret, returning 400.");
    return res.status(400).json({ error: "2FA not set up for this user." });
  }

  console.log("User twoFactorSecret:", user.twoFactorSecret);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token
  });
  console.log("TOTP verified:", verified);

  if (verified) {
    await User.findByIdAndUpdate(req.user._id, { twoFactorEnabled: true });
    console.log("2FA enabled, sending success.");
    res.json({ success: true });
  } else {
    console.log("Invalid token, returning 400.");
    res.status(400).json({ error: "Invalid token" });
  }
});




module.exports = router;