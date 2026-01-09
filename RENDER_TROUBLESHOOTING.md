# 🔧 Guide de Dépannage Render

Solutions aux problèmes courants lors du déploiement sur Render.

## 📑 Table des Matières

1. [Erreurs Backend](#erreurs-backend)
2. [Erreurs Frontend](#erreurs-frontend)
3. [Erreurs Base de Données](#erreurs-base-de-données)
4. [Erreurs CORS](#erreurs-cors)
5. [Problèmes de Performance](#problèmes-de-performance)
6. [Erreurs de Build](#erreurs-de-build)

---

## Erreurs Backend

### ❌ 502 Bad Gateway

**Symptômes:**
- Le frontend affiche "502 Bad Gateway"
- L'URL du backend ne répond pas

**Causes possibles:**
1. Le backend n'a pas démarré
2. Le port n'est pas correctement configuré
3. DATABASE_URL incorrect

**Solutions:**

#### 1. Vérifier les logs
```
Render Dashboard → Backend Service → Logs
```
Cherchez:
- "Server started" ✅
- "Database connected" ✅
- Erreurs de connexion DB ❌

#### 2. Vérifier le port
```bash
# Dans Render Environment Variables
PORT=5000  # Doit être défini
```

#### 3. Vérifier DATABASE_URL
```bash
# Format correct:
mysql://username:password@hostname:3306/database_name

# Utilisez l'INTERNAL URL (pas external)
# Exemple:
mysql://root:abc123@dpg-xxx.frankfurt-postgres.render.com:3306/gestion_chantiers
```

#### 4. Tester manuellement
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Si timeout ou 502:
# → Backend pas démarré
# → Vérifier logs et DATABASE_URL
```

### ❌ Build Failed

**Symptômes:**
- Déploiement échoue pendant la phase de build
- Logs montrent "Build failed"

**Solutions:**

#### 1. Vérifier Build Command
```bash
# Doit être:
npm install && npm run db:migrate

# PAS:
npm install  # Sans migrations
```

#### 2. Vérifier Root Directory
```
Root Directory: backend

# PAS root ou src/backend
```

#### 3. Vérifier package.json
```json
{
  "scripts": {
    "start": "node server.js",
    "migrate": "sequelize-cli db:migrate"
  }
}
```

### ❌ Database Connection Failed

**Symptômes:**
- Logs: "Unable to connect to database"
- Logs: "ECONNREFUSED"
- Health check retourne erreur DB

**Solutions:**

#### 1. Format DATABASE_URL
```bash
# ✅ CORRECT:
mysql://user:pass@host:3306/database

# ❌ INCORRECT:
mysql://user:pass@host/database  # Port manquant
mysql://user@host:3306/database  # Password manquant
```

#### 2. Utiliser Internal URL
```
Dans Render DB → Info:
✅ Internal Database URL: mysql://...frankfurt-postgres.render.com...
❌ External Database URL: mysql://...render.com...

Utilisez TOUJOURS l'Internal URL pour le backend
```

#### 3. Vérifier la DB existe
```
Render Dashboard → Database → Info
Status: Available ✅
```

#### 4. Test de connexion
```bash
# Dans backend/test-db.js
const mysql = require('mysql2/promise');

async function testDB() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('✅ Connected!');
  await connection.end();
}

testDB();

# Puis dans Render:
# Start Command: node test-db.js
```

---

## Erreurs Frontend

### ❌ Blank Page / White Screen

**Symptômes:**
- Page blanche
- Pas de contenu affiché
- Console vide ou erreurs

**Solutions:**

#### 1. Vérifier les logs Render
```
Frontend Service → Logs
```
Cherchez:
- "Preview server started" ✅
- Erreurs de build ❌

#### 2. Vérifier Build Command
```bash
# Doit être:
npm install && npm run build

# Vérifier que dist/ est créé
```

#### 3. Vérifier Start Command
```bash
# Doit être:
npm run preview

# Dans package.json:
{
  "scripts": {
    "preview": "vite preview --host 0.0.0.0 --port ${PORT:-4173}"
  }
}
```

#### 4. Vérifier console navigateur
```
F12 → Console
```
Cherchez:
- Erreurs de chargement
- 404 sur assets
- Erreurs CORS

### ❌ API Calls Failed / 404

**Symptômes:**
- Frontend charge mais ne peut pas se connecter
- Console: "Failed to fetch"
- Console: "404 Not Found"

**Solutions:**

#### 1. Vérifier VITE_API_URL
```bash
# Dans Render Frontend Environment:
VITE_API_URL=https://your-backend.onrender.com

# ✅ CORRECT:
VITE_API_URL=https://gestion-chantier-backend.onrender.com

# ❌ INCORRECT:
VITE_API_URL=http://...  # HTTP au lieu de HTTPS
VITE_API_URL=https://.../  # Slash final
VITE_API_URL=localhost  # Localhost au lieu de l'URL Render
```

#### 2. Tester le backend directement
```bash
# Ouvrir dans le navigateur:
https://your-backend.onrender.com/api/health

# Doit retourner JSON:
{"status":"OK",...}
```

#### 3. Rebuild le frontend
```
Frontend Service → Manual Deploy → Deploy latest commit
```

⚠️ **Important**: Les variables `VITE_*` sont compilées au build time, pas au runtime. Changer `VITE_API_URL` nécessite un rebuild!

---

## Erreurs Base de Données

### ❌ Migrations échouent

**Symptômes:**
- Build réussit mais service crash
- Logs: "Migration failed"
- Logs: Table doesn't exist

**Solutions:**

#### 1. Vérifier sequelize-cli
```json
// package.json
{
  "dependencies": {
    "sequelize": "^6.32.1",
    "sequelize-cli": "^6.6.0"  // Doit être présent
  }
}
```

#### 2. Vérifier .sequelizerc
```javascript
// backend/.sequelizerc
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'config', 'config.json'),
  'models-path': path.resolve('src', 'models'),
  'migrations-path': path.resolve('src', 'migrations'),
  'seeders-path': path.resolve('src', 'seeders')
};
```

#### 3. Vérifier config.json
```json
{
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "mysql",
    "dialectOptions": {
      "ssl": {
        "require": false
      }
    }
  }
}
```

#### 4. Lancer migrations manuellement
```bash
# Build Command:
cd backend && npm install && npx sequelize-cli db:migrate --env production
```

### ❌ Database Connection Timeout

**Symptômes:**
- Connexion DB timeout
- Logs: "ETIMEDOUT"

**Solutions:**

#### 1. Vérifier région
```
Backend Service Region: Frankfurt
Database Region: Frankfurt

→ Doivent être IDENTIQUES pour connexion rapide
```

#### 2. Augmenter timeout
```javascript
// backend/src/config/database.js
{
  dialectOptions: {
    connectTimeout: 60000  // 60 secondes
  }
}
```

#### 3. Vérifier DB est active
```
Database Dashboard → Status: Available
```

---

## Erreurs CORS

### ❌ CORS Policy Error

**Symptômes:**
- Console navigateur: "CORS policy blocked"
- Console: "No 'Access-Control-Allow-Origin' header"

**Solutions:**

#### 1. Vérifier CORS_ORIGIN exact
```bash
# Backend Environment Variables:
CORS_ORIGIN=https://gestion-chantier-frontend.onrender.com

# ✅ CORRECT - URL exacte du frontend
# ❌ INCORRECT:
CORS_ORIGIN=*  # Trop permissif
CORS_ORIGIN=https://gestion-chantier-frontend.onrender.com/  # Slash final
CORS_ORIGIN=http://...  # HTTP au lieu de HTTPS
```

#### 2. Vérifier code CORS backend
```javascript
// backend/src/app.js
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

#### 3. Redéployer le backend
```
Après changement CORS_ORIGIN:
→ Render redéploie automatiquement
→ Attendre 2-3 minutes
```

#### 4. Vider le cache navigateur
```
Chrome: Ctrl + Shift + Delete
Firefox: Ctrl + Shift + Delete
```

### ❌ Preflight Request Failed

**Symptômes:**
- Console: "Preflight request failed"
- OPTIONS requests échouent

**Solutions:**

#### 1. Ajouter headers CORS
```javascript
// backend/src/app.js
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Problèmes de Performance

### ⚠️ Service Slow / Cold Start

**Symptômes:**
- Premier chargement très lent (30-60s)
- "Spinning up service" dans logs

**Causes:**
- Normal sur Free Plan
- Service s'endort après 15 min d'inactivité

**Solutions:**

#### 1. Attendre patiemment
```
Le premier appel réveille le service
→ 30-60 secondes normales
→ Ensuite rapide tant qu'utilisé
```

#### 2. Keep-alive service (Gratuit)
```bash
# Utiliser cron-job.org ou UptimeRobot
# Ping toutes les 10 minutes:
https://your-backend.onrender.com/api/health
```

#### 3. Upgrade to Starter Plan
```
7$/mois par service
→ Pas de sommeil
→ Plus de ressources
```

### ⚠️ Out of Memory

**Symptômes:**
- Service crash
- Logs: "JavaScript heap out of memory"

**Solutions:**

#### 1. Free Plan: 512 MB RAM
```
Optimiser:
- Réduire dépendances
- Optimiser requêtes DB
- Limiter cache
```

#### 2. Upgrade plan
```
Starter: 2 GB RAM - 7$/mois
Standard: 4 GB RAM - 25$/mois
```

---

## Erreurs de Build

### ❌ npm install failed

**Symptômes:**
- Build échoue
- Logs: "npm ERR!"

**Solutions:**

#### 1. Vérifier package.json
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 2. Lock file
```bash
# Assurez-vous que package-lock.json est dans git
git add package-lock.json
git commit -m "Add package-lock"
git push
```

#### 3. Clear build cache
```
Service → Settings → Clear Build Cache → Deploy
```

### ❌ Vite build failed

**Symptômes:**
- Build frontend échoue
- Logs: "vite build failed"

**Solutions:**

#### 1. Vérifier vite.config.js
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

#### 2. Test local
```bash
npm run build
# Doit créer dist/ sans erreur
```

---

## 🆘 Besoin d'aide supplémentaire?

### Logs Render
```
Service → Logs
→ Télécharger ou copier pour analyse
```

### Support Render
- Email: help@render.com
- Community: https://community.render.com
- Status: https://status.render.com

### Documentation
- Render Docs: https://render.com/docs
- Node.js Guide: https://render.com/docs/deploy-node-express-app
- MySQL Guide: https://render.com/docs/databases

---

## ✅ Checklist de Dépannage

Avant de demander de l'aide:

- [ ] Logs consultés (Backend & Frontend)
- [ ] Variables d'environnement vérifiées
- [ ] URLs testées directement (health check)
- [ ] Console navigateur vérifiée (F12)
- [ ] Services status: "Live"
- [ ] Database status: "Available"
- [ ] Build cache cleared et rebuild
- [ ] 5 minutes d'attente après changement

---

**La plupart des problèmes sont liés à:**
1. Variables d'environnement mal configurées (80%)
2. URLs incorrectes (10%)
3. Migrations DB (5%)
4. Autres (5%)

**Vérifiez d'abord ces 3 points!** ☝️
