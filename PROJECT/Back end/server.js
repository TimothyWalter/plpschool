const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
app.use(bodyParser.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/payments_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error', err));

// Schemas
const orderSchema = new mongoose.Schema({
  orderId: String,
  customer: Object,
  cart: Array,
  paymentMethod: String,
  shipping: Number,
  total: Number,
  status: String,
  traderWebhook: String,
  createdAt: String
});
const Order = mongoose.model('Order', orderSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'admin' }
});
const User = mongoose.model('User', userSchema);

// Branch schema
const branchSchema = new mongoose.Schema({
  name: String,
  location: String,
  contact: String,
});
const Branch = mongoose.model('Branch', branchSchema);

// Seed default branches if none exist
(async function seedBranches(){
  try{
    const count = await Branch.countDocuments();
    if (!count) {
      const defaults = [
        { name: 'Nairobi Branch', location: 'Central Nairobi', contact: '0700-000001' },
        { name: 'Mombasa Branch', location: 'Mombasa Coast', contact: '0700-000002' },
        { name: 'Kisumu Branch', location: 'Kisumu Western', contact: '0700-000003' },
        { name: 'Eldoret Branch', location: 'Eldoret Rift Valley', contact: '0700-000004' },
      ];
      await Branch.insertMany(defaults);
      console.log('Seeded default branches');
    }
  }catch(e){ console.warn('Branch seed error', e.message) }
})();


// Seed admin from .env if provided
(async function seedAdmin(){
  try{
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;
    if (adminUser && adminPass) {
      const existing = await User.findOne({ username: adminUser });
      if (!existing) {
        const hash = await bcrypt.hash(adminPass, 10);
        await User.create({ username: adminUser, passwordHash: hash, role: 'admin' });
        console.log('Seeded admin user from .env');
      }
    }
  }catch(e){ console.warn('Admin seed error', e.message) }
})();

// Simple helpers for SMS/email (placeholders)

/* === Africa's Talking SMS Integration === */
const africastalking = require('africastalking')({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

async function sendSms(to, message) {
  try {
    const sms = africastalking.SMS;
    const response = await sms.send({
      to: [to],
      message: message,
      from: process.env.AT_FROM || undefined
    });
    console.log("SMS sent:", response);
    return response;
  } catch (err) {
    console.error("SMS error:", err.message || err);
    return null;
  }
}

  // integrate with SMS provider
}

async function sendEmail(to, subject, text) {
  if (!process.env.SMTP_HOST) {
    console.log('Email not sent (no SMTP).', to, subject);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text });
}

// Create order and prepare payment instruction
app.post('/api/checkout', async (req, res) => {
  const { customer, cart, paymentMethod, shipping, total, traderWebhook } = req.body;
  if (!customer || !cart) return res.status(400).json({ message: 'invalid' });
  const orderId = 'ord_' + Date.now();
  const order = { orderId, customer, cart, paymentMethod, shipping, total, status: 'pending', createdAt: new Date().toISOString(), traderWebhook };
  try {
    await Order.create(order);
    // In production: initiate provider-specific flows (M-Pesa STK push, Airtel collection, PayPal order creation)
    return res.json({ orderId, provider: paymentMethod, next: 'server created order; initiate provider flow server-side' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'server error' });
  }
});

// Payment provider webhook
app.post('/webhooks/payment', async (req, res) => {
  const payload = req.body;
  const { orderId, status } = payload;
  const order = await Order.findOne({ orderId });
  if (!order) return res.status(404).json({ message: 'order not found' });
  order.status = status;
  await order.save();
    try{ emitOrderUpdate(order); }catch(e){}


  // Notify trader via webhook
  try {
    if (order.traderWebhook) {
      await axios.post(order.traderWebhook, { orderId, status, order });
    }
  } catch (err) {
    console.warn('failed to notify trader webhook', err.message);
  }

  // Notify customer via SMS/email
  try { await sendSms(order.customer.phone, `Order ${orderId} status: ${status}.`); } catch(e){}
  try { await sendEmail(order.customer.email || process.env.MERCHANT_EMAIL, `Order ${orderId} status changed`, `Order status: ${status}`); } catch(e){}

  return res.json({ ok: true });
});

