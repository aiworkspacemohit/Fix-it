const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/chat/:bookingId
// @desc Get chat history for a specific booking
router.get('/:bookingId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ bookingId: req.params.bookingId })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching chat history' });
  }
});

module.exports = router;
