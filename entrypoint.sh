#!/bin/sh
echo "172.17.0.1 mariadb" >> /etc/hosts
cd /usr/src/environments/utils_api
fastapi run
