# 🧪 Tests Rapides Railway

## ✅ Avant de Déployer (Local)

### Test Build Frontend
```bash
cd /home/rumariza/Downloads/gestion-chantier-kenia
npm ci
npm run build
```

**Attendu**: 
- Dossier `dist/` créé
- Pas d'erreurs de build

### Test Preview Frontend
```bash
PORT=3000 npm run start
```

**Attendu**:
- Serveur démarre sur `http://localhost:3000`
- Application accessible

### Test Build Backend
```bash
cd backend
npm install
```

**Attendu**:
- Pas d'erreurs d'installation

---

## 🚂 Après Déploiement Railway

### Test Backend

#### Health Check
```bash
curl https://VOTRE-BACKEND.up.railway.app/api/health
```

**Attendu**:
```json
{
  "status": "OK",
  "message": "API is running",
  "timestamp": "2025-12-30T..."
}
```

#### Login API
```bash
curl -X POST https://VOTRE-BACKEND.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chantiers.com",
    "password": "password123"
  }'
```

**Attendu**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Admin",
    "prenom": "Système",
    "email": "admin@chantiers.com",
    "role": "admin"
  }
}
```

#### Liste Chantiers (avec token)
```bash
# Remplacez YOUR_TOKEN par le token obtenu au login
curl https://VOTRE-BACKEND.up.railway.app/api/chantiers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Attendu**:
```json
[
  {
    "id": 1,
    "nom": "Construction Immeuble A",
    "adresse": "123 Avenue Principale",
    "statut": "en_cours",
    ...
  },
  ...
]
```

### Test Frontend

#### Page d'Accueil
```
Ouvrir: https://VOTRE-FRONTEND.up.railway.app
```

**Attendu**:
- Page de login s'affiche
- Pas d'erreur dans la console navigateur (F12)

#### Test Login
```
Email: admin@chantiers.com
Password: password123
Cliquer: Se connecter
```

**Attendu**:
- Redirection vers Dashboard
- Liste des chantiers affichée
- Pas d'erreur CORS

#### Test Navigation
```
Cliquer: Chantiers → Voir tous les chantiers
```

**Attendu**:
- Liste des 4 chantiers
- Boutons fonctionnels

#### Test PDF
```
Cliquer: Actions → Générer PDF (sur un chantier)
```

**Attendu**:
- PDF téléchargé
- Pas d'erreur 500

---

## 🔍 Vérifications Railway Dashboard

### Backend Service

#### Variables
```
✅ DB_HOST = ${{MySQL.MYSQLHOST}}
✅ DB_PORT = ${{MySQL.MYSQLPORT}}
✅ DB_NAME = ${{MySQL.MYSQLDATABASE}}
✅ DB_USER = ${{MySQL.MYSQLUSER}}
✅ DB_PASSWORD = ${{MySQL.MYSQLPASSWORD}}
✅ JWT_SECRET = (valeur sécurisée, changée)
✅ JWT_EXPIRES_IN = 24h
✅ NODE_ENV = production
✅ CORS_ORIGIN = (URL frontend exacte)
```

#### Logs
Recherchez:
```
✅ "Database connected successfully"
✅ "Executing migration 20240101000001"
✅ "Server running on port"
```

Si erreur:
```
❌ "ECONNREFUSED" → MySQL pas démarré
❌ "Access denied" → DB credentials incorrects
❌ "Migration failed" → Vérifier migrations/
```

### Frontend Service

#### Variables
```
✅ VITE_API_URL = https://votre-backend.up.railway.app
✅ PORT = 3000 (optionnel)
```

#### Logs
Recherchez:
```
✅ "vite v5.x.x building for production"
✅ "✓ built in Xs"
✅ "Preview server started at"
```

Si erreur:
```
❌ "Module not found" → npm ci a échoué
❌ "Build failed" → Erreur dans le code
❌ "Cannot bind port" → PORT déjà utilisé (rare)
```

### MySQL Database

#### Status
```
✅ Status: Active
✅ MYSQLHOST, MYSQLPORT, etc. visibles
```

---

## 🐛 Tests de Dépannage

### Test 1: Backend peut se connecter à MySQL?

