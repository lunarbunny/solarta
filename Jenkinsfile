pipeline {
    agent any

    environment {
        SERVER_WORKDIR = "${WORKSPACE}/server"
        CLIENT_WORKDIR = "${WORKSPACE}/frontend"
        SERVER_DOCKERFILE = "${WORKSPACE}/server/Dockerfile"
        FRONTEND_DOCKERFILE = "${WORKSPACE}/frontend/Dockerfile"

        SQLALCHEMY_DATABASE_URI = credentials('6ca4fbe5-cdfb-41df-91a3-2cf743994071')
        SENDGRID_API_KEY = credentials('b7a83492-696b-4c37-8b31-3f1d469dd2f7')
        URL_SIGN_SECRET = credentials('a0a605eb-9890-48b8-9e9a-affe921ce9cc')
        ONBOARDING_SALT = credentials('e886f93b-8132-445e-b44f-52c8ff540637')
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
                    dockerImage.run('''
                        --name solarta
                        --network solarta --ip 172.19.0.2 --publish 5000:5000
                        --env SQLALCHEMY_DATABASE_URI=$SQLALCHEMY_DATABASE_URI
                        --env SENDGRID_API_KEY=$SENDGRID_API_KEY
                        --env URL_SIGN_SECRET=$URL_SIGN_SECRET
                        --env ONBOARDING_SALT=$ONBOARDING_SALT
                        --volume /var/lib/solarta/keys:/creds
                        --volume /var/lib/solarta/assets/music:/assets/music
                    '''
                    )
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
                    dockerImage.run('--name solarta-web -p 3000:3000')
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
