
# FarmCap – Database Deployment Guide

This project has **two separate versions** so you can test and decide which backend database fits your needs:  
- **farmcap-mongodb.zip** → MongoDB version  
- **farmcap-postgres.zip** → PostgreSQL version  

---

## 🔹 MongoDB Version
### Best for:
- Projects that need **fast prototyping** and flexibility.  
- Handling **unstructured or semi-structured data** (farm products may vary in attributes).  
- Developers who prefer **document-based storage** (JSON-like).  

### Pros:
- **Schema-less** (easy to evolve product structure).  
- **Faster to get started** — just run `seed.js` to create sample data.  
- Great with **real-time apps** (Socket.IO + Mongo works smoothly).  
- Easier scaling horizontally with sharding.  

### Cons:
- Less strict about **data consistency**.  
- Transactions are possible, but **relational joins** are harder.  

### How to run:
1. Extract `farmcap-mongodb.zip`  
2. Run:  
   ```bash
   docker-compose up --build
   ```  
3. Seed demo data:  
   ```bash
   docker exec -it farmcap-backend node seed.js
   ```  
4. Use `farmcap-api.postman_collection.json` to test login, orders, and webhook.  

---

## 🔹 PostgreSQL Version
### Best for:
- Projects needing **high data consistency** (e.g. payments, shipments).  
- Handling **complex relationships** (farmers ↔ traders ↔ industries).  
- Situations where **reporting/analytics** will matter (Postgres SQL queries are very powerful).  

### Pros:
- Strong **ACID transactions** (safer for payments).  
- Supports **complex queries** (joins, aggregations, indexing).  
- Widely used in fintech, e-commerce, and government projects.  

### Cons:
- **More setup effort** (need migrations).  
- Less flexible with **changing schemas** (you must update tables).  

### How to run:
1. Extract `farmcap-postgres.zip`  
2. Run:  
   ```bash
   docker-compose up --build
   ```  
3. Apply migrations and seed:  
   ```bash
   docker exec -it farmcap-postgres psql -U postgres -d farmcap -f /docker-entrypoint-initdb.d/migrations.sql
   docker exec -it farmcap-postgres psql -U postgres -d farmcap -f /docker-entrypoint-initdb.d/seed.sql
   ```  
4. Use `farmcap-api-postgres.postman_collection.json` to test API and webhook.  

---

## ⚡ Recommendation
- Start with **MongoDB** if you want to **prototype fast**, test features, and onboard users quickly.  
- Use **PostgreSQL** if you’re focusing on **long-term scalability**, strict **financial records**, and **analytics**.  

👉 You can even start with MongoDB, then migrate to PostgreSQL later as your system grows.

---

📌 Both versions already include:  
- **Authentication** (JWT)  
- **Cart & Orders** with automatic total calculation  
- **Payment webhooks** (placeholders for MPESA, Airtel, PayPal, Banks)  
- **Real-time notifications** via Socket.IO  
- **Customer service contact form** (email + phone)  
