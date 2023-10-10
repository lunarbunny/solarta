pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "solarta-api:latest"
        WORKDIR = "${WORKSPACE}/server"
        DOCKERFILE = "${WORKSPACE}/server/Dockerfile"
    }

    stages {
        stage('Build and Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com/', 'd5ae8eba-d530-4355-acf8-9543b7d35887') {
                        // Build the Docker image
                        def dockerImage = docker.build("lunarbunny/solarta-api:${BUILD_ID}", "-f ${DOCKERFILE} ${WORKDIR}")
                        // Push the Docker image to Docker Hub
                        dockerImage.push("latest")
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Success!'
        }
    }
}
