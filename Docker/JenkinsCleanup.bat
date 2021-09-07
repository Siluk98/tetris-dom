docker stop jenkins-docker
docker stop jenkins-blueocean
docker image rm docker:dind
docker image rm myjenkins-blueocean:1.1
docker volume rm jenkins-data
docker volume rm jenkins-docker-certs
docker network rm jenkins