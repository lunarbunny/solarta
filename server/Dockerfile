FROM python:3.8-slim-buster

WORKDIR /app
COPY app/ /app

RUN pip install -r requirements.txt

EXPOSE 5000

ENV GOOGLE_APPLICATION_CREDENTIALS "/creds/serviceAccountKey.json"
ENV MUSIC_ASSET_DIR "/assets/music"

CMD ["python3", "main.py"]
