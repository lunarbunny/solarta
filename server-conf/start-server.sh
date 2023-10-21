#!/bin/bash

# Using IP for container-container comms is optional, for now it is just using the hostname.
docker network create --subnet=172.19.0.0/24 --gateway=172.19.0.254 solarta

# MariaDB Server
# Change the username/password out for the real one before running.
docker run -d --name mariadb --network solarta --ip 172.19.0.1 -p 3306:3306 \
  --env MARIADB_USER=user --env MARIADB_PASSWORD=pass \
  --env MARIADB_ROOT_PASSWORD=root \
  --env MARIADB_DATABASE=solarta \
  --volume /var/lib/mysql:/var/lib/mysql \
  mariadb:latest

# Solarta API
# Change the envs out for the real one before running.
docker run -d --name solarta --network solarta --ip 172.19.0.2 -p 5000:5000 \
  --env SQLALCHEMY_DATABASE_URI=mysql+pymysql://user:pass@mariadb:3306/solarta \
  --env SENDGRID_API_KEY=replace_this \
  --env URL_SIGN_SECRET=replace_this \
  --env ONBOARDING_SALT=replace_this \
  --volume /var/lib/solarta/keys:/creds \
  --volume /var/lib/solarta/assets/music:/assets/music \
  solarta-api:latest

# Frontend server
docker run -d --name solarta-web -p 3000:3000 solarta-web:latest
