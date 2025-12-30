# 🚀 Guide de Déploiement sur Railway

## 📋 Prérequis

- Compte sur [Railway.app](https://railway.app/)
- Compte GitHub (pour déployer depuis un repo)
- Code poussé sur GitHub

## 🗂️ Structure du Projet

```
gestion-chantier-kenia/
├── backend/                    # API Backend
│   ├── src/
│   ├── server.js
│   ├── package.json
│   ├── railway.json           # ✨ Configuration Railway
│   ├── start.sh               # ✨ Script de démarrage
│   └── .env.railway.example   # ✨ Variables d'environnement
│
├── (racine = frontend)         # Application React
│   ├── src/
│   ├── package.json
│   ├── vite.config.js         # ✨ Configuration mise à jour
│   ├── railway.json           # ✨ Configuration Railway
│   └── .env.railway.example   # ✨ Variables d'environnement
```

## 📦 Étape 1 : Préparer le Repository GitHub

### 1.1 Créer le fichier `.gitignore` à la racine

```gitignore
# Dependencies
node_modules/
backend/node_modules/

# Environment variables
.env
.env.local
.env.production
backend/.env

# Logs
*.log
backend/*.log

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Test coverage
coverage/
```

### 1.2 Commit et push sur GitHub

```bash
git add .
git commit -m "Prêt pour déploiement Railway"
git push origin main
```

## 🚂 Étape 2 : Déployer le Backend

### 2.1 Créer un nouveau projet sur Railway

1. Aller sur [railway.app](https://railway.app/)
2. Cliquer sur **"New Project"**
3. Choisir **"Deploy from GitHub repo"**
4. Sélectionner votre repository **gestion-chantier-kenia**

### 2.2 Configurer le service Backend

1. Railway va détecter deux services. Sélectionner **"backend"**
2. Railway va créer un service. Cliquer sur le service créé

### 2.3 Ajouter MySQL Database

1. Dans le projet, cliquer sur **"+ New"**
2. Choisir **"Database"** → **"Add MySQL"**
3. Railway va créer une base de données MySQL
4. Attendre que la base de données soit prête

### 2.4 Configurer les variables d'environnement du Backend

1. Cliquer sur le service **backend**
2. Aller dans l'onglet **"Variables"**
3. Cliquer sur **"RAW Editor"**
4. Copier-coller ces variables :

```env
# Database (copier depuis le service MySQL)
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# JWT Secret (générer un secret fort)
JWT_SECRET=changez_moi_secret_tres_securise_12345678
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=production

# CORS (URL du frontend - sera mise à jour après)
CORS_ORIGIN=*
```

5. Cliquer sur **"Update Variables"**

### 2.5 Configurer le Build

1. Dans le service backend, aller dans **"Settings"**
2. Section **"Build"**:
   - Root Directory: `backend`
   - Build Command: Laisser vide (Railway détecte automatiquement)
   - Start Command: `bash start.sh`

### 2.6 Déployer

1. Le déploiement commence automatiquement
2. Attendre que le statut passe à **"Active"**
3. Copier l'URL publique du backend :
   - Format: `https://xxxxx.up.railway.app`
   - Exemple: `https://gestion-chantier-backend-production.up.railway.app`

### 2.7 Tester le Backend

```bash
# Tester le health check
curl https://votre-backend.up.railway.app/api/health

# Devrait retourner:
# {"status":"OK","timestamp":"...","service":"Gestion des Chantiers"}
```

## 🎨 Étape 3 : Déployer le Frontend

### 3.1 Créer un nouveau service Frontend

1. Dans le même projet Railway, cliquer sur **"+ New"**
2. Choisir **"GitHub Repo"** → Sélectionner votre repo
3. Railway va créer un nouveau service pour le frontend

### 3.2 Configurer les variables d'environnement du Frontend

1. Cliquer sur le service **frontend** (ou le nom de votre repo)
2. Aller dans l'onglet **"Variables"**
3. Ajouter ces variables :

```env
# URL du Backend (remplacer par votre URL)
VITE_API_URL=https://votre-backend.up.railway.app

# Port (Railway l'injecte automatiquement)
PORT=3000
```

4. Cliquer sur **"Update Variables"**

### 3.3 Configurer le Build du Frontend

1. Dans le service frontend, aller dans **"Settings"**
2. Section **"Build"**:
   - Root Directory: Laisser vide (racine du projet)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
   
3. Section **"Deploy"**:
   - Deploy Trigger: Activer **"Automatic deploys"**

### 3.4 Déployer

1. Le déploiement commence automatiquement
2. Attendre que le statut passe à **"Active"**
3. Copier l'URL publique du frontend :
   - Format: `https://xxxxx.up.railway.app`
   - Exemple: `https://gestion-chantier-frontend.up.railway.app`

## 🔗 Étape 4 : Lier Frontend et Backend

### 4.1 Mettre à jour CORS_ORIGIN du Backend

1. Retourner dans le service **backend**
2. Aller dans **"Variables"**
3. Modifier la variable **CORS_ORIGIN** :
   ```env
   CORS_ORIGIN=https://votre-frontend.up.railway.app
   ```
4. Cliquer sur **"Update Variables"**
5. Railway va redéployer automatiquement

### 4.2 Vérifier la connexion

1. Ouvrir l'URL du frontend dans un navigateur
2. Essayer de se connecter avec :
   - Email: `admin@chantiers.com`
   - Password: `password123`

3. Si la connexion fonctionne, le déploiement est réussi ! 🎉

## 🌐 URLs Finales

Après le déploiement, vous aurez :

```
Backend API:  https://gestion-chantier-backend-production.up.railway.app
Frontend:     https://gestion-chantier-frontend.up.railway.app

Endpoints API disponibles:
- GET  /api/health                    # Health check
- POST /api/auth/login                # Connexion
- GET  /api/chantiers                 # Liste des chantiers
- GET  /api/users                     # Liste des utilisateurs
- etc...
```

## 🔧 Configuration des Domaines Personnalisés (Optionnel)

### Ajouter un domaine personnalisé

1. Dans Railway, cliquer sur le service (backend ou frontend)
2. Aller dans **"Settings"** → **"Domains"**
3. Cliquer sur **"Custom Domain"**
4. Entrer votre domaine : `api.votredomaine.com` (backend) ou `app.votredomaine.com` (frontend)
5. Configurer les DNS chez votre registrar :
   ```
   Type: CNAME
   Name: api (ou app)
   Value: xxxxx.up.railway.app
   ```

## 🐛 Dépannage

### Le backend ne démarre pas

1. Vérifier les logs dans Railway (onglet "Logs")
2. Vérifier que les variables MySQL sont correctement référencées
3. Vérifier que `start.sh` est exécutable

### Erreur de connexion à la DB

```bash
# Dans les logs, vérifier:
- ✅ DB_HOST est correct
- ✅ DB_PASSWORD est défini
- ✅ La base MySQL est "Active"
```

### Le frontend ne charge pas

1. Vérifier que `VITE_API_URL` pointe vers le bon backend
2. Vérifier que le build s'est terminé sans erreur
3. Vérifier les logs pour les erreurs de build

### CORS Error

1. Vérifier que `CORS_ORIGIN` dans le backend contient l'URL exacte du frontend
2. Redéployer le backend après modification

## 📊 Monitoring et Logs

### Voir les logs en temps réel

1. Cliquer sur le service (backend ou frontend)
2. Aller dans l'onglet **"Logs"**
3. Les logs s'affichent en temps réel

### Métriques

1. Aller dans l'onglet **"Metrics"**
2. Voir CPU, mémoire, requêtes, etc.

## 💰 Coûts Railway

Railway offre :
- **$5 de crédit gratuit/mois** pour commencer
- Pay-as-you-go après épuisement du crédit
- Environ **$5-10/mois** pour une petite application

## 🔄 Mises à jour

Pour déployer des mises à jour :

```bash
# 1. Faire vos modifications
# 2. Commit et push
git add .
git commit -m "Mise à jour: nouvelle fonctionnalité"
git push origin main

# 3. Railway redéploie automatiquement !
```

## ✅ Checklist de Déploiement

- [ ] Repository GitHub créé et code poussé
- [ ] Projet Railway créé
- [ ] Service MySQL ajouté
- [ ] Backend déployé et "Active"
- [ ] Variables d'environnement backend configurées
- [ ] URL backend copiée
- [ ] Frontend déployé et "Active"
- [ ] Variables d'environnement frontend configurées (VITE_API_URL)
- [ ] CORS_ORIGIN mise à jour avec l'URL du frontend
- [ ] Test de connexion réussi
- [ ] URLs finales documentées

## 🎉 Félicitations !

Votre application **Gestion des Chantiers** est maintenant déployée et accessible publiquement sur Railway !

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Consulter les logs dans Railway
2. Vérifier la documentation Railway : https://docs.railway.app/
3. Vérifier ce guide de dépannage
