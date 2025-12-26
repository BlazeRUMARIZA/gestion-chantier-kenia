#!/bin/bash

# Script de démarrage du backend
echo "🚀 Démarrage du serveur backend..."

cd /home/rumariza/Downloads/gestion-chantier-kenia/Gestion-Chantier-Backend

if [ ! -f "server.js" ]; then
    echo "❌ Erreur: server.js introuvable"
    exit 1
fi

echo "📂 Répertoire: $(pwd)"
echo "🔧 Démarrage de Node.js..."

node server.js
