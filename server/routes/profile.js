const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// JWT auth middleware
function jwtAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "No token" });
  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Update profile route
router.put('/', jwtAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, photo } = req.body;

    // Only update provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (photo) updateFields.photo = photo;

    const user = await Register.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;