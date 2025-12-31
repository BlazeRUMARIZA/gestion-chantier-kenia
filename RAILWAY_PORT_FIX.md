# 🔥 SOLUTION FINALE: Backend Railway Port 5000 vs 8080

## ❌ Problème identifié

Les logs Railway montrent :

```
🚀 Serveur démarré sur le port 5000
Stopping Container  ← Container s'arrête immédiatement
```

**Railway arrête le container** car le serveur écoute sur le port **5000** mais Railway attend qu'il écoute sur le port que Railway fournit (généralement automatique via la variable `PORT`).

## 🔍 Cause racine

Railway ne fournit pas automatiquement la variable `PORT` au backend, ou le backend ne peut pas la lire.

## ✅ SOLUTION 1 : Générer un domaine public (RECOMMANDÉ)

Railway injecte automatiquement `PORT` **seulement si vous avez un domaine public**.

### Étapes :

1. Allez sur **Railway** : https://railway.app
2. Cliquez sur le service **Backend** (`faithful-empathy-production`)
3. Onglet **Settings** > **Networking**
4. Sous **"Public Networking"**, cliquez sur **"Generate Domain"**
5. Railway va :
   - Générer un domaine : `https://faithful-empathy-production.up.railway.app`
   - Injecter automatiquement la variable `PORT`
6. **Attendez le redéploiement** (automatique)
7. Le serveur devrait maintenant démarrer sur le bon port

### Vérification :

Après redéploiement, dans les logs vous devriez voir :
```
🚀 Serveur démarré sur le port XXXX  ← Port fourni par Railway
```

Le container ne devrait plus s'arrêter.

## ✅ SOLUTION 2 : Ajouter manuellement la variable PORT

Si la solution 1 ne fonctionne pas :

1. Railway > Backend > **Variables**
2. Cliquez sur **"New Variable"**
3. Ajoutez :
   ```
   Variable: PORT
   Value: 8080
   ```
4. Cliquez sur **"Add"**
5. Railway redéploiera automatiquement

### Vérification :

Logs devraient montrer :
```
🚀 Serveur démarré sur le port 8080
```

## ✅ SOLUTION 3 : Vérifier que le domaine backend existe

Le domaine `https://faithful-empathy-production.up.railway.app` doit exister.

1. Railway > Backend > **Settings** > **Domains**
2. Si vide, cliquez sur **"Generate Domain"**
3. Copiez l'URL générée
4. Mettez à jour **Frontend Variables** :
   ```
   VITE_API_URL=https://nouvelle-url-backend.up.railway.app/api
   ```
5. Redéployez le frontend

## 🔍 Diagnostic après correction

Testez le backend :

```bash
# Test health check
curl https://faithful-empathy-production.up.railway.app/api/health

# Devrait retourner
{
  "status": "OK",
  "timestamp": "...",
  "database": "Connected"
}
```

Si vous obtenez 502, retournez voir les logs Railway.

## 📋 Checklist complète

- [ ] 1. Backend a un domaine public généré dans Settings > Networking
- [ ] 2. Variable `PORT` est fournie automatiquement par Railway (vérifier dans Variables)
- [ ] 3. Dans les logs : "Serveur démarré sur le port XXXX" (pas 5000)
- [ ] 4. Container ne s'arrête plus après le démarrage
- [ ] 5. `curl https://backend-url/api/health` retourne 200 OK
- [ ] 6. Frontend `VITE_API_URL` pointe vers la bonne URL backend
- [ ] 7. Backend `CORS_ORIGIN` contient l'URL du frontend

## 🎯 Résumé des URLs

| Service | Variable | Valeur attendue |
|---------|----------|-----------------|
| **Backend** | Domaine public | `https://faithful-empathy-production.up.railway.app` |
| **Backend** | `PORT` | Fourni automatiquement par Railway (8080 ou autre) |
| **Backend** | `CORS_ORIGIN` | `https://gestion-chantier-kenia-production.up.railway.app` |
| **Frontend** | `VITE_API_URL` | `https://faithful-empathy-production.up.railway.app/api` |

## ⚠️ Important

Railway **doit** avoir :
1. Un service **MySQL** actif
2. Un domaine public pour le **Backend**
3. Un domaine public pour le **Frontend**
4. Les variables correctement configurées

Sans domaine public, Railway ne peut pas router les requêtes vers votre application.

## 🚀 Prochaine étape

Après avoir généré le domaine public ou ajouté la variable PORT :
1. Attendez le redéploiement (2-3 minutes)
2. Vérifiez les logs : le serveur doit démarrer sans s'arrêter
3. Testez : `curl https://backend-url/api/health`
4. Si 200 OK → Testez le frontend
5. Si 502 → Envoyez-moi les nouveaux logs

---

**La clé est le domaine public Railway. Sans lui, pas de PORT automatique !** 🔑
