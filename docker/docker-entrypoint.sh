#!/bin/sh
export JSON_STRING='window.configs = { \
  // empty \
}'
sed "s|\/\/ CONFIGURATIONS_PLACEHOLDER|${JSON_STRING}|" /usr/share/nginx/html/commerce-webapp/index.html.tmpl > /tmp/index.html

exec "$@"
