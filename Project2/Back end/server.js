
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000' } });
const { Pool } = require('pg');

app.use(express.json());
app.set('io', io);

// Postgres pool
const pool = new Pool({ connectionString: process.env.POSTGRES_URI || 'postgresql://postgres:postgres@postgres:5432/farmcap' });

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId);
  });
});

// Basic orders endpoints using SQL
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items } = req.body;
    const total = items.reduce((s,i)=>s + (i.price * i.quantity), 0);
    const insert = await pool.query(
      'INSERT INTO orders(user_id, items, status, payment_status, transaction_id, total) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [null, JSON.stringify(items), 'Pending', 'pending', null, total]
    );
    const order = insert.rows[0];
    // emit event
    io.emit('order.created', { orderId: order.id, order });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// webhook endpoint to update payment status (provider posts here)
app.post('/api/webhooks/payment', async (req, res) => {
  try {
    const { provider, transactionId, status, orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' });
    const paymentStatus = status === 'success' ? 'success' : 'failed';
    const newStatus = status === 'success' ? 'Paid' : null;
    await pool.query('UPDATE orders SET payment_status=$1, transaction_id=$2, status=COALESCE($3,status), updated_at=NOW() WHERE id=$4', [paymentStatus, transactionId || null, newStatus, orderId]);
    const result = await pool.query('SELECT * FROM orders WHERE id=$1', [orderId]);
    const order = result.rows[0];
    // emit socket events
    io.to(String(orderId)).emit('paymentUpdate', { orderId: String(order.id), status: order.payment_status });
    io.emit('order.updated', { orderId: String(order.id), status: order.status, order });
    res.json({ message: 'Webhook processed', orderId });
  } catch (err) {
    console.error('Webhook processing error', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server running on port', PORT));
