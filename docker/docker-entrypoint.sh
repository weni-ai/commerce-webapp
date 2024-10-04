#!/bin/sh
export JSON_STRING='var configs = { \
  "SENTRY_DSN":"'${SENTRY_DSN}'", \
  "API_BASE_URL":"'${API_BASE_URL}'", \
}'
sed "s|\/\/ CONFIGURATIONS_PLACEHOLDER|${JSON_STRING}|" /usr/share/nginx/html/commerce-webapp/index.html.tmpl > /tmp/index.html

exec "$@"
