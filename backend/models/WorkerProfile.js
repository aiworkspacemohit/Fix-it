const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // e.g., 'AC', 'Plumbing', 'Electric', 'Carpenter', 'Painter'
  skills: [{ type: String }],
  bio: { type: String },
  hourlyRate: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  availableSlots: [{
    date: Date,
    times: [String] // e.g., ['09:00', '10:00', '14:00']
  }],
  profileImage: { type: String }
});

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
