pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                echo 'Telechargement du code source...'
                // git 'URL_DYAL_GITHUB_DYALK'
            }
        }
        stage('Build Backend') {
            steps {
                dir('2_backend') {
                    sh 'docker build -t supply-backend .'
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('3_frontend') {
                    sh 'docker build -t supply-frontend .'
                }
            }
        }
        stage('Deploy (Docker Compose)') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}