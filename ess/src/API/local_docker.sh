#!/bin/bash

if [ -z "$1" ]; 
then
  echo "Usage: $0 <podman or docker>"
  echo "eg: ./local_docker podman"
fi
if [ "$1" = "podman" ]; 
then
  echo "------------Starting the build process------------"
  podman build -t=ess-backend --no-cache --build-context shared=../../../shared/src .
  echo "------------Starting the Container------------"
  podman run --log-level=debug --env-file=../../../.env ess-backend
fi
if [ "$1" = "docker" ];
then
  echo "------------Starting the build process------------"
  docker build -t ess-backend --no-cache --progress=plain --build-context shared=../../../shared/src .
  echo "------------Starting the Container------------"
  docker run --env-file ../../../.env ess-backend
fi 

