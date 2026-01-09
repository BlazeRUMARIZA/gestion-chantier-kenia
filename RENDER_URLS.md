# 🌐 URLs de Déploiement Render

## 📋 Configuration des Services

### 🗄️ Base de Données PostgreSQL
```
postgresql://gestion_chantiers_user:dE7YIepzGP2ZTUTmQkGlDlCW7iodI6u1@dpg-d5gc2p14tr6s73e82q20-a/gestion_chantiers
```

**Host:** `dpg-d5gc2p14tr6s73e82q20-a`  
**Database:** `gestion_chantiers`  
**User:** `gestion_chantiers_user`  
**Password:** `dE7YIepzGP2ZTUTmQkGlDlCW7iodI6u1`

### 🔧 Backend API
**URL:** https://gestion-chantier-backend.onrender.com  
**API Base:** https://gestion-chantier-backend.onrender.com/api

### 🎨 Frontend
**URL:** https://gestion-chantier-frontend.onrender.com

---

## ⚙️ Variables d'Environnement à Configurer

### Backend (Render Web Service)
Allez dans: **Dashboard → gestion-chantier-backend → Environment**

```bash
# Base de données
DATABASE_URL=postgresql://gestion_chantiers_user:dE7YIepzGP2ZTUTmQkGlDlCW7iodI6u1@dpg-d5gc2p14tr6s73e82q20-a/gestion_chantiers

# CORS - Frontend autorisé
CORS_ORIGIN=https://gestion-chantier-frontend.onrender.com

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi

# Node Environment
NODE_ENV=production

# Port (automatique sur Render)
PORT=5000
```

### Frontend (Render Static Site)
Allez dans: **Dashboard → gestion-chantier-frontend → Environment**

```bash
# URL du Backend
VITE_API_URL=https://gestion-chantier-backend.onrender.com/api
```

---

## 🔄 Étapes de Configuration sur Render

### 1. **Configurer le Backend**
```bash
1. Ouvrir: https://dashboard.render.com
2. Sélectionner: gestion-chantier-backend
3. Aller dans: Environment
4. Ajouter les variables ci-dessus
5. Cliquer: Save Changes
6. Le service va automatiquement redéployer
```

### 2. **Configurer le Frontend**
```bash
1. Sélectionner: gestion-chantier-frontend
2. Aller dans: Environment
3. Ajouter: VITE_API_URL=https://gestion-chantier-backend.onrender.com/api
4. Cliquer: Save Changes
5. Déclencher un redéploiement manuel si nécessaire
```

### 3. **Vérifier la Communication**
```bash
# Test Backend
curl https://gestion-chantier-backend.onrender.com/api/health

# Test Frontend
curl https://gestion-chantier-frontend.onrender.com
```

---

## 🧪 Tests API avec Postman

### Configuration Postman

**1. Créer une nouvelle Collection:** `Gestion Chantiers Kenia`

**2. Variables d'environnement:**
- `base_url`: `https://gestion-chantier-backend.onrender.com/api`
- `token`: (sera rempli automatiquement après login)

**3. Headers globaux:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{token}}"
}
```

---

## 📝 Endpoints Disponibles

### 🔐 Authentication
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Obtenir le profil
- `PUT /api/auth/password` - Changer le mot de passe

### 👥 Users (Admin only)
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### 🏗️ Chantiers
- `GET /api/chantiers` - Liste des chantiers
- `GET /api/chantiers/:id` - Détails d'un chantier
- `POST /api/chantiers` - Créer un chantier
- `PUT /api/chantiers/:id` - Modifier un chantier
- `DELETE /api/chantiers/:id` - Supprimer un chantier

### 👷 Affectations
- `GET /api/affectations` - Liste des affectations
- `GET /api/affectations/:id` - Détails d'une affectation
- `POST /api/affectations` - Créer une affectation
- `PUT /api/affectations/:id` - Modifier une affectation
- `DELETE /api/affectations/:id` - Supprimer une affectation

### 📊 Logs (Admin only)
- `GET /api/logs` - Liste des logs
- `GET /api/logs/:id` - Détails d'un log

---

## 🚀 Test Rapide

### 1. Health Check
```bash
curl https://gestion-chantier-backend.onrender.com/api/health
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-01-09T12:00:00.000Z"
}
```

### 2. Créer un compte admin
```bash
curl -X POST https://gestion-chantier-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Admin",
    "email": "admin@chantier.com",
    "password": "Admin123!",
    "role": "admin"
  }'
```

### 3. Se connecter
```bash
curl -X POST https://gestion-chantier-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chantier.com",
    "password": "Admin123!"
  }'
```

**Copiez le token** de la réponse pour les prochaines requêtes!

---

## 📖 Documentation Complète

Pour plus de détails, consultez:
- [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
- [RENDER_TROUBLESHOOTING.md](./RENDER_TROUBLESHOOTING.md)
