FROM python:3.8-slim-buster

WORKDIR /app
COPY app/ /app

# Install deps
RUN pip install -r requirements.txt

# Port 5000
EXPOSE 5000

CMD ["python3", "main.py"]
