#!/bin/bash

# Script de démarrage pour Railway
echo "🚀 Démarrage de l'application Gestion Chantiers..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 5

# Exécuter les migrations (en production, les tables sont déjà créées)
if [ "$NODE_ENV" = "production" ]; then
  echo "📦 Mode production: vérification des migrations..."
  # Tenter les migrations mais ne pas échouer si erreur
  npm run migrate || echo "⚠️ Migrations ignorées (tables déjà existantes)"
else
  echo "📦 Mode développement: exécution des migrations..."
  npm run migrate
fi

# Démarrer le serveur
echo "✅ Démarrage du serveur..."
node server.js
