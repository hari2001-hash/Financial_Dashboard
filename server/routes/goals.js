const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// Get all goals for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const goals = await Goal.find({ userId }).sort({ deadline: 1 });
  res.json(goals);
});

// Create a new goal
router.post('/', async (req, res) => {
  const goal = new Goal(req.body);
  await goal.save();
  res.status(201).json(goal);
});

// Update goal progress or details
router.put('/:goalId', async (req, res) => {
  const { goalId } = req.params;
  const updatedGoal = await Goal.findByIdAndUpdate(goalId, req.body, { new: true });
  res.json(updatedGoal);
});

// Delete a goal
router.delete('/:goalId', async (req, res) => {
  await Goal.findByIdAndDelete(req.params.goalId);
  res.status(204).end();
});

module.exports = router;