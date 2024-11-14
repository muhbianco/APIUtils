#!/bin/sh
docker builder prune -f
docker build --build-arg ENV_FILE=".env" -t api_etl:latest .
