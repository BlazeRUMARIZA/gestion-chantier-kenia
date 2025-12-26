#!/bin/bash

# 🚀 Script de démarrage rapide - Frontend Gestion des Chantiers

echo "================================================"
echo "🏗️  Frontend Gestion des Chantiers"
echo "================================================"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "📥 Installez Node.js depuis: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Vérifier si nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    echo "📁 Assurez-vous d'être dans le dossier frontend"
    exit 1
fi

echo "📁 Dossier correct détecté"
echo ""

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation"
        exit 1
    fi
    echo "✅ Dépendances installées"
else
    echo "✅ Dépendances déjà installées"
fi

echo ""
echo "================================================"
echo "🎉 Tout est prêt !"
echo "================================================"
echo ""
echo "📋 Comptes de test:"
echo "   Admin:   admin@gestion.com / password"
echo "   Chef:    chef@gestion.com / password"
echo "   Ouvrier: ouvrier@gestion.com / password"
echo ""
echo "🌐 L'application va démarrer sur: http://localhost:3000"
echo ""
echo "⚠️  Assurez-vous que le backend est démarré sur le port 5000"
echo ""
echo "🚀 Démarrage de l'application..."
echo ""

npm run dev
