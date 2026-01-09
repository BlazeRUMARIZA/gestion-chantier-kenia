#!/bin/bash
set -e

echo "🔄 Running database migrations..."
# Use npx instead of direct path to avoid permission issues
npx sequelize-cli db:migrate
echo "✅ Migrations completed successfully!"