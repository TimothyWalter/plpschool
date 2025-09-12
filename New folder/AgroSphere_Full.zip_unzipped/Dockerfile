
FROM python:3.11-slim
WORKDIR /code
COPY backend/requirements.txt /code/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY backend /code
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "agrosphere.asgi:application"]
