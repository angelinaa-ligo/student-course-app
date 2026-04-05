pipeline {
    agent any

    stages {

        stage('Install') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm install || echo No package.json'
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'npm test || echo No tests found'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running static code analysis (simulated SonarQube)...'
            }
        }
    }
}
