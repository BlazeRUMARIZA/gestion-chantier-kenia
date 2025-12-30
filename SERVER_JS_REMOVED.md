# ✅ server.js Supprimé - Configuration Mise à Jour

## 🔄 Changements Appliqués

### 1. ✅ `/server.js` Supprimé
**Fichier**: `/server.js` (serveur Express frontend)
**Action**: Supprimé

### 2. ✅ `railway.json` Mis à Jour
**Changement**:
```json
// AVANT:
"startCommand": "node server.js"

// APRÈS:
"startCommand": "npm run preview"
```

### 3. ✅ `package.json` Nettoyé
**Changements**:
- ❌ Retiré: `"express": "^4.22.1"` (dépendances)
- ❌ Retiré: `"start": "node server.js"` (scripts)
- ✅ Gardé: `"preview": "vite preview --host 0.0.0.0 --port ${PORT:-4173}"`

---

## 🚀 Nouvelle Configuration Railway Frontend

### Build
```bash
npm install && npm run build
```

### Deploy
```bash
npm run preview
```

**Port**: Railway utilise `$PORT` (variable d'environnement)

---

## ⚠️ Points à Surveiller

### 1. Variable PORT sur Railway
Assurez-vous que Railway injecte la variable `PORT`. Si problème, vérifiez les logs.

### 2. Vite Preview Limitations
`vite preview` est un outil de développement, pas 100% production-ready. Si vous rencontrez des problèmes:
- Timeouts
- Memory issues
- Port binding problems

→ Il faudra reconsidérer Express ou utiliser un vrai serveur static (Nginx, etc.)

---

## 📋 Configuration Railway Frontend

### Variables d'Environnement
```env
VITE_API_URL=https://votre-backend.up.railway.app
PORT=4173
NODE_ENV=production
```

### Settings → Build
```
Root Directory: /
Build Command: npm install && npm run build
Start Command: npm run preview
```

---

## ✅ Fichiers Modifiés

| Fichier | Action | Statut |
|---------|--------|--------|
| `/server.js` | ❌ Supprimé | Removed |
| `railway.json` | ✅ Modifié | `npm run preview` |
| `package.json` | ✅ Modifié | Express retiré |

---

## 🧪 Test Local

```bash
# Build
npm run build

# Test preview
PORT=4173 npm run preview

# Vérifier
curl http://localhost:4173
```

---

## 🚀 Prochaines Étapes

```bash
# 1. Commit les changements
git add .
git commit -m "Remove server.js, use vite preview for Railway"
git push origin main

# 2. Railway redéploiera automatiquement

# 3. Vérifier les logs Railway
# Cherchez: "Preview server started at"
```

---

## 🎯 Structure Finale

```
gestion-chantier-kenia/
├── railway.json           → startCommand: npm run preview
├── package.json           → preview script avec PORT
├── vite.config.js         → preview config
├── src/                   → Code React
├── dist/                  → Build React
│
└── backend/
    ├── server.js          → Backend API
    ├── railway.json       → startCommand: bash start.sh
    └── start.sh           → Migrations + node server.js
```

---

## 💡 Si Problèmes sur Railway

Si `vite preview` pose problème:

### Option 1: Revenir à Express
Recréer `server.js` simple et utiliser `node server.js`

### Option 2: Static File Server
Utiliser `serve` ou `http-server`:
```bash
npm install -g serve
serve -s dist -l 4173
```

### Option 3: Nginx (Advanced)
Utiliser Dockerfile avec Nginx

---

**Pour l'instant, testez avec `vite preview` et surveillez les logs Railway !**
