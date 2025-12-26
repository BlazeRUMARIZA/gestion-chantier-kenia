#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api"
TOKEN=""
ADMIN_ID=""
NEW_USER_ID=""
NEW_CHANTIER_ID=""
NEW_AFFECTATION_ID=""

# Function to print test header
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Function to make API request and show response
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth_header=$4
    
    echo -e "\n${YELLOW}Request: $method $endpoint${NC}"
    if [ ! -z "$data" ]; then
        echo -e "${YELLOW}Data: $data${NC}"
    fi
    
    if [ ! -z "$auth_header" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $auth_header" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo -e "${YELLOW}Response Code: $http_code${NC}"
    echo -e "${YELLOW}Response Body:${NC}"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    
    # Return the http code
    return $http_code
}

# Wait for server to be ready
echo -e "${BLUE}Waiting for server to be ready...${NC}"
sleep 2

# ============================================
# 1. HEALTH CHECK
# ============================================
print_header "1. HEALTH CHECK ENDPOINT"

api_request "GET" "/health" "" ""
print_result $? "Health check completed"

# ============================================
# 2. AUTH ENDPOINTS
# ============================================
print_header "2. AUTHENTICATION ENDPOINTS"

# Test login with admin
echo -e "\n${YELLOW}>>> Testing Login (Admin)${NC}"
response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@chantiers.com","password":"password123"}')

echo "$response" | jq '.'
TOKEN=$(echo "$response" | jq -r '.token')
ADMIN_ID=$(echo "$response" | jq -r '.user.id')

if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    print_result 0 "Admin login successful (Token: ${TOKEN:0:20}...)"
else
    print_result 1 "Admin login failed"
    exit 1
fi

# Test get profile
echo -e "\n${YELLOW}>>> Testing Get Profile${NC}"
api_request "GET" "/auth/profile" "" "$TOKEN"
print_result $? "Get profile completed"

# Test login with chef
echo -e "\n${YELLOW}>>> Testing Login (Chef)${NC}"
api_request "POST" "/auth/login" '{"email":"chef.dupont@chantiers.com","password":"password123"}' ""
print_result $? "Chef login completed"

# Test login with ouvrier
echo -e "\n${YELLOW}>>> Testing Login (Ouvrier)${NC}"
api_request "POST" "/auth/login" '{"email":"ouvrier.martin@chantiers.com","password":"password123"}' ""
print_result $? "Ouvrier login completed"

# Test invalid login
echo -e "\n${YELLOW}>>> Testing Invalid Login${NC}"
api_request "POST" "/auth/login" '{"email":"invalid@test.com","password":"wrong"}' ""
print_result $? "Invalid login test completed (should fail)"

# ============================================
# 3. USER ENDPOINTS
# ============================================
print_header "3. USER ENDPOINTS"

# Get all users
echo -e "\n${YELLOW}>>> Testing Get All Users${NC}"
api_request "GET" "/users" "" "$TOKEN"
print_result $? "Get all users completed"

# Get user stats
echo -e "\n${YELLOW}>>> Testing Get User Stats${NC}"
api_request "GET" "/users/stats" "" "$TOKEN"
print_result $? "Get user stats completed"

# Create new user
echo -e "\n${YELLOW}>>> Testing Create User${NC}"
response=$(curl -s -X POST "$BASE_URL/users" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "nom": "Test User",
        "email": "test.user@chantiers.com",
        "password": "password123",
        "role": "ouvrier",
        "telephone": "0698765432"
    }')

echo "$response" | jq '.'
NEW_USER_ID=$(echo "$response" | jq -r '.id')
print_result $? "Create user completed (ID: $NEW_USER_ID)"

