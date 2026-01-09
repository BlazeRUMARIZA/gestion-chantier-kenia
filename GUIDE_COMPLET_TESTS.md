# 🚀 Guide Complet de Configuration et Tests

## 📋 Étape 1: Configuration sur Render (5 minutes)

### A. Backend - Variables d'Environnement

1. **Ouvrir le Dashboard Render:** https://dashboard.render.com
2. **Sélectionner:** `gestion-chantier-backend`
3. **Aller dans:** Environment
4. **Ajouter ces variables:**

```bash
DATABASE_URL=postgresql://gestion_chantiers_user:dE7YIepzGP2ZTUTmQkGlDlCW7iodI6u1@dpg-d5gc2p14tr6s73e82q20-a/gestion_chantiers
CORS_ORIGIN=https://gestion-chantier-frontend.onrender.com
JWT_SECRET=changez_ce_secret_jwt_en_production_123456789
NODE_ENV=production
```

5. **Cliquer:** Save Changes ✅
6. **Attendre:** Le redéploiement automatique

### B. Frontend - Variables d'Environnement

1. **Sélectionner:** `gestion-chantier-frontend`
2. **Aller dans:** Environment
3. **Ajouter:**

```bash
VITE_API_URL=https://gestion-chantier-backend.onrender.com/api
```

4. **Cliquer:** Save Changes ✅
5. **Redéployer manuellement** si nécessaire

---

## 🧪 Étape 2: Tests Locaux (Avant de tester en production)

### Démarrer le Backend Localement

```bash
cd backend

# Créer le fichier .env
cat > .env << 'EOF'
DATABASE_URL=postgresql://gestion_chantiers_user:dE7YIepzGP2ZTUTmQkGlDlCW7iodI6u1@dpg-d5gc2p14tr6s73e82q20-a/gestion_chantiers
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=test_jwt_secret_local
NODE_ENV=development
PORT=5000
EOF

# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

**Vérifier que le serveur démarre:**
```
🔒 CORS configuré pour: http://localhost:3000
✅ Connecté à la base de données MySQL
🚀 Serveur démarré sur le port 5000
```

### Tester le Backend Local avec le Script

**Terminal 1** (Backend):
```bash
cd backend
npm start
```

**Terminal 2** (Tests):
```bash
cd backend
chmod +x test-api.sh
./test-api.sh
```

**Résultat attendu:**
```
🧪 Test des APIs en Local
==========================
✅ Health Check
✅ Register Admin
✅ Login
✅ Get Profile
✅ Create Chef
✅ Create Ouvrier
✅ List Users
✅ Create Chantier
✅ List Chantiers
...
🎉 Tests terminés!
```

---

## 📬 Étape 3: Tests avec Postman

### A. Configuration Postman

1. **Ouvrir Postman**
2. **Créer un Environnement:**
   - Nom: `Gestion Chantiers - Production`
   - Variable `base_url`: `https://gestion-chantier-backend.onrender.com/api`

3. **Créer une Collection:** `Gestion Chantiers Kenia`

### B. Tests API en Production

#### Test 1: Health Check ✅

**Request:**
```
GET {{base_url}}/health
```

**Résultat attendu:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-01-09T12:00:00.000Z"
}
```

#### Test 2: Créer un Admin 👤

**Request:**
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "nom": "Admin Principal",
  "email": "admin@chantier.com",
  "password": "Admin123!",
  "role": "admin",
  "telephone": "+243999999999"
}
```

**Résultat attendu:**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "nom": "Admin Principal",
    "email": "admin@chantier.com",
    "role": "admin",
    ...
  }
}
```

#### Test 3: Login 🔐

**Request:**
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@chantier.com",
  "password": "Admin123!"
}
```

**Résultat attendu:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Admin Principal",
    "email": "admin@chantier.com",
    "role": "admin"
  }
}
```

**🔑 IMPORTANT:** Copiez le token et ajoutez-le dans vos prochaines requêtes!

#### Test 4: Créer un Chef 👷

**Request:**
```
POST {{base_url}}/users
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI

{
  "nom": "Jean Dupont",
  "email": "chef@chantier.com",
  "password": "Chef123!",
  "role": "chef",
  "telephone": "+243888888888"
}
```

#### Test 5: Créer un Chantier 🏗️

**Request:**
```
POST {{base_url}}/chantiers
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI

