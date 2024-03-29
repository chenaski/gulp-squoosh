#!/bin/bash

NODE_VERSIONS=(
  "12.5.0-alpine"
  "14.0.0-alpine"
  "16.0.0-alpine"
  "18.0.0-alpine"
)
IMAGE_NAME="gulp-squoosh-node"
results=()

for version in "${NODE_VERSIONS[@]}"; do
  printf "\n\n\nrun node:%s\n\n" "$version"

  docker rmi "$IMAGE_NAME:$version"
  docker build -q -t "$IMAGE_NAME:$version" --build-arg NODE_VERSION="$version" -f test/Dockerfile .

  if docker run --rm "$IMAGE_NAME:$version"; then
    results+=("node:$version true")
  else
    results+=("node:$version false")
  fi
done

printf "\n"
printf '%s\n' "${results[@]}"
printf "\n"
