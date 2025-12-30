# 🚂 Guide de Configuration Manuelle Railway

## ⚠️ Railway Détecte 2 Services

Railway détecte automatiquement 2 services dans votre repo:
1. **Backend** (dossier `/backend`)
2. **Frontend** (racine `/`)

**Important**: Vous devez créer les 2 services manuellement !

---

## 📦 SERVICE 1 : Backend API

### 1️⃣ Créer le Service Backend

1. Dans Railway Dashboard → **New** → **Empty Service**
2. Nommer: `gestion-chantier-backend`
3. **Settings** → **Source** → Connecter votre repo GitHub
4. **Root Directory**: `/backend` ⚠️ IMPORTANT
5. **Branch**: `main`

### 2️⃣ Ajouter la Base de Données MySQL

1. Dans le même projet Railway → **New** → **Database** → **Add MySQL**
2. La base de données sera automatiquement créée
3. Railway génère automatiquement les variables: `MYSQLHOST`, `MYSQLPORT`, etc.

### 3️⃣ Variables d'Environnement Backend

Dans **Backend Service** → **Variables** → **Raw Editor**, collez:

```env
# Database (utiliser les références Railway)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# JWT Configuration
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi_123456789
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=production

# CORS (sera mis à jour après déploiement du frontend)
CORS_ORIGIN=*
```

**Note**: Changez `JWT_SECRET` par une valeur unique et sécurisée !

### 4️⃣ Configuration Build Backend

Dans **Settings** → **Build**:
- ✅ **Root Directory**: `/backend`
- ✅ **Build Command**: Auto-détecté (npm install)
- ✅ **Start Command**: `bash start.sh`

### 5️⃣ Déployer le Backend

1. Cliquez sur **Deploy**
2. Attendez que le build soit terminé (2-3 minutes)
3. Vérifiez les logs: migrations doivent s'exécuter
4. Copiez l'URL générée: `https://xxxxx.up.railway.app`

### 6️⃣ Tester le Backend

Ouvrez dans votre navigateur:
```
https://votre-backend.up.railway.app/api/health
```

Vous devriez voir:
```json
{
  "status": "OK",
  "message": "API is running",
  "timestamp": "2025-12-30T..."
}
```

---

## 🎨 SERVICE 2 : Frontend React

### 1️⃣ Créer le Service Frontend

1. Dans Railway Dashboard → **New** → **Empty Service**
2. Nommer: `gestion-chantier-frontend`
3. **Settings** → **Source** → Connecter le MÊME repo GitHub
4. **Root Directory**: `/` (racine) ⚠️ IMPORTANT
5. **Branch**: `main`

### 2️⃣ Variables d'Environnement Frontend

Dans **Frontend Service** → **Variables** → **Raw Editor**, collez:

```env
# Backend API URL (remplacez par votre URL backend)
VITE_API_URL=https://votre-backend.up.railway.app

# Port (Railway l'injecte automatiquement, mais on peut forcer)
PORT=3000
```

**⚠️ IMPORTANT**: Remplacez `votre-backend.up.railway.app` par l'URL réelle de votre backend !

### 3️⃣ Configuration Build Frontend

Dans **Settings** → **Build**:
- ✅ **Root Directory**: `/` (racine, pas `/frontend` !)
- ✅ **Build Command**: `npm ci && npm run build`
- ✅ **Start Command**: `npm run start`

### 4️⃣ Déployer le Frontend

1. Cliquez sur **Deploy**
2. Attendez que le build soit terminé (3-5 minutes)
3. Copiez l'URL générée: `https://xxxxx.up.railway.app`

### 5️⃣ Mettre à Jour le CORS Backend

Retournez dans **Backend Service** → **Variables**:
```env
CORS_ORIGIN=https://votre-frontend.up.railway.app
```

Remplacez par l'URL exacte du frontend (sans `/` à la fin).

Le backend redémarrera automatiquement.

---

## 🔗 Structure Finale

```
Railway Project: Gestion Chantier Kenya

├── 📦 gestion-chantier-backend
│   ├── Root Directory: /backend
│   ├── URL: https://backend-xxx.up.railway.app
│   └── Variables: DB_*, JWT_*, CORS_ORIGIN
│
├── 🗄️ MySQL Database
│   └── Automatiquement lié au backend
│
└── 🎨 gestion-chantier-frontend
    ├── Root Directory: /
    ├── URL: https://frontend-xxx.up.railway.app
    └── Variables: VITE_API_URL, PORT
```

---

## ✅ Checklist de Déploiement

