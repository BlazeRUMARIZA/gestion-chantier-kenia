#!/bin/bash
set -e

echo "🔄 Running database migrations..."
node_modules/.bin/sequelize-cli db:migrate
echo "✅ Migrations completed successfully!"
