pipeline {
    agent any
	
	environment {
		DISCORD = 'discordSend description: "Jenkins Pipeline Build", footer: "Footer Text", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "Webhook URL"'
	}
	
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
				git url: 'https://github.com/Siluk98/tetris-dom.git'
				dir('Docker')
				{
					sh 'docker-compose up build-agent'
				}
            }
			post
			{
				failure
				{
					echo 'Build failed'
				}
				success
				{
					echo 'Build completed'
				}
			}
		}
		stage('Test') {
			steps {
				echo 'Testing...'
				git url: 'https://github.com/Siluk98/tetris-dom.git'
				dir('Docker')
				{
					sh 'docker-compose up test-agent'
				}
			}
			post {
				failure {
					echo 'Tests failed'
				}
				success {
					echo 'Tests completed'
					
				}
			}
		}
		stage('Deploy') {
			steps {
				echo 'Deploying...'
				echo 'Not implemented'
			}
			post {
				failure {
					echo 'Tests failed'
				}
				success {
					echo 'Tests completed'
					
				}
			}
		}
    }
	post {
		success {
			echo 'Pipeline completed'
			${DISCORD}
		}
		failure {
			echo 'Pipeline failed'
			${DISCORD}
		}
	}
}