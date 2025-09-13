FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app
CMD ["python", "-m", "http.server", "8000"]
