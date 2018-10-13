#!/bin/bash
set -e

docker-compose -f docker-compose.yml stop -t 1 "$@"
