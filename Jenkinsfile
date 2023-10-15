pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "solarta-api:latest"
        WORKDIR = "${WORKSPACE}/server"
        DOCKERFILE = "${WORKSPACE}/server/Dockerfile"
    }

    stages {
        stage('Build and Deploy Server Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    def dockerImage = docker.build("lunarbunny/solarta-api:${BUILD_ID}", "-f ${DOCKERFILE} ${WORKDIR}")

                    // Stop and remove existing container with same name, container name is "solarta".
                    sh 'docker stop solarta || true'
                    sh 'docker rm solarta || true'

                    // Run the newest image as a sibling container
                    withCredentials([string(credentialsId: 'c72a4d71-0a6b-42ca-9098-a01b162ed22f', variable: 'DOCKERRUNARGS')]) {
                        dockerImage.run('$DOCKERRUNARGS')
                    }
                }
            }
        }

        // TODO: Add a stage to deploy frontend

        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                // Install deps first
                nodejs(nodeJSInstallationName: 'NodeJS 20') {
                    sh 'npm install --prefix ./frontend'
                }

                // Run OWASP Dependency-Check
                // https://jeremylong.github.io/DependencyCheck/dependency-check-cli/arguments.html
                dependencyCheck additionalArguments: ''' 
                            -o './'
                            -s './frontend'
                            -f 'HTML' 
                            ''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'

                // Write report to specified file
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }
        }
    }

    post {
        success {
            echo 'Success!'
        }
    }
}
