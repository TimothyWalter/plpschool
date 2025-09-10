
/**
 * Run this script to seed demo users and products:
 *   node seed.js
 * Ensure MONGO_URI in environment or change the URI below.
 */
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const fs = require('fs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farmcap';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  // Clear collections (careful in production)
  await User.deleteMany({});
  await Order.deleteMany({});

  // Create demo users
  const users = [
    { name: 'Alice Farmer', email: 'alice@example.com', password: 'password', role: 'customer' },
    { name: 'Bob Trader', email: 'bob@example.com', password: 'password', role: 'trader' },
    { name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
  ];
  for (let u of users) {
    let user = new User(u);
    await user.save();
    console.log('Created user', user.email);
  }

  // Create demo orders (attached to first user)
  const demoOrders = [
    {
      items: [{ productName: 'Maize', price: 200, quantity: 3 }],
      status: 'Pending',
      paymentStatus: 'pending',
      total: 600
    },
    {
      items: [{ productName: 'Fertilizer', price: 500, quantity: 1 }],
      status: 'Paid',
      paymentStatus: 'success',
      total: 500
    }
  ];

  for (let o of demoOrders) {
    let order = new Order(o);
    await order.save();
    console.log('Created order', order._id);
  }

  console.log('Seeding complete');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
