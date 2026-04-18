const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/bookings
// @desc Create a new booking
router.post('/', protect, async (req, res) => {
  try {
    const { workerId, date, timeSlot, problemDescription } = req.body;
    const customerId = req.user.id;

    // Optional: Check if slot is available
    const booking = await Booking.create({
      customerId,
      workerId,
      date,
      timeSlot,
      problemDescription
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @route GET /api/bookings
// @desc Get bookings for logged-in user (customer or worker)
router.get('/', protect, async (req, res) => {
  try {
    const role = req.user.role;
    let query = {};
    
    if (role === 'customer') {
      query.customerId = req.user.id;
    } else if (role === 'worker') {
      query.workerId = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name email location')
      .populate('workerId', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// @route PUT /api/bookings/:id/status
// @desc Update booking status (worker mainly)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted', 'completed', 'cancelled'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Role check: Worker can accept/complete, Customer can cancel
    // Simplified for now
    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating booking' });
  }
});

module.exports = router;
