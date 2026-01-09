#!/bin/bash
set -e

echo "🔄 Running database migrations..."
# Use node to execute sequelize CLI directly
node node_modules/.bin/sequelize-cli db:migrate
echo "✅ Migrations completed successfully!"