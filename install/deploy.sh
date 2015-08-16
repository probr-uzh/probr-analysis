#!/bin/sh

git pull
docker-compose build web
docker-compose up -d web