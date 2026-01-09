# 🚀 Quick Start - Déploiement Render

Guide rapide pour déployer en 15 minutes.

## 📝 Avant de commencer

1. Créez un compte sur [Render.com](https://render.com)
2. Poussez votre code sur GitHub
3. Préparez 3 valeurs:
   - Un JWT secret (32+ caractères aléatoires)
   - Le nom de votre projet
   - Votre email admin

---

## 🗄️ Étape 1: Base de données (2 min)

1. Render Dashboard → **New +** → **MySQL**
2. Remplissez:
   - Name: `gestion-chantier-db`
   - Database: `gestion_chantiers`
   - Region: `Frankfurt`
   - Plan: **Free**
3. Cliquez **Create Database**
4. Copiez **Internal Database URL** (exemple: `mysql://user:pass@host/db`)

---

## 🔧 Étape 2: Backend (5 min)

1. **New +** → **Web Service** → Connectez GitHub
2. Configuration:
   ```
   Name: gestion-chantier-backend
   Region: Frankfurt
   Root Directory: backend
   Build: npm install && npm run db:migrate
   Start: npm start
   Plan: Free
   ```

3. **Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<votre-url-db-étape-1>
   JWT_SECRET=<générez-32-chars-min>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://gestion-chantier-frontend.onrender.com
   ```

4. **Create Web Service** → Attendez le déploiement (~5 min)

5. Testez: `https://gestion-chantier-backend.onrender.com/api/health`

---

## 🎨 Étape 3: Frontend (5 min)

1. **New +** → **Web Service** → Même repo GitHub
2. Configuration:
   ```
   Name: gestion-chantier-frontend
   Region: Frankfurt
   Root Directory: (vide)
   Build: npm install && npm run build
   Start: npm run preview
   Plan: Free
   ```

3. **Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=10000
   VITE_API_URL=https://gestion-chantier-backend.onrender.com
   ```

4. **Create Web Service** → Attendez le déploiement (~5 min)

---

## ✅ Étape 4: Test final (2 min)

1. Ouvrez: `https://gestion-chantier-frontend.onrender.com`
2. Connectez-vous:
   - Email: `admin@chantier.com`
   - Password: `Admin123!`
3. Si ça marche → **C'est fini! 🎉**

---

## ⚠️ Problèmes courants

### CORS Error
→ Vérifiez que `CORS_ORIGIN` (backend) = URL exacte du frontend

### 502 Bad Gateway
→ Vérifiez les logs backend → Vérifiez `DATABASE_URL`

### Frontend ne charge pas
→ Vérifiez que `VITE_API_URL` = URL exacte du backend

---

## 🎯 URLs finales

Sauvegardez ces URLs:

- **Frontend**: `https://gestion-chantier-frontend.onrender.com`
- **Backend**: `https://gestion-chantier-backend.onrender.com`
- **API Health**: `https://gestion-chantier-backend.onrender.com/api/health`

---

## 📖 Plus de détails

Consultez [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) pour:
- Instructions détaillées
- Dépannage approfondi
- Configuration avancée
- Sécurité

---

**Temps total: ~15 minutes** ⏱️
