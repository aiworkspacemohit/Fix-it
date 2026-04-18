const express = require('express');
const router = express.Router();
const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/workers
// @desc Get all workers with search and filter
router.get('/', async (req, res) => {
  try {
    const { category, city } = req.query;

    // First find users that match the city filter if provided
    let userIds = null;
    if (city) {
      const users = await User.find({ role: 'worker', 'location.city': new RegExp(city, 'i') }).select('_id');
      userIds = users.map(u => u._id);
    }

    // Build query for WorkerProfile
    let query = {};
    if (category) query.category = new RegExp(category, 'i');
    if (userIds) query.userId = { $in: userIds };

    const workers = await WorkerProfile.find(query).populate('userId', 'name email location');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching workers' });
  }
});

// @route GET /api/workers/:id
// @desc Get single worker profile by userId
router.get('/:id', async (req, res) => {
  try {
    const worker = await WorkerProfile.findOne({ userId: req.params.id }).populate('userId', 'name email location');
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching worker profile' });
  }
});

// @route POST /api/workers/setup
// @desc Create or update WorkerProfile for the logged-in worker (fixes existing workers with no profile)
router.post('/setup', protect, async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can set up a worker profile' });
    }

    const { category, skills, hourlyRate, bio } = req.body;
    const skillsArray = skills
      ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean))
      : [];

    // Upsert: create if not exists, update if exists
    const profile = await WorkerProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        category: category || 'General',
        skills: skillsArray,
        bio: bio || `Experienced ${category || 'repair'} professional.`,
        hourlyRate: parseFloat(hourlyRate) || 30,
        isVerified: false
      },
      { upsert: true, new: true }
    );

    res.status(201).json(profile);
  } catch (error) {
    console.error('Worker setup error:', error);
    res.status(500).json({ message: 'Server error setting up profile' });
  }
});

module.exports = router;
