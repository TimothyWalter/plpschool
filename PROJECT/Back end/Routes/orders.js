
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Mock in-memory orders
let orders = [];

// Twilio + SendGrid setup
const twilio = require("twilio");
const sgMail = require("@sendgrid/mail");

const TWILIO_SID = process.env.TWILIO_SID || "your_twilio_sid";
const TWILIO_AUTH = process.env.TWILIO_AUTH || "your_twilio_auth";
const TWILIO_PHONE = process.env.TWILIO_PHONE || "+1234567890";
const SENDGRID_KEY = process.env.SENDGRID_KEY || "your_sendgrid_key";
const FROM_EMAIL = process.env.FROM_EMAIL || "you@example.com";

const client = twilio(TWILIO_SID, TWILIO_AUTH);
sgMail.setApiKey(SENDGRID_KEY);

// GET /api/orders
router.get("/", verifyToken, verifyTrader, async (req, res) => {
  res.json(orders);
});

// POST /api/orders
router.post("/", verifyToken, verifyTrader, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = {
      _id: String(orders.length + 1),
      items,
      status: "Pending",
      total,
      user: { email: req.user.email || "customer@example.com", phone: req.user.phone || "+2547XXXXXXXX" }
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// POST /api/orders/:id/pay
router.post("/:id/pay", verifyToken, verifyTrader, async (req, res) => {
  try {
    const order = orders.find((o) => o._id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = "Paid";

    // Send SMS via Twilio
    try {
      await client.messages.create({
        body: `✅ Payment confirmed for Order #${order._id}. Total: KES ${order.total}.`,
        from: TWILIO_PHONE,
        to: order.user.phone
      });
      console.log("📩 SMS sent to", order.user.phone);
    } catch (smsErr) {
      console.error("Failed to send SMS:", smsErr.message);
    }

    // Send Email via SendGrid
    try {
      const msg = {
        to: order.user.email,
        from: FROM_EMAIL,
        subject: `Payment Confirmation for Order #${order._id}`,
        text: `Your payment for Order #${order._id} has been confirmed. Total: KES ${order.total}.`,
        html: `<strong>Payment confirmed</strong> for Order #${order._id}.<br/>Total: KES ${order.total}.<br/>Thank you for shopping with us!`,
      };
      await sgMail.send(msg);
      console.log("📧 Email sent to", order.user.email);
    } catch (mailErr) {
      console.error("Failed to send email:", mailErr.message);
    }

    res.json({ message: "Payment confirmed with SMS + Email", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to confirm payment" });
  }
});

module.exports = router;



// PATCH /api/orders/:id/status -> update order status
router.patch("/:id/status", verifyToken, verifyTrader, async (req, res) => {
  try {
    const { status } = req.body;
    const order = orders.find((o) => o._id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// POST /api/orders/:id/resend -> resend SMS + Email confirmation
router.post("/:id/resend", verifyToken, verifyTrader, async (req, res) => {
  try {
    const order = orders.find((o) => o._id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    try {
      // Simulate SMS + Email resend
      console.log(`🔄 Resending confirmation for Order #${order._id}`);
    } catch (err) {
      console.error("Resend error:", err.message);
    }

    res.json({ message: "Confirmation resent", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to resend confirmation" });
  }
});
