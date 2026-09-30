#!/bin/sh
set -e

export NGINX_PORT="${NGINX_PORT:-10000}"

echo "Running migration..."

cd /app/AI
/venv/bin/python migration.py
cd /app

envsubst '${NGINX_PORT}' \
  < /etc/nginx/nginx.conf.template \
  > /etc/nginx/nginx.conf

exec supervisord -c /etc/supervisord.conf
