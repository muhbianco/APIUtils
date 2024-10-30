#!/bin/sh
docker builder prune -f
docker build -t utils_api:latest .
docker tag utils_api:latest muhrilobianco/api_utils:latest
docker login
docker push muhrilobianco/api_utils:latest
