pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t expense-tracker .'
            }
        }

        stage('Stop Old Container') {
            steps {
                bat 'docker rm -f expense-tracker 2>NUL || exit /b 0'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d -p 8081:80 --name expense-tracker expense-tracker'
            }
        }
    }

    post {
        success {
            echo 'Expense Tracker deployed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}