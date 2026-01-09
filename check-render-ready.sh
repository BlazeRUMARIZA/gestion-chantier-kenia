#!/bin/bash

# Script de vérification Render
echo "🔍 Vérification de la configuration Render..."
echo ""

# Check render.yaml
if [ -f "render.yaml" ]; then
    echo "✅ render.yaml trouvé"
else
    echo "❌ render.yaml manquant"
    exit 1
fi

# Check backend structure
echo ""
echo "📁 Structure Backend:"
if [ -d "backend" ]; then
    echo "✅ Dossier backend/"
    if [ -f "backend/package.json" ]; then
        echo "✅ backend/package.json"
    else
        echo "❌ backend/package.json manquant"
    fi
    if [ -f "backend/server.js" ]; then
        echo "✅ backend/server.js"
    else
        echo "❌ backend/server.js manquant"
    fi
else
    echo "❌ Dossier backend/ manquant"
    exit 1
fi

# Check frontend structure
echo ""
echo "📁 Structure Frontend:"
if [ -f "package.json" ]; then
    echo "✅ package.json (root)"
else
    echo "❌ package.json manquant"
    exit 1
fi

if [ -f "vite.config.js" ]; then
    echo "✅ vite.config.js"
else
    echo "❌ vite.config.js manquant"
fi

# Check for Railway remnants
echo ""
echo "🔍 Vérification des traces Railway:"
railway_files=$(find . -name "*railway*" -o -name "*RAILWAY*" 2>/dev/null | grep -v node_modules | grep -v ".git")

if [ -z "$railway_files" ]; then
    echo "✅ Aucun fichier Railway trouvé"
else
    echo "⚠️  Fichiers Railway trouvés:"
    echo "$railway_files"
    echo ""
    echo "Supprimer avec: rm -rf $railway_files"
fi

# Check .env examples
echo ""
echo "📝 Fichiers d'exemple:"
if [ -f ".env.render.example" ]; then
    echo "✅ .env.render.example"
else
    echo "⚠️  .env.render.example manquant"
fi

if [ -f "backend/.env.render.example" ]; then
    echo "✅ backend/.env.render.example"
else
    echo "⚠️  backend/.env.render.example manquant"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RÉSUMÉ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Prêt pour Render? Étapes suivantes:"
echo ""
echo "1. Poussez le code sur GitHub:"
echo "   git add ."
echo "   git commit -m 'Configuration Render'"
echo "   git push"
echo ""
echo "2. Suivez le guide:"
echo "   📖 RENDER_QUICK_START.md (15 min)"
echo "   📖 RENDER_DEPLOYMENT_GUIDE.md (détaillé)"
echo ""
echo "3. Créez les services sur render.com"
echo ""
echo "✨ Bon déploiement!"
