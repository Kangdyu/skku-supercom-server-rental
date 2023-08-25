#!/bin/bash

IS_DB_UP=$(sudo docker ps | grep serv-rent-postgres-dev)

sudo docker compose -f docker/development/docker-compose.yml up -d --build

# 새로 생성된 DB 컨테이너의 경우 prisma schema를 이용해 DB를 구성해주어야 함
if [ ! "$IS_DB_UP" ]; then
  echo "setup db with prisma"
  pnpm dotenv -e .env.local prisma db push
fi