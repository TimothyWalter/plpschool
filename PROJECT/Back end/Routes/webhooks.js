
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// This endpoint receives payment provider webhooks (Daraja, Airtel, PayPal, Banks)
// Providers should call POST /api/webhooks/payment with JSON:
// { provider: "mpesa|airtel|paypal|bank", transactionId, status: "success|failed", orderId }
router.post('/payment', async (req, res) => {
  try {
    const { provider, transactionId, status, orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' });

    // Update order in DB
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.paymentStatus = status === 'success' ? 'success' : 'failed';
    order.transactionId = transactionId || order.transactionId;
    if (status === 'success') order.status = 'Paid';
    order.updatedAt = new Date();
    await order.save();

    // Emit real-time update via socket.io if available
    try {
      const io = req.app.get('io');
      if (io) {
        io.to(String(orderId)).emit('paymentUpdate', { orderId, status: order.paymentStatus });
        io.emit('order.updated', { orderId: String(order._id), status: order.status, order });
      }
    } catch (e) {
      console.warn('Socket emit failed', e.message);
    }

    return res.json({ message: 'Webhook processed', orderId });
  } catch (err) {
    console.error('Webhook processing error', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
