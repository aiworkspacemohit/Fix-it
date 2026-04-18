const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const WorkerProfile = require('../models/WorkerProfile');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, workerId, rating, comment } = req.body;
    const customerId = req.user.id;

    // Check if booking is completed and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.customerId.toString() !== customerId) {
      return res.status(403).json({ message: 'Not authorized logic error' });
    }

    // Create review
    const review = await Review.create({
      bookingId,
      customerId,
      workerId,
      rating,
      comment
    });

    // Update worker rating
    const workerProfile = await WorkerProfile.findOne({ userId: workerId });
    if (workerProfile) {
      const currentRatingTotal = workerProfile.rating * workerProfile.totalJobs;
      workerProfile.totalJobs += 1;
      workerProfile.rating = (currentRatingTotal + rating) / workerProfile.totalJobs;
      await workerProfile.save();
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating review' });
  }
});

// @route GET /api/reviews/:workerId
router.get('/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

module.exports = router;
