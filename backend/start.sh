#!/bin/bash

# Script de démarrage pour Railway
echo "🚀 Démarrage de l'application Gestion Chantiers..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 5

# Exécuter les migrations
echo "📦 Exécution des migrations..."
npx sequelize-cli db:migrate --config src/config/config.json --migrations-path src/migrations

# Démarrer le serveur
echo "✅ Démarrage du serveur..."
node server.js
