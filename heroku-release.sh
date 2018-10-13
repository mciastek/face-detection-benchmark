#!/bin/sh
set -e

docker push registry.heroku.com/$APP_NAME/web

DOCKER_IMG_ID="$(docker inspect --format={{.Id}} registry.heroku.com/$APP_NAME/web)"

curl -n -f -X PATCH https://api.heroku.com/apps/$APP_NAME/formation \
  -d '{ "updates": [ { "type": "web", "docker_image": "'"$DOCKER_IMG_ID"'" } ]}' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HEROKU_TOKEN" \
  -H "Accept: application/vnd.heroku+json; version=3.docker-releases"
