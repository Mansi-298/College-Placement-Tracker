const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');

// Create a new job application
router.post('/', async (req, res) => {
  try {
    const { student, company, position, status } = req.body;
    const jobApp = new JobApplication({ student, company, position, status });
    await jobApp.save();
    res.status(201).json({ message: 'Job application created', jobApp });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all job applications for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const jobApps = await JobApplication.find({ student: req.params.studentId });
    res.json(jobApps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all job applications (TPO view)
router.get('/', async (req, res) => {
  try {
    const jobApps = await JobApplication.find().populate('student', 'name email');
    res.json(jobApps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;