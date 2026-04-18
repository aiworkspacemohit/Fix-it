const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

const User = require('./models/User');
const WorkerProfile = require('./models/WorkerProfile');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await WorkerProfile.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Customers
    const customers = [];
    for (let i = 1; i <= 3; i++) {
      customers.push({
        name: `Customer ${i}`,
        email: `customer${i}@test.com`,
        password: hashedPassword,
        role: 'customer',
        location: { city: 'New York', address: `Address ${i}` }
      });
    }
    const createdCustomers = await User.insertMany(customers);

    // 2. Create Workers
    const workersData = [
      { name: 'John Plumber', category: 'Plumbing', skills: ['Pipes', 'Leakage'] },
      { name: 'Jane Electric', category: 'Electrician', skills: ['Wiring', 'Lighting'] },
      { name: 'Mike AC', category: 'AC', skills: ['AC Installation', 'AC Repair'] },
      { name: 'Sarah Carpenter', category: 'Carpenter', skills: ['Furniture', 'Woodwork'] },
      { name: 'Paul Painter', category: 'Painter', skills: ['Wall painting', 'Exterior'] },
      { name: 'Tom AC', category: 'AC', skills: ['Cooling', 'Ducts'] },
      { name: 'Alice Plumber', category: 'Plumbing', skills: ['Bathroom', 'Kitchen'] },
      { name: 'Bob Electric', category: 'Electrician', skills: ['Fans', 'Motors'] }
    ];

    const createdWorkers = [];
    const createdProfiles = [];

    for (let i = 0; i < workersData.length; i++) {
      const wd = workersData[i];
      const user = await User.create({
        name: wd.name,
        email: `worker${i + 1}@test.com`,
        password: hashedPassword,
        role: 'worker',
        location: { city: 'New York', address: `Worker Address ${i}` }
      });
      createdWorkers.push(user);

      const profile = await WorkerProfile.create({
        userId: user._id,
        category: wd.category,
        skills: wd.skills,
        bio: `Experienced ${wd.category} professional.`,
        hourlyRate: 30 + Math.floor(Math.random() * 40),
        rating: 4 + Math.random(),
        totalJobs: 10 + Math.floor(Math.random() * 50),
        isVerified: true
      });
      createdProfiles.push(profile);
    }

    // 3. Create Bookings & Reviews
    for (let i = 0; i < 5; i++) {
      const customer = createdCustomers[i % 3];
      const worker = createdWorkers[i % 8];

      const booking = await Booking.create({
        customerId: customer._id,
        workerId: worker._id,
        date: new Date(Date.now() + i * 86400000), // Next few days
        timeSlot: '10:00 AM',
        problemDescription: `Need help with ${createdProfiles[i % 8].category} issue.`,
        status: 'completed'
      });

      await Review.create({
        bookingId: booking._id,
        customerId: customer._id,
        workerId: worker._id,
        rating: 5,
        comment: 'Great work! Very professional.'
      });
    }

    console.log('Seed data inserted successfully!');
    process.exit();
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
