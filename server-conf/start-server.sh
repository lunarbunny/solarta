#!/bin/bash

# Using IP for container-container comms is optional, for now it is just using the hostname.
docker network create --subnet=172.19.0.0/24 --gateway=172.19.0.254 solarta

# Change the username/password out for the real one before running.
docker run -d --name mariadb --network solarta --ip 172.19.0.1 -p 3306:3306 \
  --env MARIADB_USER=user --env MARIADB_PASSWORD=pass \
  --env MARIADB_ROOT_PASSWORD=root \
  --env MARIADB_DATABASE=solarta \
  --volume /var/lib/mysql:/var/lib/mysql \
  mariadb:latest

# SQLAlchemy Format: "mysql+pymysql://<username>:<password>@<host>/<db>"
docker run -d --name solarta --network solarta --ip 172.19.0.2 -p 5000:5000 \
  --env SQLALCHEMY_DATABASE_URI=mysql+pymysql://user:pass@mariadb:3306/solarta \
  --volume /var/lib/solarta/keys:/creds \
  --volume /var/lib/solarta/assets/music:/assets/music \
  solarta-api:latest

# Single line version for jenkins docker run argument (omits --detach and image+container name)
--network solarta --ip 172.19.0.2 -p 5000:5000 --env SQLALCHEMY_DATABASE_URI=mysql+pymysql://user:pass@mariadb:3306/solarta --volume /var/lib/solarta/keys:/creds --volume /var/lib/solarta/assets/music:/assets/music
