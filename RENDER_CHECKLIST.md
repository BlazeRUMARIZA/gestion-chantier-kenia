# ✅ Checklist de Déploiement Render

Suivez cette checklist pour un déploiement sans erreur.

## 📋 Pré-déploiement

- [ ] Code poussé sur GitHub
- [ ] Compte Render créé ([render.com](https://render.com))
- [ ] JWT secret généré (32+ caractères)
- [ ] Fichiers Render présents:
  - [ ] `render.yaml`
  - [ ] `.env.render.example`
  - [ ] `backend/.env.render.example`
  - [ ] `RENDER_DEPLOYMENT_GUIDE.md`
  - [ ] `RENDER_QUICK_START.md`

## 🗄️ Base de Données

- [ ] Service MySQL créé dans Render
- [ ] Nom: `gestion-chantier-db`
- [ ] Database: `gestion_chantiers`
- [ ] Region: Frankfurt (ou proche de vous)
- [ ] Plan: Free
- [ ] Internal Database URL copiée
- [ ] Format vérifié: `mysql://user:password@host:3306/database`

## 🔧 Backend

### Création du service
- [ ] Web Service créé dans Render
- [ ] Nom: `gestion-chantier-backend`
- [ ] Dépôt GitHub connecté
- [ ] Region: Frankfurt (même que DB)
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install && npm run db:migrate`
- [ ] Start Command: `npm start`
- [ ] Plan: Free

### Variables d'environnement
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `DATABASE_URL` = `mysql://...` (de l'étape DB)
- [ ] `JWT_SECRET` = (généré, 32+ chars)
- [ ] `JWT_EXPIRES_IN` = `24h`
- [ ] `CORS_ORIGIN` = `https://gestion-chantier-frontend.onrender.com`

### Vérification
- [ ] Service déployé (status: Live)
- [ ] Health check fonctionne:
  ```bash
  curl https://gestion-chantier-backend.onrender.com/api/health
  ```
- [ ] Réponse JSON reçue avec status "OK"
- [ ] Logs backend sans erreur

## 🎨 Frontend

### Création du service
- [ ] Web Service créé dans Render
- [ ] Nom: `gestion-chantier-frontend`
- [ ] Même dépôt GitHub
- [ ] Region: Frankfurt
- [ ] Root Directory: (vide - racine)
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm run preview`
- [ ] Plan: Free

### Variables d'environnement
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `VITE_API_URL` = `https://gestion-chantier-backend.onrender.com`

### Vérification
- [ ] Service déployé (status: Live)
- [ ] URL accessible dans le navigateur
- [ ] Page de connexion s'affiche
- [ ] Pas d'erreur dans la console (F12)

## 🔗 Configuration Finale

- [ ] CORS_ORIGIN mis à jour avec l'URL exacte du frontend
- [ ] Backend redéployé après update CORS
- [ ] Test de connexion frontend → backend réussi

## 🧪 Tests Complets

### Backend API
- [ ] Health check: `GET /api/health`
  ```bash
  curl https://gestion-chantier-backend.onrender.com/api/health
  ```

- [ ] Login: `POST /api/auth/login`
  ```bash
  curl -X POST https://gestion-chantier-backend.onrender.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@chantier.com","password":"Admin123!"}'
  ```

- [ ] Réponse avec token JWT reçue

### Frontend
- [ ] Page d'accueil charge
- [ ] Connexion avec admin@chantier.com / Admin123!
- [ ] Dashboard s'affiche
- [ ] Menu de navigation fonctionne
- [ ] Chantiers listés (si données seed présentes)

## 🔐 Sécurité Post-déploiement

- [ ] Changer le mot de passe admin via l'interface
- [ ] Vérifier que HTTPS est actif (automatique sur Render)
- [ ] Sauvegarder les URLs:
  - Frontend: `_______________________________`
  - Backend: `_______________________________`
  - Database: `_______________________________`
- [ ] Documenter les credentials (coffre-fort sécurisé)

## 📊 Monitoring

- [ ] Bookmark Render Dashboard
- [ ] Vérifier les logs backend régulièrement
- [ ] Vérifier les logs frontend régulièrement
- [ ] Noter: services gratuits s'endorment après 15 min inactivité
- [ ] Configurer alertes (optionnel, plan payant)

## 🎯 Notes Importantes

### Comportement Free Plan
⚠️ Les services gratuits:
- S'endorment après 15 minutes d'inactivité
- Prennent 30-60 secondes pour se réveiller
- Ont 750h/mois (suffisant pour 1 service 24/7)
- MySQL gratuit: 1 GB, 1 mois d'essai puis $7/mois

### Limitations
- Backend: 512 MB RAM
- Frontend: 512 MB RAM
- Database: 1 GB gratuit

### Upgrade (optionnel)
Si besoin de plus de ressources:
- Starter Plan: $7/mois par service
- Pas de sommeil
- Plus de RAM et CPU

## ✨ Déploiement Terminé!

Si toutes les cases sont cochées, votre application est déployée avec succès!

### URLs à communiquer:
- **Application**: https://gestion-chantier-frontend.onrender.com
- **API**: https://gestion-chantier-backend.onrender.com

### Prochaines étapes:
1. Tester toutes les fonctionnalités
2. Inviter les utilisateurs
3. Former l'équipe
4. Monitorer l'utilisation

---

**Problèmes?** Consultez [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) section Dépannage.
