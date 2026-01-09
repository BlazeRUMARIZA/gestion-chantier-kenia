# ⚡ DÉMARRAGE RAPIDE - 5 MINUTES

## 🎯 Configuration Render (2 minutes)

### 1. Backend
```
1. Ouvrir: https://dashboard.render.com/web/srv-xxxxx
2. Cliquer: Environment
3. Ajouter ces 4 variables:
```

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://gestion_chantiers_user:dE7YIepzGP2ZTUTmQkGlDlCW7iodI6u1@dpg-d5gc2p14tr6s73e82q20-a/gestion_chantiers` |
| `CORS_ORIGIN` | `https://gestion-chantier-frontend.onrender.com` |
| `JWT_SECRET` | `changez_moi_en_production_123456789` |
| `NODE_ENV` | `production` |

**Sauvegarder** → Attendre le redéploiement (2 min)

### 2. Frontend
```
1. Ouvrir: https://dashboard.render.com/static/srv-xxxxx
2. Cliquer: Environment
3. Ajouter 1 variable:
```

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://gestion-chantier-backend.onrender.com/api` |

**Sauvegarder** → Redéployer manuellement si nécessaire

---

## ✅ Test Rapide (1 minute)

### Health Check
```bash
curl https://gestion-chantier-backend.onrender.com/api/health
```

**Si ça retourne `{"success":true,...}` → ✅ Backend OK!**

---

## 🧪 Premier Test avec Postman (2 minutes)

### 1. Créer un Admin
```
POST https://gestion-chantier-backend.onrender.com/api/auth/register
Body (JSON):
{
  "nom": "Admin",
  "email": "admin@test.com",
  "password": "Admin123!",
  "role": "admin"
}
```

### 2. Se Connecter
```
POST https://gestion-chantier-backend.onrender.com/api/auth/login
Body (JSON):
{
  "email": "admin@test.com",
  "password": "Admin123!"
}
```

**Copier le `token` de la réponse!**

### 3. Tester
```
GET https://gestion-chantier-backend.onrender.com/api/auth/me
Header:
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Si ça retourne votre profil → ✅ Tout fonctionne!**

---

## 📚 Documentation Complète

- **Guide Complet:** [GUIDE_COMPLET_TESTS.md](./GUIDE_COMPLET_TESTS.md)
- **Tests Postman:** [POSTMAN_TESTS.md](./POSTMAN_TESTS.md)
- **Configuration:** [RENDER_URLS.md](./RENDER_URLS.md)
- **Résumé:** [RESUME_CONFIGURATION.md](./RESUME_CONFIGURATION.md)

---

## 🚀 C'est Tout!

**Prochaines étapes:**
1. Configurer Render (ci-dessus)
2. Tester le Health Check
3. Suivre [GUIDE_COMPLET_TESTS.md](./GUIDE_COMPLET_TESTS.md) pour les tests complets

**Besoin d'aide?** Consultez [RENDER_TROUBLESHOOTING.md](./RENDER_TROUBLESHOOTING.md)
