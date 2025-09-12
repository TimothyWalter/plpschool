
FarmCap (MongoDB) - Demo Package
===============================

This package is a demo-ready version of FarmCap using MongoDB.
Folder structure: (frontend + backend + docker-compose.yml)

Quick start (requires Docker):
1. Copy this folder to your machine.
2. Create a .env file in the backend folder with required variables (JWT_SECRET, TWILIO, SENDGRID keys etc.)
3. Run: docker-compose up --build
4. Backend will be available at http://localhost:5000 and frontend at http://localhost:3000
5. To seed demo data (after backend has started), exec into the backend container or run locally:
   node backend/seed.js
6. Use the included Postman collection 'farmcap-api.postman_collection.json' to test endpoints (signup, login, create order, webhook).

Notes:
- Webhook endpoint: POST /api/webhooks/payment
- Replace placeholder credentials in .env before connecting to payment providers.
- For local testing of webhooks, use a tool like ngrok to expose your localhost and set that URL in provider dashboards.
