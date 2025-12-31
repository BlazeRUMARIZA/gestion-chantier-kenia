# 🚨 DIAGNOSTIC: Backend Railway 502 Bad Gateway

## ❌ Problème détecté

Le backend Railway retourne **502 Bad Gateway**, ce qui signifie que le serveur ne démarre pas correctement.

```bash
$ curl -I https://faithful-empathy-production.up.railway.app/api/health
HTTP/1.1 502 Bad Gateway
```

## 🔍 ÉTAPE 1 : Vérifier les logs Railway

1. Allez sur **Railway** : https://railway.app
2. Cliquez sur le service **Backend** (`faithful-empathy-production`)
3. Allez dans l'onglet **"Deployments"**
4. Cliquez sur le dernier déploiement
5. Regardez les **logs** pour voir l'erreur

### Erreurs possibles à chercher :

#### A) Variables de base de données manquantes
```
Error: Please add valid MYSQLHOST in your environment
Error: Cannot connect to database
```

**Solution** : Vérifiez que ces variables existent et pointent vers MySQL :
```env
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
```

#### B) Port déjà utilisé ou mauvaise configuration
```
Error: listen EADDRINUSE: address already in use
Error: PORT is not defined
```

**Solution** : Railway fournit automatiquement `PORT`, ne le définissez pas manuellement.

#### C) Migration échoue
```
ERROR: relation "users" does not exist
Sequelize error during migration
```

**Solution** : Les tables doivent être créées par les migrations.

#### D) Module manquant
```
Error: Cannot find module 'xxx'
```

**Solution** : Vérifiez que `package.json` contient toutes les dépendances et que `npm install` s'est bien exécuté.

## 🔧 ÉTAPE 2 : Variables requises dans Railway Backend

Allez dans **Variables** du service backend et vérifiez que vous avez :

### 🔴 Variables OBLIGATOIRES :

```env
# Base de données MySQL (Railway Service Reference)
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}

# JWT
JWT_SECRET=votre_secret_jwt_production_railway_2025

# Environment
NODE_ENV=production

# CORS
CORS_ORIGIN=https://gestion-chantier-kenia-production.up.railway.app
```

### ⚠️ Important pour MySQL :

Railway doit avoir un service **MySQL** dans votre projet. Pour référencer MySQL :

1. Dans les variables backend, cliquez sur **"New Variable"**
2. Cliquez sur **"Add Reference"**
3. Sélectionnez le service **MySQL**
4. Choisissez la variable (ex: `MYSQLHOST`)
5. Cela créera automatiquement `${{MySQL.MYSQLHOST}}`

## 🔧 ÉTAPE 3 : Vérifier le fichier start.sh

Le backend utilise `start.sh` pour démarrer. Vérifiez qu'il contient :

```bash
#!/bin/bash
echo "🚀 Démarrage du backend..."
echo "📦 Exécution des migrations..."
npx sequelize-cli db:migrate
echo "✅ Migrations terminées"
echo "🚀 Démarrage du serveur..."
node server.js
```

## 🔧 ÉTAPE 4 : Vérifier railway.json

Le fichier `backend/railway.json` doit contenir :

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "bash start.sh",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🐛 ÉTAPE 5 : Debug - Tester localement avec les variables Railway

Créez un fichier `.env.test` avec les vraies valeurs Railway :

```env
MYSQLHOST=mysql.railway.internal
MYSQLPORT=3306
MYSQLDATABASE=railway
MYSQLUSER=root
MYSQLPASSWORD=vxdkYHKBSitIIGWPnWhNmpdGUmBBxxFc
JWT_SECRET=test_secret
NODE_ENV=production
CORS_ORIGIN=https://gestion-chantier-kenia-production.up.railway.app
PORT=5000
```

Puis testez localement :
```bash
cd backend
source .env.test
bash start.sh
```

Si ça marche localement mais pas sur Railway, c'est un problème de variables Railway.

## 📋 CHECKLIST de résolution

- [ ] 1. Vérifier les logs Railway backend pour voir l'erreur exacte
- [ ] 2. Vérifier que le service MySQL existe dans Railway
- [ ] 3. Vérifier que toutes les variables `${{MySQL.*}}` sont configurées
- [ ] 4. Vérifier que `JWT_SECRET` existe
- [ ] 5. Vérifier que `CORS_ORIGIN` contient l'URL du frontend
- [ ] 6. Vérifier que `NODE_ENV=production`
- [ ] 7. Redéployer après avoir ajouté/corrigé les variables

## 🎯 Actions immédiates

1. **Allez dans les logs Railway backend** et copiez l'erreur
2. **Vérifiez que MySQL est bien déployé** (status: Active)
3. **Ajoutez les variables MySQL** avec les références `${{MySQL.*}}`
4. **Redéployez** le backend

---

**Une fois que vous avez l'erreur des logs, je pourrai vous aider à la corriger !** 🚀

## 🔗 Liens utiles

- Railway Docs - Variables: https://docs.railway.app/guides/variables
- Railway Docs - Service References: https://docs.railway.app/guides/variables#service-variables
