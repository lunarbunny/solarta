FROM python:3.12-slim-bookworm

WORKDIR /app
COPY app/ /app

ENV MUSIC_ASSET_DIR /assets/music

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* && \
    pip install -r requirements.txt && \
    useradd -m -g users api

USER api

EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=3s \
    CMD curl --fail http://localhost:5000 || exit 1

CMD ["waitress-serve", "--host=0.0.0.0", "--port=5000", "main:app"]
