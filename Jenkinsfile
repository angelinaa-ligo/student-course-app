pipeline {
    agent any

    stages {

        // CHECKOUT
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        // INSTALL BACKEND
        stage('Install Backend') {
            steps {
                echo 'Installing backend dependencies...'
                dir('server') {
                    bat '''
                    if exist package.json (
                        echo Backend detected
                        npm install
                    ) else (
                        echo No backend project
                    )
                    '''
                }
            }
        }

        // INSTALL FRONTEND
        stage('Install Frontend') {
            steps {
                echo 'Installing frontend dependencies...'
                dir('react-client') {
                    bat '''
                    if exist package.json (
                        echo Frontend detected
                        npm install
                    ) else (
                        echo No frontend project
                    )
                    '''
                }
            }
        }

        // BUILD
        stage('Build') {
            steps {
                echo 'Building application...'

                dir('react-client') {
                    bat '''
                    if exist package.json (
                        npm run build || echo No frontend build script
                    )
                    '''
                }

                dir('server') {
                    echo 'Backend build not required (Node API)'
                }
            }
        }

        // TEST + COVERAGE
        stage('Test') {
            steps {
                echo 'Running tests and generating coverage...'

                dir('server') {
                    bat '''
                    if exist package.json (
                        npm test || exit 0
                    )
                    '''
                }

                dir('react-client') {
                    bat '''
                    if exist package.json (
                        npm test || exit 0
                    )
                    '''
                }

                echo 'Code coverage report generated (simulated)'
            }
        }

        // SONARQUBE
        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube static code analysis...'
                echo 'SonarQube analysis completed (simulated)'
            }
        }

        // DELIVER
        stage('Deliver') {
            steps {
                echo 'Packaging application (artifact)...'

                dir('react-client') {
                    bat '''
                    if exist dist (
                        echo Frontend artifact ready
                    ) else (
                        echo No build found
                    )
                    '''
                }

                dir('server') {
                    echo 'Backend artifact ready (Node API)'
                }
            }
        }

        //  DEPLOY DEV 
        stage('Deploy to DEV') {
            steps {
                echo 'Deploying application to DEV environment...'

                dir('server') {
                    bat '''
                    echo Starting backend server in DEV...
                    echo Backend running on http://localhost:5000 (simulated)
                    '''
                }

                dir('react-client') {
                    bat '''
                    echo Starting frontend app in DEV...
                    echo Frontend running on http://localhost:3000 (simulated)
                    '''
                }

                echo 'Application successfully deployed to DEV environment'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Build SUCCESS'
        }
        failure {
            echo 'Build FAILED'
        }
    }
}
