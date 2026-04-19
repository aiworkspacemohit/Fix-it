const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fixit_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});
const upload = multer({ storage });

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/auth/register
router.post('/register', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password, role, city, address, category, skills, hourlyRate, bio } = req.body;
    const profileImage = req.file ? req.file.path : '';

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      location: { city, address }
    });

    // If registering as worker, auto-create a WorkerProfile
    if (role === 'worker') {
      const skillsArray = skills
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      await WorkerProfile.create({
        userId: user._id,
        category: category || 'General',
        skills: skillsArray,
        bio: bio || `Experienced ${category || 'repair'} professional.`,
        hourlyRate: parseFloat(hourlyRate) || 30,
        rating: 0,
        totalJobs: 0,
        isVerified: false,
        profileImage: profileImage
      });
    }

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server Error during registration' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route DELETE /api/auth/me
// @desc Delete user account and cascade delete tracking data
router.delete('/me', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role === 'worker') {
      const profile = await WorkerProfile.findOne({ userId });
      if (profile && profile.profileImage && profile.profileImage.includes('res.cloudinary.com')) {
        try {
          const parts = profile.profileImage.split('/');
          const fileName = parts.pop().split('.')[0];
          const folder = parts.pop();
          const publicId = `${folder}/${fileName}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.error("Cloudinary deletion failed:", cloudErr);
        }
      }
      await WorkerProfile.deleteOne({ userId });
    }

    await Booking.deleteMany({ $or: [{ customerId: userId }, { workerId: userId }] });
    await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });
    await User.deleteOne({ _id: userId });

    res.json({ message: 'Account completely deleted.' });
  } catch (error) {
    console.error('Deletion error:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

// @route PUT /api/auth/me
// @desc Update user/worker details
router.put('/me', protect, async (req, res) => {
  try {
    const { name, email, city, address, category, hourlyRate, bio } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    if (city || address) {
      if(!user.location) user.location = {};
      user.location.city = city || user.location.city;
      user.location.address = address || user.location.address;
    }
    await user.save();

    if (user.role === 'worker') {
      const workerProfile = await WorkerProfile.findOne({ userId });
      if (workerProfile) {
        workerProfile.category = category || workerProfile.category;
        workerProfile.hourlyRate = hourlyRate || workerProfile.hourlyRate;
        workerProfile.bio = bio || workerProfile.bio;
        await workerProfile.save();
      }
    }

    res.json({ message: 'Profile updated perfectly', name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;