{
  "nom": "Construction Immeuble ABC",
  "description": "Immeuble de 5 étages",
  "adresse": "123 Av. de la République, Kinshasa",
  "date_debut": "2026-01-15",
  "date_fin_prevue": "2026-12-31",
  "statut": "planifié",
  "budget": 150000.00,
  "chef_id": 2,
  "priorite": "haute"
}
```

---

## 🎯 Étape 4: Tests Complets avec cURL

### Script de Test Rapide (Production)

Créez un fichier `test-production.sh`:

```bash
#!/bin/bash

BASE_URL="https://gestion-chantier-backend.onrender.com/api"

# 1. Health Check
echo "1️⃣ Health Check..."
curl -s "${BASE_URL}/health" | jq '.'
echo ""

# 2. Créer Admin
echo "2️⃣ Création Admin..."
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Admin Test",
    "email": "admin@test.com",
    "password": "Admin123!",
    "role": "admin"
  }')
echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# 3. Login
echo "3️⃣ Login..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }')
echo "$LOGIN_RESPONSE" | jq '.'

# Extraire le token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""
echo "🔑 Token: ${TOKEN:0:30}..."
echo ""

# 4. Profil
echo "4️⃣ Obtenir le profil..."
curl -s "${BASE_URL}/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 5. Liste des utilisateurs
echo "5️⃣ Liste des utilisateurs..."
curl -s "${BASE_URL}/users" \
  -H "Authorization: Bearer $TOKEN" | jq '.users[] | {id, nom, email, role}'
echo ""

echo "✅ Tests terminés!"
```

**Exécuter:**
```bash
chmod +x test-production.sh
./test-production.sh
```

---

## 🎨 Étape 5: Tester le Frontend

### Vérifier que le Frontend se connecte au Backend

1. **Ouvrir:** https://gestion-chantier-frontend.onrender.com
2. **Ouvrir la Console du Navigateur** (F12)
3. **Vérifier les requêtes réseau:**
   - Les appels API doivent pointer vers `https://gestion-chantier-backend.onrender.com/api`
   - Pas d'erreurs CORS

4. **Tester la connexion:**
   - Créer un compte
   - Se connecter
   - Naviguer dans l'application

---

## 🔍 Étape 6: Vérification Complète

### Checklist de Déploiement

- [ ] ✅ Backend déployé et accessible
- [ ] ✅ Database connectée (pas d'erreur "relation does not exist")
- [ ] ✅ Migrations exécutées (tables créées)
- [ ] ✅ CORS configuré correctement
- [ ] ✅ Frontend déployé
- [ ] ✅ Frontend pointe vers le bon backend
- [ ] ✅ Authentification fonctionne
- [ ] ✅ APIs répondent correctement

### URLs de Production

| Service | URL |
|---------|-----|
| Frontend | https://gestion-chantier-frontend.onrender.com |
| Backend API | https://gestion-chantier-backend.onrender.com/api |
| Health Check | https://gestion-chantier-backend.onrender.com/api/health |
| Database | `dpg-d5gc2p14tr6s73e82q20-a` (PostgreSQL) |

---

## 🐛 Troubleshooting

### Problème 1: CORS Error
**Symptôme:** Erreur CORS dans la console du navigateur

**Solution:**
```bash
# Vérifier CORS_ORIGIN sur Render
CORS_ORIGIN=https://gestion-chantier-frontend.onrender.com
```

### Problème 2: 401 Unauthorized
**Symptôme:** Requêtes retournent 401

**Solution:**
- Vérifier que le token est valide
- Vérifier que JWT_SECRET est configuré
- Se reconnecter pour obtenir un nouveau token

### Problème 3: Database Connection Error
**Symptôme:** "Cannot connect to database"

**Solution:**
- Vérifier DATABASE_URL dans les variables d'environnement
- Vérifier que les migrations sont exécutées

---

## 📚 Documentation Complète

- **Configuration:** [RENDER_URLS.md](./RENDER_URLS.md)
- **Tests Postman:** [POSTMAN_TESTS.md](./POSTMAN_TESTS.md)
- **Déploiement:** [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
- **Troubleshooting:** [RENDER_TROUBLESHOOTING.md](./RENDER_TROUBLESHOOTING.md)

---

## 🎉 Prêt à Tester!

Vous êtes maintenant prêt à tester l'application! Suivez les étapes dans l'ordre:

1. ✅ Configurer les variables d'environnement sur Render
2. ✅ Tester localement avec `./backend/test-api.sh`
3. ✅ Tester en production avec Postman ou cURL
4. ✅ Vérifier le frontend

**Bonne chance! 🚀**
