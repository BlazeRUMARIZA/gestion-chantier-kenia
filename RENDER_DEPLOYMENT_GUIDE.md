# 🚀 Déploiement sur Render - Guide Complet

Ce guide vous accompagne pas à pas pour déployer votre application **Gestion de Chantier** sur Render.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Architecture de déploiement](#architecture-de-déploiement)
3. [Étape 1: Créer la base de données](#étape-1-créer-la-base-de-données)
4. [Étape 2: Déployer le Backend](#étape-2-déployer-le-backend)
5. [Étape 3: Déployer le Frontend](#étape-3-déployer-le-frontend)
6. [Étape 4: Configuration finale](#étape-4-configuration-finale)
7. [Vérification et tests](#vérification-et-tests)
8. [Dépannage](#dépannage)

---

## Prérequis

- ✅ Un compte GitHub avec votre code poussé
- ✅ Un compte Render (gratuit) - [Créer un compte](https://render.com)
- ✅ Votre code doit être dans un dépôt GitHub

## Architecture de déploiement

Votre application sera déployée en 3 services séparés sur Render:

```
┌─────────────────┐
│   Frontend      │  (Static Site ou Web Service)
│   React + Vite  │  → https://votre-app.onrender.com
└────────┬────────┘
         │
         ↓ API Calls
┌─────────────────┐
│   Backend       │  (Web Service)
│   Node.js + API │  → https://votre-api.onrender.com
└────────┬────────┘
         │
         ↓ Database Connection
┌─────────────────┐
│   Database      │  (PostgreSQL/MySQL)
│   MySQL         │
└─────────────────┘
```

---

## Étape 1: Créer la base de données

### 1.1 Créer un nouveau service MySQL

1. Connectez-vous à [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"MySQL"**
3. Remplissez les informations:
   - **Name**: `gestion-chantier-db`
   - **Database**: `gestion_chantiers`
   - **User**: `gestion_admin` (ou autre)
   - **Region**: `Frankfurt` (Europe) ou plus proche de vous
   - **Plan**: **Free** (pour commencer)

4. Cliquez sur **"Create Database"**

### 1.2 Récupérer les informations de connexion

Une fois la base créée, notez ces informations (onglet "Info"):

```
Internal Database URL: 
mysql://user:password@hostname:3306/gestion_chantiers

External Database URL:
mysql://user:password@external-hostname:3306/gestion_chantiers
```

⚠️ **Important**: Utilisez l'**Internal Database URL** pour le backend (plus rapide et gratuit).

---

## Étape 2: Déployer le Backend

### 2.1 Créer le service Backend

1. Dans Render Dashboard, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub
3. Configuration du service:

   **Basic Info:**
   - **Name**: `gestion-chantier-backend`
   - **Region**: `Frankfurt` (même région que la DB)
   - **Branch**: `main` (ou votre branche principale)
   - **Root Directory**: `backend`

   **Build & Deploy:**
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run db:migrate
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

   **Plan:**
   - Sélectionnez **Free**

4. Cliquez sur **"Advanced"** pour ajouter les variables d'environnement

### 2.2 Configurer les variables d'environnement du Backend

Dans la section "Environment Variables", ajoutez:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Mode production |
| `PORT` | `5000` | Port du serveur |
| `DATABASE_URL` | `mysql://user:pass@host/db` | URL de votre DB (étape 1.2) |
| `JWT_SECRET` | `votre-secret-32-chars-min` | Générez une clé aléatoire forte |
| `JWT_EXPIRES_IN` | `24h` | Durée de validité du token |
| `CORS_ORIGIN` | `https://your-frontend.onrender.com` | À mettre à jour après étape 3 |

**Générer un JWT_SECRET sécurisé:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Cliquez sur **"Create Web Service"**

### 2.3 Attendre le déploiement

- Le déploiement prendra 5-10 minutes
- Surveillez les logs pour détecter d'éventuelles erreurs
- Votre backend sera accessible sur: `https://gestion-chantier-backend.onrender.com`

### 2.4 Vérifier le Backend

Testez le health check:
```bash
curl https://gestion-chantier-backend.onrender.com/api/health
```

Résultat attendu:
```json
{
  "status": "OK",
  "timestamp": "2026-01-09T...",
  "database": "Connected",
  "environment": "production"
}
```

---

## Étape 3: Déployer le Frontend

### 3.1 Créer le service Frontend

1. Cliquez sur **"New +"** → **"Web Service"**
2. Sélectionnez votre dépôt GitHub
3. Configuration:

   **Basic Info:**
   - **Name**: `gestion-chantier-frontend`
   - **Region**: `Frankfurt`
   - **Branch**: `main`
   - **Root Directory**: (laisser vide - racine du projet)

   **Build & Deploy:**
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm run preview
     ```

   **Plan:**
   - **Free**

### 3.2 Variables d'environnement du Frontend

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `VITE_API_URL` | `https://gestion-chantier-backend.onrender.com` |

⚠️ **Important**: Utilisez l'URL exacte de votre backend (étape 2.3)

4. Cliquez sur **"Create Web Service"**

### 3.3 Attendre le déploiement

- Durée: 5-10 minutes
- URL finale: `https://gestion-chantier-frontend.onrender.com`

---

## Étape 4: Configuration finale

### 4.1 Mettre à jour CORS_ORIGIN du Backend

1. Retournez dans le service **Backend**
2. Allez dans **"Environment"**
3. Modifiez `CORS_ORIGIN`:
   ```
   https://gestion-chantier-frontend.onrender.com
   ```
4. Sauvegardez - le backend redémarrera automatiquement

### 4.2 Vérifier la connexion Frontend → Backend

1. Ouvrez votre frontend: `https://gestion-chantier-frontend.onrender.com`
2. Ouvrez la console du navigateur (F12)
3. Essayez de vous connecter avec:
   - Email: `admin@chantier.com`
   - Password: `Admin123!`

---

## Vérification et tests

### ✅ Backend Health Check

```bash
curl https://gestion-chantier-backend.onrender.com/api/health
```

### ✅ Test de connexion

```bash
curl -X POST https://gestion-chantier-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chantier.com","password":"Admin123!"}'
```

### ✅ Test Frontend

1. Ouvrez `https://gestion-chantier-frontend.onrender.com`
2. Vérifiez que la page de connexion s'affiche
3. Connectez-vous avec les identifiants par défaut
4. Vérifiez que le dashboard s'affiche correctement

---

## Dépannage

### ❌ Erreur 502 Bad Gateway

**Cause**: Le backend n'a pas démarré correctement

**Solutions**:
1. Vérifiez les logs du backend dans Render
2. Vérifiez que `DATABASE_URL` est correcte
3. Vérifiez que le port est bien `5000`
4. Redéployez manuellement le backend

### ❌ CORS Error dans le navigateur

**Cause**: `CORS_ORIGIN` mal configuré

**Solutions**:
1. Vérifiez que `CORS_ORIGIN` dans le backend correspond EXACTEMENT à l'URL du frontend
2. Pas de `/` à la fin de l'URL
3. Utilisez `https://` (pas `http://`)
4. Attendez 2-3 minutes après modification (le backend redémarre)

### ❌ Base de données non connectée

**Symptômes**: 
- Logs: "Unable to connect to database"
- Health check retourne une erreur

**Solutions**:
1. Vérifiez le format de `DATABASE_URL`:
   ```
   mysql://username:password@hostname:3306/database_name
   ```
2. Utilisez l'**Internal URL** (pas l'External)
3. Vérifiez que la base de données est bien démarrée dans Render
4. Testez la connexion depuis les logs du backend

### ❌ Frontend ne peut pas joindre le Backend

**Solutions**:
1. Vérifiez `VITE_API_URL` dans le frontend
2. Testez l'URL du backend directement dans le navigateur
3. Ouvrez la console (F12) et regardez les requêtes réseau
4. Vérifiez que le backend est bien en ligne (statut "Live")

### ❌ Services s'endorment (Free plan)

**Comportement normal**: 
- Les services gratuits s'endorment après 15 minutes d'inactivité
- Le premier appel prendra 30-60 secondes pour "réveiller" le service

**Solutions**:
1. Attendez simplement le réveil
2. Upgradez vers un plan payant (7$/mois par service) pour éviter l'endormissement
3. Utilisez un service de ping externe (ex: UptimeRobot)

---

## 🎯 Checklist finale

- [ ] Base de données créée et accessible
- [ ] Backend déployé et répond au health check
- [ ] Frontend déployé et accessible
- [ ] CORS_ORIGIN configuré avec l'URL du frontend
- [ ] VITE_API_URL configuré avec l'URL du backend
- [ ] Test de connexion réussi
- [ ] Dashboard accessible et fonctionnel

---

## 📚 Ressources utiles

- [Documentation Render](https://render.com/docs)
- [Render Dashboard](https://dashboard.render.com)
- [Support Render](https://render.com/support)
- [Status Render](https://status.render.com)

---

## 🔐 Sécurité - Post-déploiement

Après le déploiement, pensez à:

1. **Changer le mot de passe admin** via l'interface
2. **Générer un nouveau JWT_SECRET** et le mettre à jour dans Render
3. **Activer HTTPS** (automatique sur Render)
4. **Configurer les sauvegardes** de la base de données
5. **Surveiller les logs** régulièrement

---

## 🚀 Prochaines étapes

### Option 1: Utiliser le Blueprint (Recommandé)

1. Poussez le fichier `render.yaml` dans votre repo
2. Dans Render, créez un "Blueprint"
3. Tous les services seront créés automatiquement

### Option 2: Déploiement manuel

Suivez ce guide étape par étape (recommandé pour la première fois)

---

**Bon déploiement! 🎉**

Si vous rencontrez des problèmes, consultez la section Dépannage ou ouvrez une issue sur GitHub.
