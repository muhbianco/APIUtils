#!/bin/sh
docker builder prune -f
if [ "$1" = "prod" ]; then
  ENV_FILE=".env.prod"
else
  ENV_FILE=".env.dev"
fi
docker build --build-arg ENV_FILE=$ENV_FILE -t utils_api:latest .
docker tag utils_api:latest muhrilobianco/api_utils:latest
if [ "$1" = "prod" ]; then
	docker login
	docker push muhrilobianco/api_utils:latest
fi
