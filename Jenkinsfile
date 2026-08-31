pipeline {
    agent any

    environment {
        IMAGE_NAME = "expense-tracker"
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
        REGISTRY   = "" // e.g. "docker.io/yourusername" — leave empty to skip push
        REGISTRY_CREDENTIALS_ID = "dockerhub-credentials" // Jenkins credentials ID
        CONTAINER_NAME = "expense-tracker"
        HOST_PORT  = "8080"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                docker { image 'node:20-alpine' }
            }
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint & Build (Vite)') {
            agent {
                docker { image 'node:20-alpine' }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Push Docker Image') {
            when {
                expression { return env.REGISTRY?.trim() }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${REGISTRY_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest
                        docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${REGISTRY}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:80 \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        success {
            echo "Deployed ${IMAGE_NAME}:${IMAGE_TAG} — available on port ${HOST_PORT}"
        }
        failure {
            echo "Build failed. Check the stage logs above."
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
