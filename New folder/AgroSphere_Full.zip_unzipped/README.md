
AgroSphere Full Demo Package

Frontend: open frontend/index.html for the static demo (auto-login to buyer).
Backend: Django skeleton under /backend. To run backend locally:
1. cd backend
2. python -m venv .venv
3. source .venv/bin/activate  # Windows: .\.venv\Scripts\activate
4. pip install -r requirements.txt
5. python manage.py migrate
6. python manage.py runserver

Docker:
1. Copy .env.example to .env and fill in values.
2. docker-compose up --build
