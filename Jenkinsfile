pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "solarta-api:latest"
        WORKDIR = "${WORKSPACE}/server"
        DOCKERFILE = "${WORKSPACE}/server/Dockerfile"
    }

    stages {
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
                            -f 'ALL' 
                            --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'

                // Write report to specified file
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }
        }

        stage('Build and Push Server Docker Image') {
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
