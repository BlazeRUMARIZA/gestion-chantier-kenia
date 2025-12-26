# Quick Test Commands - Gestion des Chantiers API

## Prerequisites
```bash
# Start XAMPP MySQL
sudo /opt/lampp/lampp startmysql

# Setup database (first time only)
node setup-database.js

# Start server
node server.js
```

## Get Authentication Token
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chantiers.com","password":"password123"}' | jq -r '.data.token')
echo $TOKEN
```

## Quick Test Commands

### 1. Health Check
```bash
curl -s http://localhost:5000/api/health | jq '.'
```

### 2. Authentication
```bash
# Login
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chantiers.com","password":"password123"}' | jq '.'

# Get Profile
curl -s -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Logout
curl -s -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 3. Users
```bash
# Get all users
curl -s -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Get user stats
curl -s -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Create user
curl -s -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test User","email":"test@test.com","password":"password123","role":"ouvrier"}' | jq '.'

# Get user by ID
curl -s -X GET http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Update user
curl -s -X PUT http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"telephone":"0612345678"}' | jq '.'

# Delete user
curl -s -X DELETE http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 4. Chantiers
```bash
# Get all chantiers
curl -s -X GET http://localhost:5000/api/chantiers \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Get planning
curl -s -X GET http://localhost:5000/api/chantiers/planning \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Get dashboard stats
curl -s -X GET http://localhost:5000/api/chantiers/stats/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Create chantier
curl -s -X POST http://localhost:5000/api/chantiers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom":"Test Chantier",
    "adresse":"123 Rue Test",
    "date_debut":"2025-01-01",
    "date_fin_prevue":"2025-12-31",
    "statut":"planifié",
    "budget":100000,
    "chef_id":2,
    "priorite":"moyenne"
  }' | jq '.'

# Get chantier by ID
curl -s -X GET http://localhost:5000/api/chantiers/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Update chantier
curl -s -X PUT http://localhost:5000/api/chantiers/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"statut":"en_cours"}' | jq '.'

# Generate PDF
curl -s -o chantier.pdf \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/chantiers/1/pdf

# Delete chantier
curl -s -X DELETE http://localhost:5000/api/chantiers/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 5. Affectations
```bash
# Get all affectations
curl -s -X GET http://localhost:5000/api/affectations \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Get available workers
curl -s -X GET "http://localhost:5000/api/affectations/ouvriers-disponibles?chantier_id=1" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Create affectation
curl -s -X POST http://localhost:5000/api/affectations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chantier_id":1,
    "ouvrier_id":3,
    "date_debut":"2025-01-01",
    "role_sur_chantier":"électricien",
    "heures_prevues":100
  }' | jq '.'

# Update affectation
curl -s -X PUT http://localhost:5000/api/affectations/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"heures_prevues":120}' | jq '.'

# Delete affectation
curl -s -X DELETE http://localhost:5000/api/affectations/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 6. Logs
```bash
# Get all logs
curl -s -X GET http://localhost:5000/api/logs \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Get connection logs only
curl -s -X GET http://localhost:5000/api/logs/connexions \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Filter by level
curl -s -X GET "http://localhost:5000/api/logs?niveau=error" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Pagination
curl -s -X GET "http://localhost:5000/api/logs?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

## Run Complete Test Suite
```bash
# Make executable and run
chmod +x test-endpoints-complete.sh
./test-endpoints-complete.sh
```

## Default Credentials
- **Admin:** admin@chantiers.com / password123
- **Chef:** chef.dupont@chantiers.com / password123
- **Ouvrier:** ouvrier.martin@chantiers.com / password123
