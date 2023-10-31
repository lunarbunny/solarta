#!/bin/bash

# Jenkins using docker.sock
docker run --name jenkins --restart=on-failure --detach \
  --network jenkins \
  --env JENKINS_OPTS="--prefix=/jenkins" \
  --publish 8080:8080 \
  --volume jenkins-data:/var/jenkins_home \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  jenkins-blueocean:lts-jdk17
