
FarmCap (Postgres) - Demo Package
===============================

This package is a demo-ready version of FarmCap using PostgreSQL.
Folder structure: (frontend + backend + docker-compose.yml)

Quick start (requires Docker):
1. Copy this folder to your machine.
2. Ensure ports 3001, 5001 and 5432 are free.
3. Run: docker-compose up --build
4. Backend will be available at http://localhost:5001 and frontend at http://localhost:3001
5. To run migrations and seed data, exec into the postgres container and run the SQL scripts:
   docker exec -it <postgres_container> psql -U postgres -d farmcap -f /usr/src/app/backend/db/migrations.sql
   docker exec -it <postgres_container> psql -U postgres -d farmcap -f /usr/src/app/backend/db/seed.sql
6. Use the included Postman collection 'farmcap-api-postgres.postman_collection.json' to test endpoints (create order, webhook test).

Notes:
- Webhook endpoint: POST /api/webhooks/payment
- Replace placeholder credentials in .env before connecting to payment providers.
- For local testing of webhooks, use a tool like ngrok to expose your localhost and set that URL in provider dashboards.
