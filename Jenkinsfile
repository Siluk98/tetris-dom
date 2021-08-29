pipeline {
    agent any
	
	environment {
		DISCORD = 'discordSend description: "Jenkins Pipeline Build", footer: "Footer Text", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/881624706472628284/2LgikDidYeYdUA7eBCInyQnvUFzm4FA6TVXux0Nvr1vjl4EzvBbnpcG-FzEvBXXW4tdl"'
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
			discordSend description: "Pipeline completed", footer: "Pipeline completed", result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/881624706472628284/2LgikDidYeYdUA7eBCInyQnvUFzm4FA6TVXux0Nvr1vjl4EzvBbnpcG-FzEvBXXW4tdl"
		}
		failure {
			echo 'Pipeline failed'
			script {
			def log = Jenkins.getInstance()
                .getItemByFullName(env.JOB_NAME)
                .getBuildByNumber(
                    Integer.parseInt(env.BUILD_NUMBER))
                .logFile.text
				
				def log2 = sh (returnStdout: true, script: 'curl ${BUILD_URL}/consoleText')
				
				discordSend description: log2, footer: "Pipeline failed", result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/881624706472628284/2LgikDidYeYdUA7eBCInyQnvUFzm4FA6TVXux0Nvr1vjl4EzvBbnpcG-FzEvBXXW4tdl"
			}
			
		}
	}
}