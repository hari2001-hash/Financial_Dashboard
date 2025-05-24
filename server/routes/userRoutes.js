const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");

router.post("/register", registerUser);

const User = require('../models/users');

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