# Get specific user
if [ ! -z "$NEW_USER_ID" ] && [ "$NEW_USER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Get User by ID${NC}"
    api_request "GET" "/users/$NEW_USER_ID" "" "$TOKEN"
    print_result $? "Get user by ID completed"
fi

# Update user
if [ ! -z "$NEW_USER_ID" ] && [ "$NEW_USER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Update User${NC}"
    api_request "PUT" "/users/$NEW_USER_ID" '{"nom":"Test User Updated","telephone":"0699999999"}' "$TOKEN"
    print_result $? "Update user completed"
fi

# ============================================
# 4. CHANTIER ENDPOINTS
# ============================================
print_header "4. CHANTIER ENDPOINTS"

# Get all chantiers
echo -e "\n${YELLOW}>>> Testing Get All Chantiers${NC}"
api_request "GET" "/chantiers" "" "$TOKEN"
print_result $? "Get all chantiers completed"

# Get chantiers planning
echo -e "\n${YELLOW}>>> Testing Get Chantiers Planning${NC}"
api_request "GET" "/chantiers/planning" "" "$TOKEN"
print_result $? "Get chantiers planning completed"

# Get dashboard stats
echo -e "\n${YELLOW}>>> Testing Get Dashboard Stats${NC}"
api_request "GET" "/chantiers/stats/dashboard" "" "$TOKEN"
print_result $? "Get dashboard stats completed"

# Create new chantier
echo -e "\n${YELLOW}>>> Testing Create Chantier${NC}"
response=$(curl -s -X POST "$BASE_URL/chantiers" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "nom": "Test Chantier",
        "description": "Description du test chantier",
        "adresse": "123 Rue Test",
        "date_debut": "2025-01-01",
        "date_fin_prevue": "2025-06-30",
        "statut": "planifié",
        "budget": 100000,
        "chef_id": 2,
        "priorite": "moyenne"
    }')

echo "$response" | jq '.'
NEW_CHANTIER_ID=$(echo "$response" | jq -r '.id')
print_result $? "Create chantier completed (ID: $NEW_CHANTIER_ID)"

# Get specific chantier
if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Get Chantier by ID${NC}"
    api_request "GET" "/chantiers/$NEW_CHANTIER_ID" "" "$TOKEN"
    print_result $? "Get chantier by ID completed"
fi

# Update chantier
if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Update Chantier${NC}"
    api_request "PUT" "/chantiers/$NEW_CHANTIER_ID" '{"statut":"en_cours","budget":150000}' "$TOKEN"
    print_result $? "Update chantier completed"
fi

# Test PDF generation
if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Generate Chantier PDF${NC}"
    curl -s -o "/tmp/chantier_$NEW_CHANTIER_ID.pdf" \
        -H "Authorization: Bearer $TOKEN" \
        "$BASE_URL/chantiers/$NEW_CHANTIER_ID/pdf"
    if [ -f "/tmp/chantier_$NEW_CHANTIER_ID.pdf" ]; then
        print_result 0 "PDF generated successfully"
        ls -lh "/tmp/chantier_$NEW_CHANTIER_ID.pdf"
    else
        print_result 1 "PDF generation failed"
    fi
fi

# ============================================
# 5. AFFECTATION ENDPOINTS
# ============================================
print_header "5. AFFECTATION ENDPOINTS"

# Get all affectations
echo -e "\n${YELLOW}>>> Testing Get All Affectations${NC}"
api_request "GET" "/affectations" "" "$TOKEN"
print_result $? "Get all affectations completed"

# Get available workers
if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Get Available Workers${NC}"
    api_request "GET" "/affectations/ouvriers-disponibles?chantier_id=$NEW_CHANTIER_ID" "" "$TOKEN"
    print_result $? "Get available workers completed"
fi

# Create new affectation
if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Create Affectation${NC}"
    response=$(curl -s -X POST "$BASE_URL/affectations" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
            "chantier_id": '$NEW_CHANTIER_ID',
            "ouvrier_id": 4,
            "date_debut": "2025-01-15",
            "role_sur_chantier": "électricien",
            "heures_prevues": 100
        }')
    
    echo "$response" | jq '.'
    NEW_AFFECTATION_ID=$(echo "$response" | jq -r '.id')
    print_result $? "Create affectation completed (ID: $NEW_AFFECTATION_ID)"
fi

# Update affectation
if [ ! -z "$NEW_AFFECTATION_ID" ] && [ "$NEW_AFFECTATION_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Update Affectation${NC}"
    api_request "PUT" "/affectations/$NEW_AFFECTATION_ID" '{"heures_prevues":120,"role_sur_chantier":"chef électricien"}' "$TOKEN"
    print_result $? "Update affectation completed"
fi

# ============================================
# 6. LOG ENDPOINTS
# ============================================
print_header "6. LOG ENDPOINTS"

# Get all logs
echo -e "\n${YELLOW}>>> Testing Get All Logs${NC}"
api_request "GET" "/logs" "" "$TOKEN"
print_result $? "Get all logs completed"

# Get connection logs
echo -e "\n${YELLOW}>>> Testing Get Connection Logs${NC}"
api_request "GET" "/logs/connexions" "" "$TOKEN"
print_result $? "Get connection logs completed"

# ============================================
# 7. DELETE OPERATIONS (CLEANUP)
# ============================================
print_header "7. DELETE OPERATIONS (CLEANUP)"

# Delete affectation
if [ ! -z "$NEW_AFFECTATION_ID" ] && [ "$NEW_AFFECTATION_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Delete Affectation${NC}"
    api_request "DELETE" "/affectations/$NEW_AFFECTATION_ID" "" "$TOKEN"
    print_result $? "Delete affectation completed"
fi

# Delete chantier
if [ ! -z "$NEW_CHANTIER_ID" ] && [ "$NEW_CHANTIER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Delete Chantier${NC}"
    api_request "DELETE" "/chantiers/$NEW_CHANTIER_ID" "" "$TOKEN"
    print_result $? "Delete chantier completed"
fi

# Delete user
if [ ! -z "$NEW_USER_ID" ] && [ "$NEW_USER_ID" != "null" ]; then
    echo -e "\n${YELLOW}>>> Testing Delete User${NC}"
    api_request "DELETE" "/users/$NEW_USER_ID" "" "$TOKEN"
    print_result $? "Delete user completed"
fi

# Test logout
echo -e "\n${YELLOW}>>> Testing Logout${NC}"
api_request "POST" "/auth/logout" "" "$TOKEN"
print_result $? "Logout completed"

# ============================================
# SUMMARY
# ============================================
print_header "TEST SUMMARY"
echo -e "${GREEN}✅ All endpoint tests completed!${NC}"
echo -e "${BLUE}Check the output above for detailed results.${NC}"
