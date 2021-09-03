pipeline {
    agent any
	
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
				git url: 'https://github.com/Siluk98/tetris-dom.git'
				dir('Docker')
				{
					sh 'docker-compose up deploy-agent'
					sh "chmod +x -R ${env.WORKSPACE}"
					sh './SetupNgrokTetris.sh'
					sh ( script: 'curl $(docker port ngrok_tetris 4041)/api/tunnels', returnStdout: true)
				}
			}
			post {
				failure {
					echo 'Deployment failed'
				}
				success {
					echo 'Deployment completed'
					
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
			sh('sed -i -r -e "s/.*?//g" $JENKINS_HOME/jobs/$JOB_NAME/builds/$BUILD_NUMBER/log')
			script {
				
				def log2 = sh (returnStdout: true, script: 'cat $JENKINS_HOME/jobs/$JOB_NAME/builds/$BUILD_NUMBER/log | tail -c 2048')
				
				
				discordSend description: log2, footer: "Pipeline failed", result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/881624706472628284/2LgikDidYeYdUA7eBCInyQnvUFzm4FA6TVXux0Nvr1vjl4EzvBbnpcG-FzEvBXXW4tdl"
			}
			
		}
	}
}