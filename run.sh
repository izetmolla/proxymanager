#!/bin/sh


docker build -t izetmolla/proxymanager:latest .
docker push izetmolla/proxymanager:latest

docker run -it -p 80:80 -p 443:443 -p 81:81 izetmolla/proxymanager:latest