#!/bin/bash

# Using IP for container-container comms is optional, for now it is just using the hostname.
docker network create --subnet=172.19.0.0/24 --gateway=172.19.0.254 solarta

# Change the username/password out for the real one before running.
docker run -d --network solarta --ip 172.19.0.1 -p 3306:3306 \
  --env MARIADB_USER=user --env MARIADB_PASSWORD=pass \
  --env MARIADB_ROOT_PASSWORD=root \
  --env MARIADB_DATABASE=solarta \
  --volume /var/lib/mysql:/var/lib/mysql \
  --name mariadb mariadb:latest

# SQLAlchemy Format: "mysql+pymysql://<username>:<password>@<host>/<db>"
docker run -d --network solarta --ip 172.19.0.2 -p 5000:5000 \
  --env SQLALCHEMY_DATABASE_URI="mysql+pymysql://user:pass@mariadb:3306/solarta" \
  --env GOOGLE_APPLICATION_CREDENTIALS="/creds/serviceAccountKey.json" \
  --volume ~/keys:/creds \
  --name solarta solarta-api:latest
