const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Create a new reminder
router.post('/', async (req, res) => {
  try {
    const { user, title, description, dateTime, type } = req.body;
    const reminder = new Reminder({ user, title, description, dateTime, type });
    await reminder.save();
    res.status(201).json({ message: 'Reminder created', reminder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all reminders for a user
router.get('/user/:userId', async (req, res) => {
    try {
      const reminders = await Reminder.find({ user: req.params.userId });
      res.json(reminders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports = router;
