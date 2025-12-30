# 🔧 Fix: ERR_CONNECTION_REFUSED - Frontend Railway

## ❌ Problème détecté

Le frontend essaie de se connecter à `http://localhost:5000` au lieu du backend Railway.

```
POST http://localhost:5000/api/auth/login net::ERR_CONNECTION_REFUSED
```

## ✅ Solution : Configurer VITE_API_URL

### Étape 1 : Trouver l'URL du backend Railway

1. Allez sur **Railway** : https://railway.app
2. Sélectionnez votre **projet**
3. Cliquez sur le service **Backend**
4. Dans l'onglet **"Settings"** → **"Domains"**
5. Copiez l'URL qui ressemble à : `https://xxxxx.up.railway.app`

### Étape 2 : Ajouter la variable d'environnement

1. Retournez à la liste des services
2. Cliquez sur le service **Frontend**
3. Allez dans l'onglet **"Variables"**
4. Cliquez sur **"New Variable"**
5. Ajoutez :
   ```
   Nom:    VITE_API_URL
   Valeur: https://xxxxx.up.railway.app/api
   ```
   ⚠️ Remplacez `xxxxx` par l'URL de votre backend
   ⚠️ N'oubliez pas le `/api` à la fin !

6. Cliquez sur **"Add"**

### Étape 3 : Redéployer le frontend

1. Toujours dans le service **Frontend**
2. Allez dans l'onglet **"Deployments"**
3. Cliquez sur le menu **"⋮"** du dernier déploiement
4. Cliquez sur **"Redeploy"**

### Étape 4 : Vérifier

Attendez 2-3 minutes que le déploiement se termine, puis :

1. Ouvrez l'URL du frontend Railway
2. Essayez de vous connecter avec :
   - Email: `admin@chantiers.com`
   - Mot de passe: `password123`

## 📝 Exemple de configuration

Si votre backend Railway est : `https://grand-balance-backend.up.railway.app`

Alors `VITE_API_URL` doit être : `https://grand-balance-backend.up.railway.app/api`

## 🔍 Vérification des variables

Après configuration, votre frontend Railway devrait avoir :

```env
VITE_API_URL=https://votre-backend.up.railway.app/api
PORT=8080 (fourni automatiquement par Railway)
```

## 🐛 Debug : Vérifier si le backend fonctionne

Testez d'abord que votre backend répond :

```bash
curl https://votre-backend.up.railway.app/api/health
```

Vous devriez recevoir :
```json
{
  "status": "OK",
  "timestamp": "2025-12-30T...",
  "database": "Connected"
}
```

Si cette commande échoue, le problème vient du backend, pas du frontend.

## 📚 Documentation

- Variables dans Railway : https://docs.railway.app/guides/variables
- Variables Vite : https://vitejs.dev/guide/env-and-mode.html

---

**Note** : Les variables `VITE_*` doivent être définies **avant** le build. C'est pourquoi vous devez redéployer après avoir ajouté la variable.
