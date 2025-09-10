
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  items: [{ productId: String, productName: String, price: Number, quantity: Number }],
  status: { type: String, index: true, default: "Pending" }, // Pending, Paid, Shipped, Delivered
  paymentStatus: { type: String, index: true, default: "pending" }, // pending, success, failed
  transactionId: { type: String },
  total: { type: Number },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index: queries by user and status are common
OrderSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
