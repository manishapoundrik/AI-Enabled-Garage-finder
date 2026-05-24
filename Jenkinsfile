pipeline {
    agent any

    environment {
        IMAGE_NAME = "manishapoundrik/garage-finder-app:v1"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                url: 'https://github.com/manishapoundrik/AI-Enabled-Garage-finder.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push %IMAGE_NAME%'
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
            }
        }
    }
}