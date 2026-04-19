const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/feedback
// @desc Submit global platform feedback
router.post('/', protect, async (req, res) => {
  try {
    const { message, rating } = req.body;
    const feedback = await Feedback.create({
      userId: req.user.id,
      message,
      rating
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Server error saving feedback' });
  }
});

// @route GET /api/feedback/dev
// @desc Developer panel to view all platform feedback
router.get('/dev', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'name email role').sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching feedback' });
  }
});

module.exports = router;
