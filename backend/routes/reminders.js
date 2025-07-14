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
