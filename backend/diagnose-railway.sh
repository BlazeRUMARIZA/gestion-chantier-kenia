#!/bin/bash

# ============================================
# Script de diagnostic Railway Backend
# ============================================

echo "🔍 DIAGNOSTIC RAILWAY BACKEND"
echo "================================"
echo ""

BACKEND_URL="https://faithful-empathy-production.up.railway.app"

echo "1️⃣ Test Health Endpoint..."
echo "---"
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/api/health")
echo "$HEALTH_RESPONSE"
echo ""

HTTP_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Backend fonctionne correctement!"
elif [ "$HTTP_CODE" = "502" ]; then
    echo "❌ 502 Bad Gateway - Le backend ne démarre pas"
    echo ""
    echo "🔧 CAUSES POSSIBLES:"
    echo ""
    echo "A) Variables manquantes dans Railway:"
    echo "   - MYSQLHOST=${{MySQL.MYSQLHOST}}"
    echo "   - MYSQLPORT=${{MySQL.MYSQLPORT}}"
    echo "   - MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}"
    echo "   - MYSQLUSER=${{MySQL.MYSQLUSER}}"
    echo "   - MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}"
    echo "   - JWT_SECRET=un_secret_fort"
    echo "   - NODE_ENV=production"
    echo "   - CORS_ORIGIN=https://gestion-chantier-kenia-production.up.railway.app"
    echo ""
    echo "B) Service MySQL non actif:"
    echo "   - Vérifiez que MySQL est déployé et actif (status: Active)"
    echo ""
    echo "C) Le dernier commit n'a pas été déployé:"
    echo "   - Dans Railway > Backend > Deployments"
    echo "   - Cliquez sur '⋮' > 'Redeploy'"
    echo ""
    echo "D) Erreur dans le code lors du démarrage:"
    echo "   - Vérifiez les logs Railway pour voir l'erreur exacte"
    echo ""
elif [ "$HTTP_CODE" = "404" ]; then
    echo "⚠️ 404 Not Found - Le backend démarre mais la route /api/health n'existe pas"
else
    echo "⚠️ Code HTTP: $HTTP_CODE"
fi

echo ""
echo "2️⃣ Test CORS (OPTIONS preflight)..."
echo "---"
CORS_RESPONSE=$(curl -s -I -X OPTIONS \
  -H "Origin: https://gestion-chantier-kenia-production.up.railway.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  "$BACKEND_URL/api/auth/login")

echo "$CORS_RESPONSE"
echo ""

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS est configuré correctement"
else
    echo "❌ CORS non configuré ou backend non disponible"
fi

echo ""
echo "3️⃣ Test de connexion de base..."
echo "---"
BASE_RESPONSE=$(curl -s -I "$BACKEND_URL")
echo "$BASE_RESPONSE"
echo ""

echo "================================"
echo "🔍 FIN DU DIAGNOSTIC"
echo ""
echo "📋 ACTIONS À FAIRE:"
echo ""
echo "1. Allez sur Railway: https://railway.app"
echo "2. Sélectionnez le service Backend (faithful-empathy-production)"
echo "3. Vérifiez l'onglet 'Deployments':"
echo "   - Le dernier commit (ed9a9ebf) est-il déployé?"
echo "   - Status: Success ou Failed?"
echo "4. Consultez les 'Logs' pour voir l'erreur exacte"
echo "5. Vérifiez l'onglet 'Variables':"
echo "   - Toutes les variables MySQL sont-elles présentes?"
echo "   - JWT_SECRET existe-t-il?"
echo "   - CORS_ORIGIN est-il correct?"
echo ""
echo "💡 ASTUCE:"
echo "Si les variables sont bonnes, essayez de forcer un redéploiement:"
echo "Deployments > ⋮ (menu) > Redeploy"
echo ""
