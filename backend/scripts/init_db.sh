#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Run migrations
echo "Running migrations..."
alembic upgrade head

# Seed initial data
echo "Seeding initial data..."
python -m app.services.seed

echo "Database initialization complete!"

