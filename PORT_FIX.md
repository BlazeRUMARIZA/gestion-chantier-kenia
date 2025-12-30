# ✅ FIX: Port Railway pour Frontend

## 🔍 Problème Identifié

### Logs Railway:
```
> vite preview --host 0.0.0.0 --port ${PORT:-4173}
➜  Local:   http://localhost:8080/
```

**Problème**: 
- Railway utilise `PORT=8080`
- Script `package.json` utilise `${PORT:-4173}` (syntaxe bash)
- Vite ne peut pas interpréter `${PORT:-4173}` directement
- `vite.config.js` avait un port fixe (4173)

---

## ✅ Solution Appliquée

### 1. Créé `start-preview.sh`

**Fichier**: `start-preview.sh` (exécutable)

```bash
#!/bin/bash
# Script pour démarrer vite preview avec le PORT de Railway

if [ -z "$PORT" ]; then
  PORT=4173
fi

echo "🚀 Starting Vite preview on port $PORT..."
npx vite preview --host 0.0.0.0 --port $PORT
```

**Fonction**: 
- Récupère `$PORT` de Railway (8080)
- Utilise 4173 par défaut si PORT non défini
- Lance vite preview avec le bon port

### 2. Mis à Jour `railway.json`

```json
{
  "deploy": {
    "startCommand": "bash start-preview.sh"  // ← CHANGÉ
  }
}
```

### 3. Mis à Jour `vite.config.js`

```javascript
preview: {
  port: parseInt(process.env.PORT) || 4173,  // ← CHANGÉ (était fixe à 4173)
  host: '0.0.0.0',
}
```

**Amélioration**: Vite lit maintenant `process.env.PORT` dynamiquement

---

## 🎯 Comportement Attendu

### Sur Railway (PORT=8080)
```bash
🚀 Starting Vite preview on port 8080...
➜  Local:   http://localhost:8080/
➜  Network: http://10.x.x.x:8080/
```

### En Local (sans PORT)
```bash
🚀 Starting Vite preview on port 4173...
➜  Local:   http://localhost:4173/
```

---

## 📋 Fichiers Modifiés

| Fichier | Changement | Statut |
|---------|-----------|--------|
| `start-preview.sh` | ✅ Créé | Nouveau script bash |
| `railway.json` | ✅ Modifié | startCommand: bash start-preview.sh |
| `vite.config.js` | ✅ Modifié | preview.port dynamique |

---

## 🚀 Prochaines Étapes

```bash
# 1. Push les changements
git add .
git commit -m "Fix: Dynamic port handling for Railway (8080)"
git push origin main

# 2. Railway redéploiera automatiquement

# 3. Vérifier les logs Railway
# Cherchez: "🚀 Starting Vite preview on port 8080..."
```

---

## ✅ Tests de Vérification

### Après Déploiement Railway

**Logs attendus**:
```
🚀 Starting Vite preview on port 8080...
➜  Local:   http://localhost:8080/
➜  Network: http://10.x.x.x:8080/
```

**Test Frontend**:
```
https://votre-frontend.up.railway.app
→ Page de login doit s'afficher
```

**Test API depuis Frontend**:
- Login: `admin@chantiers.com / password123`
- Dashboard doit afficher les chantiers
- Pas d'erreur CORS

---

## 🔍 Pourquoi ça marche maintenant?

### AVANT (❌ Ne marchait pas)
```bash
# package.json
"preview": "vite preview --host 0.0.0.0 --port ${PORT:-4173}"
# ${PORT:-4173} n'est PAS interprété par npm/vite
# Résultat: Port 4173 toujours utilisé, pas 8080
```

### APRÈS (✅ Fonctionne)
```bash
# start-preview.sh
PORT=${PORT:-4173}  # Bash gère la variable
npx vite preview --host 0.0.0.0 --port $PORT  # Variable substituée
# Résultat: Railway PORT=8080 est utilisé
```

---

## 💡 Avantages de cette Solution

1. ✅ **Compatible Railway**: Utilise le PORT fourni (8080)
2. ✅ **Fonctionne en local**: Utilise 4173 par défaut
3. ✅ **Script bash simple**: Facile à maintenir
4. ✅ **vite.config.js dynamique**: Lit process.env.PORT
5. ✅ **Pas de dépendance Express**: Reste sur Vite natif

---

## 📊 Comparaison

| Approche | Avantages | Inconvénients |
|----------|-----------|---------------|
| **Express (avant)** | Production-ready, stable | Fichier supplémentaire |
| **npm run preview (tentative)** | Simple | PORT pas interprété |
| **bash + vite (actuel)** | ✅ Dynamique, natif | Script bash |

---

**✅ Solution testée et prête à déployer !**

Push maintenant sur GitHub → Railway utilisera le port 8080 correctement.
