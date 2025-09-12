
-- demo seed data for postgres
INSERT INTO orders (user_id, items, status, payment_status, total) VALUES
(NULL, '[{"productName":"Maize","price":200,"quantity":3}]', 'Pending', 'pending', 600),
(NULL, '[{"productName":"Fertilizer","price":500,"quantity":1}]', 'Paid', 'success', 500);