// Admin login - returns JWT
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'invalid credentials' });
    const token = jwt.sign({ sub: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'changeme', { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// JWT auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'invalid token' });
  }
}

// Admin endpoint: list all orders (protected)
app.get('/api/admin/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    // populate branch details for each order
    for (let i=0;i<orders.length;i++){
      if (orders[i].branchId){
        const b = await Branch.findById(orders[i].branchId).lean();
        orders[i].branch = b;
      }
    }
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to fetch orders' });
  }
});

// Get order by id (public for demo)
app.get('/orders/:id', async (req, res) => {
  const id = req.params.id;
  const o = await Order.findOne({ orderId: id }).lean();
  if (o && o.branchId) { const b = await Branch.findById(o.branchId).lean(); o.branch = b; }
  if (!o) return res.status(404).json({ message: 'not found' });
  res.json(o);
});



// Public: list branches (for checkout dropdown)
app.get('/api/branches', async (req, res) => {
  try {
    const branches = await Branch.find().lean();
    res.json(branches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to fetch branches' });
  }
});

// Admin: manage branches (protected)
app.get('/api/admin/branches', authMiddleware, async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 }).lean();
    res.json(branches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to fetch branches' });
  }
});

app.post('/api/admin/branches', authMiddleware, async (req, res) => {
  try {
    const { name, location, contact } = req.body;
    const b = await Branch.create({ name, location, contact });
    res.json(b);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to create branch' });
  }
});

app.put('/api/admin/branches/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, location, contact } = req.body;
    const b = await Branch.findByIdAndUpdate(id, { name, location, contact }, { new: true });
    res.json(b);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to update branch' });
  }
});

app.delete('/api/admin/branches/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    await Branch.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'failed to delete branch' });
  }
});


// Seed sample branches if none exist
(async () => {
  try {
    const count = await Branch.countDocuments();
    if (count === 0) {
      await Branch.insertMany([
        { name: 'Nairobi', location: 'Central', contact: '0700-000000' },
        { name: 'Mombasa', location: 'Coast', contact: '0700-111111' },
        { name: 'Kisumu', location: 'Western', contact: '0700-222222' },
        { name: 'Eldoret', location: 'Rift Valley', contact: '0700-333333' },
      ]);
      console.log('Seeded sample branches');
    }
  } catch (err) {
    console.error('Branch seeding failed', err);
  }
})();



/* MPESA STK PUSH */
// Initiate STK Push (Daraja) - placeholders used. Replace with real credentials in .env
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;
    if (!phone || !amount || !orderId) return res.status(400).json({ message: 'phone, amount, orderId required' });

    // In production: obtain OAuth token from Daraja, then call STK Push endpoint with proper headers and payload.
    // Here we simulate initiating the request and return a placeholder response.

    // Mark order as awaiting payment
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'order not found' });
    order.mpesa = { status: 'pending', phone };
    await order.save();
    try{ emitOrderUpdate(order); }catch(e){}


    return res.json({ ok: true, message: 'STK Push initiated (placeholder). Replace with real Daraja integration.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// MPESA callback endpoint (Daraja will POST results here)
app.post('/api/mpesa/callback', async (req, res) => {
  try {
    const data = req.body; // Daraja will send JSON payload
    // Example expected fields: Body.stkCallback.ResultCode, Body.stkCallback.CallbackMetadata.Item (for Receipt)
    // Since this is placeholder, we accept { orderId, resultCode, receipt } in body for testing.
    const { orderId, resultCode, receipt } = data;
    if (!orderId) return res.status(400).json({ message: 'orderId required' });
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'order not found' });

    if (Number(resultCode) === 0) {
      order.status = 'paid';
      order.paid = true;
      order.mpesa = { status: 'success', receipt };
    } else {
      order.status = 'payment_failed';
      order.paid = false;
      order.mpesa = { status: 'failed', resultCode };
    }
    await order.save();
    try{ emitOrderUpdate(order); }catch(e){}


    // notify trader webhook if present
    try { if (order.traderWebhook) await axios.post(order.traderWebhook, { orderId: order.orderId, status: order.status, order }); } catch(e){}

    // send SMS to customer (placeholder)
    try { await sendSms(order.customer.phone, `Order ${orderId} payment status: ${order.status}`); } catch(e){}

    return res.json({ ok: true });
  } catch (err) {
    console.error('mpesa callback error', err);
    res.status(500).json({ message: 'server error' });
  }
});



