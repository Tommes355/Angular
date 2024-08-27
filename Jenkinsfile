pipeline {
    agent {
        docker {
            image 'node:14' // Verwenden eines Docker-Images mit Node.js
            args '-v /root/.npm:/root/.npm' // Optional: Cache für npm
        }
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/your-repo/your-angular-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'ng build --prod'
            }
        }

        stage('Test') {
            steps {
                sh 'ng test --watch=false'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Docker-basiertes Deployment oder ein Skript verwenden
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
        }
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build or deployment failed!'
        }
    }
}
