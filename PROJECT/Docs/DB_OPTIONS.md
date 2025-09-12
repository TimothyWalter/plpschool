
Database options and indexing:

This project defaults to MongoDB with Mongoose. Order model includes indexes for:
 - userId, status, paymentStatus, createdAt
 - compound index { userId: 1, status: 1 }

If you prefer PostgreSQL, create equivalent indexes in SQL, for example:
CREATE INDEX idx_orders_userid_status ON orders (user_id, status);
CREATE INDEX idx_orders_created_at ON orders (created_at);

The webhook route is implemented at /api/webhooks/payment and expects POST requests
from payment providers with JSON: { provider, transactionId, status, orderId }.
