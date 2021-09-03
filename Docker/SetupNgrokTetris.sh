#!/bin/bash
docker network create -d bridge ngrok-network
docker network connect ngrok-network tetris-deploy
docker container run -d -p 4041:4040  --network ngrok-network --name ngrok_tetris wernight/ngrok ngrok http tetris-deploy:3000