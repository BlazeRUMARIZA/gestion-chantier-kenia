#!/bin/bash

# Get token from login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@chantiers.com","password":"password123"}' | jq -r '.data.token')

echo "======================================"
echo "Testing All Endpoints"
echo "======================================"
echo "Token: ${TOKEN:0:30}..."
echo ""

# Test counter
PASS=0
FAIL=0

test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo "--- $name ---"
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "http://localhost:5000/api$endpoint" \
            -H "Authorization: Bearer $TOKEN")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "http://localhost:5000/api$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo "Response Code: $http_code"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo "✅ PASS"
        ((PASS++))
    else
        echo "❌ FAIL"
        ((FAIL++))
    fi
    echo ""
    
    # Return the body for capturing IDs
    echo "$body"
}

# ===========================================
# 1. HEALTH CHECK
# ===========================================
echo "========== 1. HEALTH CHECK =========="
test_endpoint "Health Check" "GET" "/health" "" > /dev/null

# ===========================================
# 2. AUTHENTICATION
# ===========================================
echo "========== 2. AUTHENTICATION =========="
test_endpoint "Get Profile" "GET" "/auth/profile" "" > /dev/null
test_endpoint "Login Chef" "POST" "/auth/login" '{"email":"chef.dupont@chantiers.com","password":"password123"}' > /dev/null
test_endpoint "Login Ouvrier" "POST" "/auth/login" '{"email":"ouvrier.martin@chantiers.com","password":"password123"}' > /dev/null
test_endpoint "Invalid Login" "POST" "/auth/login" '{"email":"wrong@test.com","password":"wrong"}' > /dev/null

# ===========================================
# 3. USERS
# ===========================================
echo "========== 3. USER ENDPOINTS =========="
test_endpoint "Get All Users" "GET" "/users" "" > /dev/null
test_endpoint "Get User Stats" "GET" "/users/stats" "" > /dev/null

# Create user
NEW_USER_RESPONSE=$(test_endpoint "Create User" "POST" "/users" '{
    "nom": "Test User API",
    "email": "testapi@chantiers.com",
    "password": "password123",
    "role": "ouvrier",
    "telephone": "0612345678"
}')
NEW_USER_ID=$(echo "$NEW_USER_RESPONSE" | jq -r '.id // .data.id // empty')

if [ ! -z "$NEW_USER_ID" ] && [ "$NEW_USER_ID" != "null" ]; then
    echo "Created user ID: $NEW_USER_ID"
    test_endpoint "Get User by ID" "GET" "/users/$NEW_USER_ID" "" > /dev/null
    test_endpoint "Update User" "PUT" "/users/$NEW_USER_ID" '{"nom":"Test User Updated","telephone":"0687654321"}' > /dev/null
fi

# ===========================================
# 4. CHANTIERS
# ===========================================
echo "========== 4. CHANTIER ENDPOINTS =========="
test_endpoint "Get All Chantiers" "GET" "/chantiers" "" > /dev/null
test_endpoint "Get Chantiers Planning" "GET" "/chantiers/planning" "" > /dev/null
test_endpoint "Get Dashboard Stats" "GET" "/chantiers/stats/dashboard" "" > /dev/null

# Create chantier
NEW_CHANTIER_RESPONSE=$(test_endpoint "Create Chantier" "POST" "/chantiers" '{
    "nom": "Test Chantier API",
    "description": "Chantier de test via API",
    "adresse": "123 Rue Test API",
    "date_debut": "2025-02-01",
    "date_fin_prevue": "2025-08-31",
    "statut": "planifié",
    "budget": 250000,
    "chef_id": 2,
    "priorite": "haute"
}')
NEW_CHANTIER_ID=$(echo "$NEW_CHANTIER_RESPONSE" | jq -r '.id // .data.id // empty')

if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    echo "Created chantier ID: $NEW_CHANTIER_ID"
    test_endpoint "Get Chantier by ID" "GET" "/chantiers/$NEW_CHANTIER_ID" "" > /dev/null
    test_endpoint "Update Chantier" "PUT" "/chantiers/$NEW_CHANTIER_ID" '{"statut":"en_cours","budget":300000}' > /dev/null
    
    # Test PDF generation
    echo "--- Generate Chantier PDF ---"
    curl -s -o "/tmp/chantier_$NEW_CHANTIER_ID.pdf" \
        -H "Authorization: Bearer $TOKEN" \
        "http://localhost:5000/api/chantiers/$NEW_CHANTIER_ID/pdf"
    if [ -f "/tmp/chantier_$NEW_CHANTIER_ID.pdf" ]; then
        echo "✅ PDF generated: $(ls -lh /tmp/chantier_$NEW_CHANTIER_ID.pdf | awk '{print $5}')"
        ((PASS++))
    else
        echo "❌ PDF generation failed"
        ((FAIL++))
    fi
    echo ""
fi

# ===========================================
# 5. AFFECTATIONS
# ===========================================
echo "========== 5. AFFECTATION ENDPOINTS =========="
test_endpoint "Get All Affectations" "GET" "/affectations" "" > /dev/null

if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    test_endpoint "Get Available Workers" "GET" "/affectations/ouvriers-disponibles?chantier_id=$NEW_CHANTIER_ID" "" > /dev/null
    
    # Create affectation
    NEW_AFFECTATION_RESPONSE=$(test_endpoint "Create Affectation" "POST" "/affectations" '{
        "chantier_id": '$NEW_CHANTIER_ID',
        "ouvrier_id": 4,
        "date_debut": "2025-02-01",
        "role_sur_chantier": "plombier",
        "heures_prevues": 100
    }')
    NEW_AFFECTATION_ID=$(echo "$NEW_AFFECTATION_RESPONSE" | jq -r '.id // .data.id // empty')
    
    if [ ! -z "$NEW_AFFECTATION_ID" ] && [ "$NEW_AFFECTATION_ID" != "null" ]; then
        echo "Created affectation ID: $NEW_AFFECTATION_ID"
        test_endpoint "Update Affectation" "PUT" "/affectations/$NEW_AFFECTATION_ID" '{"heures_prevues":120,"role_sur_chantier":"chef plombier"}' > /dev/null
    fi
fi

# ===========================================
# 6. LOGS
# ===========================================
echo "========== 6. LOG ENDPOINTS =========="
test_endpoint "Get All Logs" "GET" "/logs" "" > /dev/null
test_endpoint "Get Connection Logs" "GET" "/logs/connexions" "" > /dev/null

# ===========================================
# 7. DELETE OPERATIONS (CLEANUP)
# ===========================================
echo "========== 7. DELETE OPERATIONS =========="
if [ ! -z "$NEW_AFFECTATION_ID" ] && [ "$NEW_AFFECTATION_ID" != "null" ]; then
    test_endpoint "Delete Affectation" "DELETE" "/affectations/$NEW_AFFECTATION_ID" "" > /dev/null
fi

if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    test_endpoint "Delete Chantier" "DELETE" "/chantiers/$NEW_CHANTIER_ID" "" > /dev/null
fi

if [ ! -z "$NEW_USER_ID" ] && [ "$NEW_USER_ID" != "null" ]; then
    test_endpoint "Delete User" "DELETE" "/users/$NEW_USER_ID" "" > /dev/null
fi

test_endpoint "Logout" "POST" "/auth/logout" "" > /dev/null

# ===========================================
# SUMMARY
# ===========================================
echo "======================================"
echo "TEST SUMMARY"
echo "======================================"
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo "Total: $((PASS + FAIL))"
echo "======================================"