### Backend
- [ ] Service créé avec root directory `/backend`
- [ ] MySQL database ajoutée
- [ ] Variables DB_* configurées avec références `${{MySQL.*}}`
- [ ] JWT_SECRET changé (valeur sécurisée)
- [ ] Start command: `bash start.sh`
- [ ] Déployé avec succès
- [ ] `/api/health` retourne 200 OK
- [ ] URL backend copiée

### Frontend
- [ ] Service créé avec root directory `/` (racine)
- [ ] VITE_API_URL configurée avec URL backend
- [ ] Build command: `npm ci && npm run build`
- [ ] Start command: `npm run start`
- [ ] Déployé avec succès
- [ ] Application accessible dans le navigateur
- [ ] URL frontend copiée

### Liaison CORS
- [ ] CORS_ORIGIN backend mis à jour avec URL frontend
- [ ] Backend redéployé automatiquement
- [ ] Login fonctionne depuis le frontend

---

## 🐛 Dépannage

### ❌ "Application failed to respond" (Frontend)

**Causes possibles**:

1. **Root Directory incorrect**
   - ✅ Doit être `/` (racine)
   - ❌ Pas `/frontend`

2. **Build échoue**
   - Vérifiez les logs de build
   - Assurez-vous que `npm run build` fonctionne localement
   - Vérifiez que `dist/` est créé

3. **Start command incorrect**
   - ✅ `npm run start`
   - ❌ Pas `npm run preview` (car $PORT ne fonctionne pas)

4. **Port non disponible**
   - Railway injecte automatiquement `PORT`
   - Le script `start` utilise `${PORT:-3000}`

**Solution**:
```bash
# Dans Settings → Build
Root Directory: /
Build Command: npm ci && npm run build
Start Command: npm run start
```

### ❌ "CORS Error" (Frontend ne peut pas appeler Backend)

**Cause**: `CORS_ORIGIN` backend ne correspond pas à l'URL frontend

**Solution**:
1. Backend Variables → `CORS_ORIGIN`
2. Mettre EXACTEMENT l'URL frontend (sans `/` à la fin)
3. Exemple: `https://gestion-chantier-frontend.up.railway.app`

### ❌ "Cannot connect to database" (Backend)

**Causes possibles**:

1. **MySQL service pas démarré**
   - Vérifiez que MySQL est "Active" dans Railway

2. **Variables DB incorrectes**
   - Utilisez les références Railway: `${{MySQL.MYSQLHOST}}`
   - Ne copiez PAS les valeurs en dur

3. **Migrations échouent**
   - Vérifiez les logs: `Railway Logs` → Backend
   - Cherchez les erreurs Sequelize

**Solution**:
```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
```

### ❌ Railway détecte 2 services mais n'en affiche qu'1

**Cause**: Railway auto-détecte mais ne crée qu'un seul service

**Solution**: Créez les 2 services MANUELLEMENT comme décrit ci-dessus

---

## 🎯 Tester l'Application Complète

### 1. Tester le Backend
```bash
# Health check
curl https://votre-backend.up.railway.app/api/health

# Login test
curl -X POST https://votre-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chantiers.com","password":"password123"}'
```

### 2. Tester le Frontend
1. Ouvrez `https://votre-frontend.up.railway.app`
2. Login avec: `admin@chantiers.com` / `password123`
3. Vérifiez que les chantiers s'affichent
4. Testez la génération de PDF

---

## 📊 Monitoring

### Logs Backend
```
Railway Dashboard → Backend Service → Logs
```

Recherchez:
- ✅ `Database connected successfully`
- ✅ `Server running on port XXXX`
- ✅ `Executing migration 20240101000001`

### Logs Frontend
```
Railway Dashboard → Frontend Service → Logs
```

Recherchez:
- ✅ `> vite build` (pendant le build)
- ✅ `Built successfully` 
- ✅ `Preview server started`

---

## 💰 Coûts Railway

- **Plan Gratuit**: $5 de crédit/mois
- **Backend + MySQL + Frontend**: ~$10-15/mois
- **Recommandation**: Passer au plan Hobby ($5/mois fixe)

---

## 🔄 Mise à Jour

Après chaque `git push`:
1. Railway redéploie automatiquement
2. Backend: Migrations automatiques
3. Frontend: Rebuild automatique

---

## 📞 Support

**Problème persiste?**
- Railway Logs (dans chaque service)
- [Railway Docs](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)

**Variables manquantes?**
- Vérifiez `.env.railway.example` dans le repo
- Comparez avec vos variables Railway

---

✅ **Bon déploiement !**
