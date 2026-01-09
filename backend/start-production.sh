#!/bin/bash
# Script de démarrage pour production (Render)
# Exécute les migrations puis démarre le serveur

set -e  # Arrête si une commande échoue

echo "🔄 Exécution des migrations..."
npx sequelize-cli db:migrate

echo "✅ Migrations terminées"
echo "🚀 Démarrage du serveur..."
node server.js
