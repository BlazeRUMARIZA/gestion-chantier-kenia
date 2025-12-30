# ⚠️ IMPORTANT - Structure du Projet

## 📁 DEUX server.js - C'est NORMAL !

### `/server.js` (Racine)
**Rôle**: Serveur Express pour le **FRONTEND**
**Utilisé par**: Railway Frontend Service
**Fonction**: Sert les fichiers React compilés depuis `/dist`
**Port**: 4173
**Démarrage**: `node server.js`

```javascript
// Serve les fichiers statiques React
app.use(express.static(path.join(__dirname, 'dist')));
// SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

### `/backend/server.js`
**Rôle**: Serveur Express pour le **BACKEND API**
**Utilisé par**: Railway Backend Service
**Fonction**: API REST (chantiers, users, auth, etc.)
**Port**: 5000 (ou PORT Railway)
**Démarrage**: `node server.js` (appelé par `start.sh`)

```javascript
// API avec Sequelize, JWT, etc.
const app = require('./src/app');
const db = require('./src/models');
```

---

## 🏗️ Architecture Railway

```
┌─────────────────────────────────────┐
│  Frontend Service (Root: /)        │
│  ├─ npm run build → dist/          │
│  └─ node server.js → serve dist/   │ ← UTILISE /server.js
└─────────────────────────────────────┘
             ↓ API calls
┌─────────────────────────────────────┐
│  Backend Service (Root: /backend)  │
│  ├─ bash start.sh                  │
│  │  ├─ migrations                  │
│  │  └─ node server.js → API        │ ← UTILISE /backend/server.js
│  └─ MySQL Database                 │
└─────────────────────────────────────┘
```

---

## ⚠️ SI VOUS SUPPRIMEZ `/server.js`

### Conséquences:
- ❌ Frontend Railway Service ne démarrera pas
- ❌ Erreur: "Cannot find module './server.js'"
- ❌ "Application failed to respond"

### Alternative (si vraiment supprimé):
Revenir à `vite preview` dans `railway.json`:
```json
{
  "deploy": {
    "startCommand": "npm run preview"
  }
}
```

Mais on a justement changé pour Express car `vite preview` causait des problèmes !

---

## ✅ RECOMMANDATION

**NE PAS SUPPRIMER `/server.js`**

C'est la solution qui fonctionne pour Railway. Les deux fichiers ont des rôles différents :
- Frontend → `/server.js`
- Backend → `/backend/server.js`

---

## 📋 Fichiers Railway

### Frontend (`railway.json` racine)
```json
{
  "build": {
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "node server.js"  // ← UTILISE /server.js
  }
}
```

### Backend (`backend/railway.json`)
```json
{
  "deploy": {
    "startCommand": "bash start.sh"  // ← start.sh appelle backend/server.js
  }
}
```

---

## 🎯 Structure Projet Finale

```
gestion-chantier-kenia/
├── server.js                  ← Frontend Express (PORT 4173)
├── package.json               ← Frontend deps
├── railway.json               ← Frontend Railway config
├── vite.config.js
├── src/                       ← Code React
├── dist/                      ← Build React (créé par npm run build)
│
└── backend/
    ├── server.js              ← Backend API (PORT 5000)
    ├── start.sh               ← Migrations + démarrage
    ├── railway.json           ← Backend Railway config
    ├── package.json           ← Backend deps
    └── src/                   ← Code API
        ├── app.js
        ├── models/
        ├── controllers/
        └── routes/
```

---

## 💡 Clarification

Si vous trouvez confus d'avoir deux `server.js`, vous pouvez renommer :
- `/server.js` → `/frontend-server.js` OU `/serve-dist.js`
- Puis modifier `railway.json`: `"startCommand": "node frontend-server.js"`

Mais ce n'est pas nécessaire - c'est une structure standard pour les projets fullstack.

---

**Conclusion**: Les deux `server.js` sont nécessaires et ont des rôles différents. Ne supprimez pas `/server.js` sauf si vous voulez changer toute l'approche du frontend.
