FROM python:3.11-bullseye

WORKDIR /app
COPY app/ /app

RUN pip install -r requirements.txt

EXPOSE 5000

ENV GOOGLE_APPLICATION_CREDENTIALS "/creds/serviceAccountKey.json"
ENV MUSIC_ASSET_DIR "/assets/music"

CMD ["python3", "main.py"]
