#!/bin/bash
# Script de test local des APIs

echo "🧪 Test des APIs en Local"
echo "=========================="
echo ""

BASE_URL="http://localhost:5000/api"
TOKEN=""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Test: ${description}${NC}"
    echo "Endpoint: ${method} ${endpoint}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${BASE_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${TOKEN}")
    else
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${BASE_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${TOKEN}" \
            -d "${data}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Succès (${http_code})${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ Échec (${http_code})${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
    echo ""
    echo "---"
    echo ""
}

# Vérifier que le serveur est démarré
echo "🔍 Vérification de la connexion au serveur..."
if ! curl -s "${BASE_URL}/health" > /dev/null; then
    echo -e "${RED}❌ Le serveur n'est pas accessible. Démarrez-le avec: npm start${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Serveur accessible${NC}"
echo ""

# Test 1: Health Check
test_endpoint "GET" "/health" "" "Health Check"

# Test 2: Créer un admin
echo "📝 Création d'un compte admin..."
ADMIN_DATA='{
  "nom": "Admin Test",
  "email": "admin@test.com",
  "password": "Admin123!",
  "role": "admin",
  "telephone": "+243999999999"
}'
response=$(curl -s -X POST "${BASE_URL}/auth/register" \
    -H "Content-Type: application/json" \
    -d "${ADMIN_DATA}")
echo "$response" | jq '.'
echo ""

# Test 3: Login
echo "🔐 Connexion..."
LOGIN_DATA='{
  "email": "admin@test.com",
  "password": "Admin123!"
}'
response=$(curl -s -X POST "${BASE_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d "${LOGIN_DATA}")

# Extraire le token
TOKEN=$(echo "$response" | jq -r '.token')
USER_ID=$(echo "$response" | jq -r '.user.id')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Connexion réussie${NC}"
    echo "Token: ${TOKEN:0:20}..."
    echo ""
else
    echo -e "${RED}❌ Échec de connexion${NC}"
    echo "$response" | jq '.'
    exit 1
fi

# Test 4: Profil
test_endpoint "GET" "/auth/me" "" "Obtenir le profil"

# Test 5: Créer un chef
CHEF_DATA='{
  "nom": "Chef Test",
  "email": "chef@test.com",
  "password": "Chef123!",
  "role": "chef",
  "telephone": "+243888888888"
}'
test_endpoint "POST" "/users" "${CHEF_DATA}" "Créer un chef de chantier"

# Test 6: Créer un ouvrier
OUVRIER_DATA='{
  "nom": "Ouvrier Test",
  "email": "ouvrier@test.com",
  "password": "Ouvrier123!",
  "role": "ouvrier",
  "telephone": "+243777777777"
}'
test_endpoint "POST" "/users" "${OUVRIER_DATA}" "Créer un ouvrier"

# Test 7: Lister les utilisateurs
test_endpoint "GET" "/users?page=1&limit=10" "" "Lister les utilisateurs"

# Récupérer les IDs pour les tests suivants
echo "📋 Récupération des IDs..."
users_response=$(curl -s -X GET "${BASE_URL}/users" \
    -H "Authorization: Bearer ${TOKEN}")
CHEF_ID=$(echo "$users_response" | jq -r '.users[] | select(.role=="chef") | .id' | head -n1)
OUVRIER_ID=$(echo "$users_response" | jq -r '.users[] | select(.role=="ouvrier") | .id' | head -n1)

echo "Chef ID: $CHEF_ID"
echo "Ouvrier ID: $OUVRIER_ID"
echo ""

# Test 8: Créer un chantier
if [ -n "$CHEF_ID" ]; then
    CHANTIER_DATA="{
      \"nom\": \"Test Chantier\",
      \"description\": \"Chantier de test\",
      \"adresse\": \"123 Rue Test\",
      \"date_debut\": \"2026-01-15\",
      \"date_fin_prevue\": \"2026-12-31\",
      \"statut\": \"planifié\",
      \"budget\": 50000.00,
      \"chef_id\": ${CHEF_ID},
      \"priorite\": \"moyenne\"
    }"
    test_endpoint "POST" "/chantiers" "${CHANTIER_DATA}" "Créer un chantier"
fi

# Test 9: Lister les chantiers
test_endpoint "GET" "/chantiers" "" "Lister les chantiers"

# Récupérer l'ID du chantier
chantiers_response=$(curl -s -X GET "${BASE_URL}/chantiers" \
    -H "Authorization: Bearer ${TOKEN}")
CHANTIER_ID=$(echo "$chantiers_response" | jq -r '.chantiers[0].id' 2>/dev/null)

echo "Chantier ID: $CHANTIER_ID"
echo ""

# Test 10: Créer une affectation
if [ -n "$CHANTIER_ID" ] && [ -n "$OUVRIER_ID" ]; then
    AFFECTATION_DATA="{
      \"chantier_id\": ${CHANTIER_ID},
      \"ouvrier_id\": ${OUVRIER_ID},
      \"date_debut\": \"2026-01-15\",
      \"role_sur_chantier\": \"Maçon\",
      \"heures_prevues\": 160
    }"
    test_endpoint "POST" "/affectations" "${AFFECTATION_DATA}" "Créer une affectation"
fi

# Test 11: Lister les affectations
test_endpoint "GET" "/affectations" "" "Lister les affectations"

# Test 12: Lister les logs
test_endpoint "GET" "/logs?page=1&limit=10" "" "Lister les logs"

echo ""
echo "🎉 Tests terminés!"
echo ""
echo "📊 Résumé:"
echo "- Backend: ${BASE_URL}"
echo "- Token: ${TOKEN:0:20}..."
echo "- User ID: ${USER_ID}"
echo "- Chef ID: ${CHEF_ID}"
echo "- Ouvrier ID: ${OUVRIER_ID}"
echo "- Chantier ID: ${CHANTIER_ID}"
