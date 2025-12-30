# Guide d'Installation et d'Utilisation - Frontend Gestion des Chantiers

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Démarrage](#démarrage)
5. [Structure du Projet](#structure-du-projet)
6. [Fonctionnalités](#fonctionnalités)
7. [Guide d'Utilisation](#guide-dutilisation)
8. [Dépannage](#dépannage)

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16.x ou supérieure)
- **npm** (version 7.x ou supérieure)
- Le **backend** de l'application doit être démarré et accessible

## 📦 Installation

1. **Naviguer vers le dossier frontend**
   ```bash
   cd frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

## ⚙️ Configuration

1. **Créer le fichier de configuration**
   
   Le fichier `.env` est déjà créé avec la configuration par défaut :
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. **Modifier la configuration (optionnel)**
   
   Si votre backend utilise un port différent, modifiez le fichier `.env` :
   ```
   VITE_API_URL=http://localhost:VOTRE_PORT/api
   ```

## 🚀 Démarrage

### Mode Développement

```bash
npm run dev
```

L'application sera disponible sur : **http://localhost:3000**

### Build de Production

```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`

### Aperçu de la Build de Production

```bash
npm run preview
```

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── common/         # Composants communs (Modal, Loading, etc.)
│   │   └── layout/         # Layout (Sidebar, ProtectedRoute)
│   ├── contexts/           # Context API (AuthContext)
│   ├── pages/              # Pages de l'application
│   │   ├── auth/          # Pages d'authentification
│   │   ├── dashboard/     # Tableau de bord
│   │   ├── users/         # Gestion des utilisateurs
│   │   ├── chantiers/     # Gestion des chantiers
│   │   ├── affectations/  # Gestion des affectations
│   │   ├── planning/      # Planning visuel
│   │   ├── logs/          # Historique des logs
│   │   └── profile/       # Profil utilisateur
│   ├── services/          # Services API
│   ├── utils/             # Fonctions utilitaires
│   ├── styles/            # Fichiers CSS
│   ├── App.jsx            # Composant principal
│   └── main.jsx           # Point d'entrée
├── public/                # Fichiers statiques
├── index.html             # Template HTML
├── package.json           # Dépendances
├── vite.config.js         # Configuration Vite
└── .env                   # Variables d'environnement
```

## 🎯 Fonctionnalités

### 🔐 Authentification
- ✅ Connexion sécurisée avec JWT
- ✅ Déconnexion
- ✅ Routes protégées par rôle
- ✅ Gestion de session

### 👥 Gestion des Utilisateurs (Admin)
- ✅ Liste des utilisateurs avec filtres
- ✅ Création d'utilisateurs
- ✅ Modification d'utilisateurs
- ✅ Suppression d'utilisateurs
- ✅ Statistiques utilisateurs
- ✅ Gestion des rôles (Admin, Chef, Ouvrier)

### 🏗️ Gestion des Chantiers
- ✅ Liste des chantiers avec filtres (statut, priorité)
- ✅ Création de chantiers (Admin/Chef)
- ✅ Modification de chantiers (Admin/Chef)
- ✅ Suppression de chantiers (Admin)
- ✅ Détails complets d'un chantier
- ✅ Génération de rapports PDF
- ✅ Statistiques et graphiques
- ✅ Planning visuel mensuel

### 👷 Gestion des Affectations
- ✅ Liste des affectations
- ✅ Assignation d'ouvriers aux chantiers
- ✅ Modification d'affectations
- ✅ Suppression d'affectations
- ✅ Visualisation des ouvriers disponibles
- ✅ Gestion des rôles sur chantier

### 📅 Planning
- ✅ Vue mensuelle des chantiers
- ✅ Navigation entre les mois
- ✅ Visualisation par statut et priorité
- ✅ Timeline interactive

### 📊 Dashboard
- ✅ Statistiques globales
- ✅ Graphiques (Pie chart, Bar chart)
- ✅ Actions rapides
- ✅ Vue adaptée par rôle

### 📝 Logs (Admin)
- ✅ Historique de toutes les actions
- ✅ Historique des connexions
- ✅ Filtres et recherche
- ✅ Détails complets

### 👤 Profil
- ✅ Modification des informations personnelles
- ✅ Changement de mot de passe
- ✅ Accessible à tous les utilisateurs

## 📖 Guide d'Utilisation

### Première Connexion

1. **Démarrez le backend**
   ```bash
   cd Gestion-Chantier-Backend
   npm start
   ```

2. **Démarrez le frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Accédez à l'application**
   
   Ouvrez votre navigateur : http://localhost:3000

4. **Connectez-vous avec un compte de test**
   
   **Administrateur :**
   - Email : `admin@gestion.com`
   - Mot de passe : `password`
   
   **Chef de chantier :**
   - Email : `chef@gestion.com`
   - Mot de passe : `password`
   
   **Ouvrier :**
   - Email : `ouvrier@gestion.com`
   - Mot de passe : `password`

### Navigation

#### En tant qu'Administrateur :
- **Dashboard** : Vue d'ensemble avec statistiques
- **Utilisateurs** : Gestion complète des utilisateurs
- **Chantiers** : Gestion complète des chantiers
- **Affectations** : Assignation des ouvriers
- **Planning** : Vue calendrier
- **Logs** : Historique complet
- **Profil** : Gestion du profil

#### En tant que Chef :
- **Dashboard** : Vue d'ensemble
- **Chantiers** : Création et modification de chantiers
- **Affectations** : Assignation des ouvriers
- **Planning** : Vue calendrier
- **Profil** : Gestion du profil

#### En tant qu'Ouvrier :
- **Dashboard** : Vue d'ensemble personnelle
- **Mes Chantiers** : Chantiers assignés
- **Planning** : Vue calendrier
- **Profil** : Gestion du profil

### Créer un Chantier (Admin/Chef)

1. Cliquez sur **"Chantiers"** dans le menu
2. Cliquez sur **"Nouveau Chantier"**
3. Remplissez le formulaire :
   - Nom du chantier (obligatoire)
   - Description
   - Adresse
   - Dates de début et fin (obligatoires)
   - Statut
   - Priorité
   - Chef de chantier (obligatoire)
   - Budget
4. Cliquez sur **"Enregistrer"**

### Affecter un Ouvrier (Admin/Chef)

1. Cliquez sur **"Affectations"** dans le menu
2. Cliquez sur **"Nouvelle Affectation"**
3. Sélectionnez :
   - Le chantier
   - L'ouvrier
   - Le rôle sur le chantier
   - Les dates de début et fin
   - Les heures prévues
4. Cliquez sur **"Enregistrer"**

### Télécharger un Rapport PDF

1. Allez dans la liste des chantiers
2. Cliquez sur l'icône **PDF** (📄) du chantier souhaité
3. Le rapport sera automatiquement téléchargé

### Visualiser le Planning

1. Cliquez sur **"Planning"** dans le menu
2. Naviguez entre les mois avec les boutons
3. Les chantiers sont affichés sur une timeline
4. Les couleurs indiquent le statut
5. Les bordures colorées indiquent la priorité

## 🔍 Dépannage

### L'application ne démarre pas

**Problème :** Erreur lors du `npm run dev`

**Solutions :**
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install

# Vider le cache npm
npm cache clean --force
npm install
```

### Impossible de se connecter

**Problème :** Erreur "Impossible de contacter le serveur"

**Solutions :**
1. Vérifiez que le backend est démarré :
   ```bash
   cd Gestion-Chantier-Backend
   npm start
   ```

2. Vérifiez le fichier `.env` :
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Vérifiez que le port 5000 est bien utilisé par le backend

### Erreur 401 - Non autorisé

**Problème :** Token expiré ou invalide

**Solution :**
1. Déconnectez-vous
2. Reconnectez-vous
3. Le token sera régénéré

### Les images/graphiques ne s'affichent pas

**Problème :** Chart.js ne fonctionne pas

**Solution :**
```bash
npm install chart.js react-chartjs-2
```

### Erreur CORS

**Problème :** Erreur CORS dans la console

**Solution :**
Vérifiez la configuration CORS dans le backend (`src/app.js`)

## 🛠️ Commandes Utiles

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Aperçu production
npm run preview

# Lint
npm run lint

# Nettoyage complet
rm -rf node_modules dist
npm install
```

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à :
- 💻 Desktop (>= 1024px)
- 📱 Tablette (768px - 1023px)
- 📱 Mobile (< 768px)

## 🎨 Personnalisation

### Couleurs

Modifiez les variables CSS dans `src/styles/App.css` :

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  /* ... autres couleurs */
}
```

### Logo

Remplacez le logo dans `public/` et mettez à jour `index.html`

## 📚 Technologies Utilisées

- **React 18** - Framework UI
- **React Router v6** - Routing
- **Axios** - Requêtes HTTP
- **Chart.js** - Graphiques
- **React Toastify** - Notifications
- **React Icons** - Icônes
- **Vite** - Build tool
- **CSS3** - Styling

## 🤝 Support

Pour toute question ou problème :
1. Consultez d'abord ce guide
2. Vérifiez les logs du backend
3. Vérifiez la console du navigateur (F12)

## ✅ Checklist de Déploiement

Avant de déployer en production :

- [ ] Modifier `VITE_API_URL` dans `.env` avec l'URL de production
- [ ] Exécuter `npm run build`
- [ ] Tester la build avec `npm run preview`
- [ ] Vérifier que toutes les routes fonctionnent
- [ ] Vérifier les performances
- [ ] Configurer HTTPS
- [ ] Activer la compression gzip
- [ ] Configurer le cache

## 🎉 Félicitations !

Votre application frontend est maintenant prête à l'emploi. Profitez de toutes les fonctionnalités de gestion des chantiers !
