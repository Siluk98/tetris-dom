#!/bin/bash
docker container stop ngrok_tetris
docker container rm ngrok_tetris
docker network rm ngrok-network-tetris
docker network create -d bridge ngrok-network-tetris
docker network connect ngrok-network-tetris tetris-deploy
docker container run -d -p 4041:4040  --network ngrok-network-tetris --name ngrok_tetris wernight/ngrok ngrok http tetris-deploy:3000