#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
while ! nc -z pg_db 5432; do
  sleep 1
done
echo "PostgreSQL is up - executing command"

echo "Running database migrations..."
npm run migration:run

echo "Migrations complete."

exec "$@"
