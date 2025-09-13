
AgroSphere Full Package (optimized for local + deploy)
-----------------------------------------------------
Unzip and open frontend/index.html for a quick UI preview.
Use backend/requirements.txt to set up Django if you want the backend skeleton.
Payments are templated in backend/payments/*.py - add credentials and secure callbacks before enabling.

Local frontend preview:
- Open frontend/index.html in browser or use VS Code Live Server.

Docker quick preview (serves files via simple server in container):
- docker build -t agrosphere .
- docker-compose up --build
