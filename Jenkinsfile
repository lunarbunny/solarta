pipeline {
    agent any

    environment {
        SERVER_WORKDIR = "${WORKSPACE}/server"
        CLIENT_WORKDIR = "${WORKSPACE}/frontend"
        SERVER_DOCKERFILE = "${WORKSPACE}/server/Dockerfile"
        FRONTEND_DOCKERFILE = "${WORKSPACE}/frontend/Dockerfile"
    }

    stages {
        stage('Build and Deploy Server') {
            steps {
                script {
                    // Build the Docker image
                    def dockerImage = docker.build("solarta-api:latest", "-f ${SERVER_DOCKERFILE} ${SERVER_WORKDIR}")

                    // Stop and remove existing container with same name, container name is "solarta".
                    sh 'docker stop solarta || true'
                    sh 'docker rm solarta || true'

                    // Run the newest image as a sibling container
                    withCredentials([string(credentialsId: 'c72a4d71-0a6b-42ca-9098-a01b162ed22f', variable: 'DOCKERRUNARGS')]) {
                        dockerImage.run('--name solarta $DOCKERRUNARGS')
                    }
                }
            }
        }

        // TODO: Add a stage to deploy frontend
        stage('Build and Deploy Frontend') {
            steps{
                script {
                    // Build the Docker image
                    def dockerImage = docker.build("solarta-web:latest", "-f ${FRONTEND_DOCKERFILE} ${CLIENT_WORKDIR}")

                    // Stop and remove existing container with same name, container name is "solarta-web".
                    sh 'docker stop solarta-web || true'
                    sh 'docker rm solarta-web || true'

                    // Run the newest image as a sibling container
                    dockerImage.run('-p 3000:3000 --name solarta-web')
                }
            }
        }

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
                dependencyCheckPublisher pattern: 'dependency-check-report.html'
            }
        }
    }

    post {
        success {
            echo 'Success!'
        }
        
        always {
            // Remove all intermediate images and containers
            sh 'docker system prune -f'
        }
    }
}
