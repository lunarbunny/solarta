#!/bin/bash
docker run --name jenkins --restart=on-failure --detach \
  --network jenkins \
  --env DOCKER_HOST=tcp://docker:2376 \
  --env JENKINS_OPTS="--prefix=/jenkins" \
  --publish 8080:8080 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  jenkins-blueocean:2.414.2-1
