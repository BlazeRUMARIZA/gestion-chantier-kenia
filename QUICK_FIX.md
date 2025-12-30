# 🔥 SOLUTION EXPRESS - Railway Prêt

## ✅ Changements Appliqués

1. ✅ **server.js** créé (Express server)
2. ✅ **package.json** - Express ajouté, start: `node server.js`
3. ✅ **railway.json** - Builder par défaut, startCommand: `node server.js`
4. ✅ **backend/railway.json** - Simplifié (builder par défaut)
5. ✅ **Testé localement** - Build et serveur fonctionnent ✓

---

## 🚀 3 Étapes pour Déployer

### 1. Push
```bash
git add .
git commit -m "Fix Railway: Express server production-ready"
git push origin main
```

### 2. Configure Railway Frontend

**Settings → Build**:
```
Root Directory: /
Start Command: node server.js
```

**Variables**:
```env
VITE_API_URL=https://votre-backend.up.railway.app
PORT=4173
NODE_ENV=production
```

### 3. Deploy
Cliquez **Redeploy** (si service existe) ou **Deploy** (nouveau service)

---

## 📖 Documentation Complète

- **START_HERE.md** - Guide complet étape par étape
- **RAILWAY_EXPRESS_SOLUTION.md** - Explications techniques
- **RAILWAY_MANUAL_SETUP.md** - Configuration détaillée

---

## ✅ Test Local Réussi

```bash
✓ npm run build - OK
✓ node server.js - OK
✓ curl http://localhost:4173 - OK
```

---

## 🎯 Après Déploiement

**Test Backend**:
```
https://votre-backend.up.railway.app/api/health
→ {"status":"OK"}
```

**Test Frontend**:
```
https://votre-frontend.up.railway.app
→ Page login
```

**Login**:
```
admin@chantiers.com / password123
```

---

🚀 **Push maintenant !**
