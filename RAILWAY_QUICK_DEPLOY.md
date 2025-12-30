# 🚀 Déploiement Rapide sur Railway

## 📦 Fichiers de Configuration Créés

### Backend (`/backend`)
- ✅ `railway.json` - Configuration Railway
- ✅ `start.sh` - Script de démarrage avec migrations
- ✅ `.env.railway.example` - Template des variables d'environnement

### Frontend (`/racine`)
- ✅ `railway.json` - Configuration Railway
- ✅ `.env.railway.example` - Template des variables d'environnement
- ✅ `vite.config.js` - Mise à jour pour production
- ✅ `package.json` - Script preview mis à jour

## ⚡ Déploiement en 5 Minutes

### 1️⃣ Push sur GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2️⃣ Backend sur Railway
1. Créer projet → GitHub repo
2. Ajouter MySQL Database
3. Variables backend :
```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
JWT_SECRET=changez_moi_secret_securise_12345
JWT_EXPIRES_IN=24h
NODE_ENV=production
CORS_ORIGIN=*
```
4. Settings → Root Directory: `backend`
5. Settings → Start Command: `bash start.sh`
6. Copier URL backend

### 3️⃣ Frontend sur Railway
1. + New → GitHub Repo
2. Variables frontend :
```env
VITE_API_URL=https://votre-backend.up.railway.app
PORT=3000
```
3. Settings → Build: `npm install && npm run build`
4. Settings → Start: `npm run preview`
5. Copier URL frontend

### 4️⃣ Finaliser
1. Mettre à jour `CORS_ORIGIN` du backend avec l'URL du frontend
2. Tester: ouvrir URL frontend et se connecter

## 🌐 URLs Résultantes

```
Backend:  https://xxxxx.up.railway.app/api
Frontend: https://xxxxx.up.railway.app
```

## 🔑 Identifiants par défaut

```
Admin:
Email: admin@chantiers.com
Password: password123

Chef:
Email: chef.dupont@chantiers.com
Password: password123

Ouvrier:
Email: ouvrier.martin@chantiers.com
Password: password123
```

## 📖 Guide Complet

Voir [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md) pour le guide détaillé avec dépannage.

## ✅ Vérification

```bash
# Backend
curl https://votre-backend.up.railway.app/api/health

# Devrait retourner:
# {"status":"OK","timestamp":"...","service":"Gestion des Chantiers"}
```

## 🎉 C'est fait !

Votre application est maintenant en production sur Railway ! 🚀
