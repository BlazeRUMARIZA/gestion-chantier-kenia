# 🔧 Fix: CORS Policy Error - Railway Backend

## ❌ Problème détecté

```
Access to XMLHttpRequest at 'https://faithful-empathy-production.up.railway.app/api/auth/login' 
from origin 'https://gestion-chantier-kenia-production.up.railway.app' 
has been blocked by CORS policy
```

## ✅ Solution : Configurer CORS_ORIGIN

### Étape 1 : Ajouter la variable CORS_ORIGIN dans le backend

1. Allez sur **Railway** : https://railway.app
2. Sélectionnez votre **projet**
3. Cliquez sur le service **Backend** (`faithful-empathy-production`)
4. Allez dans l'onglet **"Variables"**
5. Ajoutez cette variable :

```
Nom:    CORS_ORIGIN
Valeur: https://gestion-chantier-kenia-production.up.railway.app
```

⚠️ **Important** : Pas de `/` à la fin de l'URL !

### Étape 2 : Vérifier les autres variables backend

Assurez-vous que votre backend Railway a toutes ces variables :

```env
# Base de données MySQL (Railway les fournit automatiquement)
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}

# Ou utiliser l'URL complète (Railway la fournit aussi)
DATABASE_URL=${{MySQL.DATABASE_URL}}

# JWT Secret (à créer manuellement)
JWT_SECRET=votre_super_secret_jwt_key_change_this_in_production_railway_2025
JWT_EXPIRE=7d

# Server
PORT=${{PORT}}
NODE_ENV=production

# CORS (à créer manuellement)
CORS_ORIGIN=https://gestion-chantier-kenia-production.up.railway.app
```

### Étape 3 : Redéployer le backend

1. Toujours dans le service **Backend**
2. Allez dans l'onglet **"Deployments"**
3. Cliquez sur le menu **"⋮"** du dernier déploiement
4. Cliquez sur **"Redeploy"**

### Étape 4 : Tester

Attendez 2-3 minutes, puis :

1. Ouvrez votre frontend : `https://gestion-chantier-kenia-production.up.railway.app`
2. Essayez de vous connecter avec :
   - Email: `admin@chantiers.com`
   - Mot de passe: `password123`

## 📝 Résumé des URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://gestion-chantier-kenia-production.up.railway.app |
| **Backend** | https://faithful-empathy-production.up.railway.app |

## 🔍 Variables à vérifier

### Frontend (gestion-chantier-kenia-production)
```env
VITE_API_URL=https://faithful-empathy-production.up.railway.app/api
PORT=8080
```

### Backend (faithful-empathy-production)
```env
CORS_ORIGIN=https://gestion-chantier-kenia-production.up.railway.app
JWT_SECRET=votre_secret_fort_et_unique
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
```

## 🐛 Debug : Vérifier que le backend accepte les requêtes

Après avoir configuré CORS_ORIGIN et redéployé, testez :

```bash
# Test du health endpoint
curl https://faithful-empathy-production.up.railway.app/api/health

# Test avec l'origin (devrait retourner les headers CORS)
curl -H "Origin: https://gestion-chantier-kenia-production.up.railway.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://faithful-empathy-production.up.railway.app/api/auth/login -v
```

Vous devriez voir dans la réponse :
```
Access-Control-Allow-Origin: https://gestion-chantier-kenia-production.up.railway.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 📚 Explication CORS

CORS (Cross-Origin Resource Sharing) est une sécurité du navigateur qui empêche un site web d'accéder à une API sur un autre domaine.

- **Frontend** : `gestion-chantier-kenia-production.up.railway.app`
- **Backend** : `faithful-empathy-production.up.railway.app`

Ce sont deux domaines différents, donc le backend doit explicitement autoriser le frontend via `CORS_ORIGIN`.

## ⚠️ Important

- Ne mettez **jamais** de `/` à la fin de `CORS_ORIGIN`
- `CORS_ORIGIN` doit être **exactement** l'URL du frontend
- Après avoir ajouté une variable, vous **devez** redéployer le service

## 🎉 Une fois configuré

Votre application devrait fonctionner complètement :
- ✅ Frontend peut contacter le backend
- ✅ Connexion avec admin@chantiers.com / password123
- ✅ Toutes les fonctionnalités disponibles

---

**Prochaine étape** : Configurez `CORS_ORIGIN` dans Railway backend et redéployez ! 🚀