Dans Railway Backend Logs, cherchez:
```bash
"Database connected successfully"
```

Si absent:
```
1. Vérifier MySQL service = Active
2. Vérifier variables DB_* utilisent ${{MySQL.*}}
3. Redéployer backend
```

### Test 2: Migrations s'exécutent?

Dans Railway Backend Logs, cherchez:
```bash
"Executing migration 20240101000001"
"== 20240101000001-create-tables: migrated"
```

Si absent:
```
1. Vérifier start.sh existe et est exécutable
2. Vérifier sequelize-cli dans package.json
3. Vérifier migrations/ contient les fichiers
```

### Test 3: Frontend peut appeler Backend?

Ouvrir Frontend → F12 Console → Network:
```
Cherchez: Requête vers /api/...
```

Si erreur CORS:
```
Access-Control-Allow-Origin...
```

**Solution**:
```
Backend Variables → CORS_ORIGIN = URL_FRONTEND_EXACTE
(sans / à la fin)
```

### Test 4: Build Frontend fonctionne?

Dans Railway Frontend Logs:
```bash
✓ xx modules transformed
✓ built in xxs
dist/index.html          x.xx kB
dist/assets/index-xxx.js xxx kB
```

Si échec:
```
1. Tester localement: npm ci && npm run build
2. Vérifier erreurs dans le code
3. Vérifier package.json scripts
```

---

## 📊 Checklist Finale

### Backend ✅
- [ ] Service créé (Root: `/backend`)
- [ ] MySQL ajouté et Active
- [ ] 9 variables configurées
- [ ] JWT_SECRET changé
- [ ] Déployé sans erreur
- [ ] Logs: "Database connected"
- [ ] Logs: "Server running"
- [ ] `/api/health` retourne 200
- [ ] Login API fonctionne

### Frontend ✅
- [ ] Service créé (Root: `/`)
- [ ] VITE_API_URL configurée
- [ ] Build réussi
- [ ] Déployé sans erreur
- [ ] Logs: "built successfully"
- [ ] Application accessible
- [ ] Page login s'affiche
- [ ] Pas d'erreur console

### Liaison ✅
- [ ] CORS_ORIGIN mis à jour (backend)
- [ ] Login frontend fonctionne
- [ ] Dashboard affiche données
- [ ] Pas d'erreur CORS
- [ ] Navigation fluide
- [ ] PDF génération fonctionne

---

## 🎯 Commandes Utiles

### Copier URL Backend
```bash
# Dans Railway → Backend Service → Settings
# Cherchez: "Public Networking" → URL
```

### Copier URL Frontend
```bash
# Dans Railway → Frontend Service → Settings
# Cherchez: "Public Networking" → URL
```

### Redéployer Backend
```bash
# Railway Dashboard → Backend Service
# Cliquez: "Deploy" (bouton trois points) → "Redeploy"
```

### Voir Logs en Direct
```bash
# Railway Dashboard → Service → Logs
# Activer: "Follow logs" (en bas)
```

### Forcer Rebuild
```bash
git commit --allow-empty -m "Force rebuild"
git push origin main
```

---

## 🎉 Test Final Complet

### 1. Backend OK?
```bash
curl https://votre-backend.up.railway.app/api/health
```
→ ✅ Retourne `{"status":"OK"}`

### 2. Frontend OK?
```
https://votre-frontend.up.railway.app
```
→ ✅ Page de login affichée

### 3. Login OK?
```
admin@chantiers.com / password123
```
→ ✅ Redirection Dashboard

### 4. API OK?
```
Dashboard affiche les chantiers
```
→ ✅ Liste visible

### 5. CORS OK?
```
F12 Console: pas d'erreur rouge
```
→ ✅ Aucune erreur CORS

### 6. PDF OK?
```
Chantier → Générer PDF
```
→ ✅ PDF téléchargé

---

🎉 **Si tous les tests passent, votre application est LIVE !**

📧 **Identifiants par défaut**:
- Admin: `admin@chantiers.com` / `password123`
- Chef: `chef.dupont@chantiers.com` / `password123`
- Ouvrier: `ouvrier.martin@chantiers.com` / `password123`

🔒 **Pensez à changer les mots de passe en production !**
