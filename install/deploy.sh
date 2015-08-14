#!/bin/sh

git pull
cd ..
docker-compose build web
docker-compose -up -d web