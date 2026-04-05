pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
            }
        }

        stage('Install (Build Tool Check)') {
            steps {
                echo 'Checking for build tools...'
                bat '''
                if exist package.json (
                    echo Node project detected
                    npm install
                ) else (
                    echo No Node project detected - skipping install
                )
                '''
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
                bat '''
                if exist package.json (
                    npm test
                ) else (
                    echo No tests available
                )
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running static code analysis (simulated SonarQube)...'
            }
        }
    }
}
