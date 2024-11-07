#!/bin/sh
docker builder prune -f
docker build --build-arg APP_ENV="$1" -t utils_api:latest .
docker tag utils_api:latest muhrilobianco/api_utils:latest
if [ "$1" = "prod" ]; then
	docker login
	docker push muhrilobianco/api_utils:latest
fi
