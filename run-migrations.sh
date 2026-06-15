#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Running Database Migrations ==="
php artisan migrate --force

echo "=== Running Database Seeders ==="
php artisan db:seed --force

echo "=== Migration & Seeding complete ==="