/* PAYPAL */
// Create PayPal order (server-side) - uses PayPal REST API. Placeholders in .env.
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    if (!amount || !orderId) return res.status(400).json({ message: 'amount and orderId required' });

    // In production: use PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to obtain access token and create an order.
    // Here we simulate creation and return a placeholder approval URL and id.
    const fakePayPalOrderId = 'PAYPAL-' + Date.now();
    // Save to order for tracking
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'order not found' });
    order.paypal = { status: 'created', paypalOrderId: fakePayPalOrderId };
    await order.save();
    try{ emitOrderUpdate(order); }catch(e){}


    return res.json({ id: fakePayPalOrderId, approveUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=' + fakePayPalOrderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});

// Capture PayPal order (after approval) - placeholder
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { paypalOrderId, orderId } = req.body;
    if (!paypalOrderId || !orderId) return res.status(400).json({ message: 'paypalOrderId and orderId required' });
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'order not found' });

    // Simulate capture success
    order.status = 'paid';
    order.paid = true;
    order.paypal = { status: 'captured', paypalOrderId };
    await order.save();
    try{ emitOrderUpdate(order); }catch(e){}


    // notify trader and customer
    try { if (order.traderWebhook) await axios.post(order.traderWebhook, { orderId: order.orderId, status: order.status, order }); } catch(e){}
    try { await sendSms(order.customer.phone, `Order ${orderId} payment status: ${order.status}`); } catch(e){}

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
});


// Mark order as shipped
app.post("/api/orders/:id/ship", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "shipped";
    await order.save();
    try{ emitOrderUpdate(order); }catch(e){}


    // Send SMS to customer
    await sendSms(order.customer.phone, `Hi ${order.customer.name}, your order ${order.orderId} has been shipped!`);

    // Notify trader webhook if set
    if (order.traderWebhook) {
      try {
        await axios.post(order.traderWebhook, { orderId: order.orderId, status: "shipped", order });
      } catch (e) {
        console.error("Webhook notify failed:", e.message);
      }
    }

    res.json({ ok: true, order });
  } catch (err) {
    console.error("Ship order error:", err.message || err);
    res.status(500).json({ message: "Could not update shipment status" });
  }
});


// Mark order as delivered
app.post("/api/orders/:id/deliver", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "delivered";
    await order.save();
    try{ emitOrderUpdate(order); }catch(e){}


    // Send SMS to customer
    await sendSms(
      order.customer.phone,
      `Hi ${order.customer.name}, your order ${order.orderId} has been delivered. Thank you for shopping with FarmCap!`
    );

    // Notify trader webhook if set
    if (order.traderWebhook) {
      try {
        await axios.post(order.traderWebhook, {
          orderId: order.orderId,
          status: "delivered",
          order,
        });
      } catch (e) {
        console.error("Webhook notify failed:", e.message);
      }
    }

    res.json({ ok: true, order });
  } catch (err) {
    console.error("Deliver order error:", err.message || err);
    res.status(500).json({ message: "Could not update delivery status" });
  }
});


// Public route: Get order status by ID
app.get("/api/orders/:id/status", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({
      orderId: order.orderId,
      status: order.status,
      placedAt: order.createdAt,
    });
  } catch (err) {
    console.error("Get order status error:", err.message || err);
    res.status(500).json({ message: "Could not fetch order status" });
  }
});

const PORT = process.env.PORT || 4000;

/* SOCKET.IO SETUP */
const http = require('http');
const serverHttp = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(serverHttp, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('a client connected', socket.id);
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId);
  });
});

function emitOrderUpdate(order) {
  try {
    io.to(order.orderId).emit('order.updated', { orderId: order.orderId, status: order.status, order });
  } catch(e){ console.warn('emit error', e.message); }
}

serverHttp.listen(PORT, () => console.log('Server running on port', PORT));
