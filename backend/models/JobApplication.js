const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'interview', 'offered', 'rejected'], default: 'applied' },
  appliedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
