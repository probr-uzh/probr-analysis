#!/bin/sh

docker build -t probr_analysis .
docker stop probr_analysis
docker rm probr_analysis
docker run -d --expose 8080 --name probr_analysis --link mongodb:mongodb --link redis:redis probr_analysis sh app/install/docker/node/run.sh

docker stop nginx
docker rm nginx
docker run -d -p 80:80 --name nginx --volumes-from probr_core --link probr_core:probr_core --link probr_core_ws:probr_core_ws --link probr_analysis:probr_analysis nginx
