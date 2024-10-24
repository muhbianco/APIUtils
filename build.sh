#!/bin/sh
docker builder prune -f
docker build -t utils_api:latest .
