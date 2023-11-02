FROM python:3.12-bookworm

WORKDIR /app
COPY app/ /app

ENV MUSIC_ASSET_DIR /assets/music

RUN pip install -r requirements.txt && \
    useradd -m -g users api

USER api

EXPOSE 5000

CMD ["waitress-serve", "--host=0.0.0.0", "--port=5000", "main:app"]
