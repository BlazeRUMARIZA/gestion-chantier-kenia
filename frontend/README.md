# Gestion des Chantiers - Frontend

Application frontend pour la gestion des chantiers de construction.

## Technologies

- React 18
- React Router v6
- Axios
- Vite
- Chart.js
- React Icons
- React Toastify

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet:

```
VITE_API_URL=http://localhost:5000/api
```

## Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## Build

```bash
npm run build
```

## Fonctionnalités

### Authentification
- Connexion/Déconnexion
- Gestion de profil
- Routes protégées par rôle

### Gestion des Utilisateurs (Admin)
- Liste des utilisateurs
- Création/Modification/Suppression
- Statistiques utilisateurs
- Filtrage par rôle

### Gestion des Chantiers
- Liste des chantiers
- Création/Modification/Suppression (Admin/Chef)
- Détails du chantier
- Statistiques et dashboard
- Planning visuel
- Génération de rapports PDF
- Filtrage par statut et priorité

### Gestion des Affectations
- Liste des affectations
- Assignation d'ouvriers aux chantiers
- Visualisation des ouvriers disponibles
- Gestion des rôles sur chantier

### Logs (Admin)
- Historique des actions
- Historique des connexions
- Filtrage et recherche

## Structure du Projet

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages de l'application
├── contexts/           # Context API (Auth, etc.)
├── services/           # Services API
├── utils/              # Utilitaires
├── styles/             # Styles CSS
└── App.jsx             # Composant principal
```

## Rôles et Permissions

### Admin
- Toutes les fonctionnalités
- Gestion des utilisateurs
- Accès aux logs
- Suppression de chantiers

### Chef
- Gestion des chantiers (création, modification)
- Gestion des affectations
- Consultation des statistiques

### Ouvrier
- Consultation des chantiers assignés
- Consultation de son profil
- Modification de son profil
