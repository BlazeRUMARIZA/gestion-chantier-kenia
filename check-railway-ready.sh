#!/bin/bash

echo "🔍 Vérification Pre-Déploiement Railway"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
PASS=0
FAIL=0

check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((FAIL++))
    fi
}

echo "📦 Vérification Backend..."
echo "-------------------------"

# Backend files
[ -f "backend/railway.json" ]
check $? "railway.json existe"

[ -f "backend/start.sh" ]
check $? "start.sh existe"

[ -x "backend/start.sh" ]
check $? "start.sh est exécutable"

[ -f "backend/package.json" ]
check $? "package.json existe"

[ -f "backend/server.js" ]
check $? "server.js existe"

# Check package.json scripts
grep -q '"start":' backend/package.json
check $? "Script 'start' défini"

grep -q '"start:railway":' backend/package.json
check $? "Script 'start:railway' défini"

echo ""
echo "🎨 Vérification Frontend..."
echo "-------------------------"

# Frontend files
[ -f "railway.json" ]
check $? "railway.json existe (racine)"

[ -f "package.json" ]
check $? "package.json existe (racine)"

[ -f "vite.config.js" ]
check $? "vite.config.js existe"

# Check package.json scripts
grep -q '"build":' package.json
check $? "Script 'build' défini"

grep -q '"preview":' package.json
check $? "Script 'preview' défini"

# Check vite.config
grep -q 'preview:' vite.config.js
check $? "Configuration preview dans vite.config.js"

echo ""
echo "📄 Vérification Fichiers API..."
echo "------------------------------"

[ -f "src/services/api.js" ]
check $? "api.js existe"

grep -q 'VITE_API_URL' src/services/api.js
check $? "VITE_API_URL utilisé dans api.js"

echo ""
echo "🔐 Vérification Configuration DB..."
echo "----------------------------------"

[ -f "backend/src/config/database.js" ]
check $? "database.js existe"

grep -q 'process.env.DB_HOST' backend/src/config/database.js
check $? "Variables d'environnement DB utilisées"

echo ""
echo "📊 Résumé"
echo "========="
echo -e "Réussis: ${GREEN}$PASS${NC}"
echo -e "Échoués: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 Tout est prêt pour le déploiement sur Railway!${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "1. git add . && git commit -m 'Ready for Railway' && git push"
    echo "2. Suivre RAILWAY_QUICK_DEPLOY.md"
    exit 0
else
    echo -e "${RED}⚠️  Certaines vérifications ont échoué${NC}"
    echo "Corrigez les erreurs avant de déployer"
    exit 1
fi
