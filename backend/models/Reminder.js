const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dateTime: { type: Date, required: true },
  type: { type: String, enum: ['test', 'interview', 'other'], default: 'other' }
});

module.exports = mongoose.model('Reminder', reminderSchema);