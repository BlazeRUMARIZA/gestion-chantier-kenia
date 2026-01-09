#!/bin/bash
# Script de démarrage pour production (Render)
# Exécute les migrations puis démarre le serveur

set -e  # Arrête si une commande échoue

# Exécuter les migrations via Node.js
node run-migrations.js

echo "🚀 Démarrage du serveur..."
node server.js
