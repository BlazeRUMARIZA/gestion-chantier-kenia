-- ============================================
-- Script d'insertion des données initiales
-- Base de données Railway: railway
-- ============================================

-- Nettoyage des données existantes (optionnel)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE affectations;
TRUNCATE TABLE logs;
TRUNCATE TABLE chantiers;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Insertion des utilisateurs
-- ============================================
-- Mot de passe pour tous: password123
INSERT INTO `users` (`id`, `nom`, `email`, `password`, `role`, `telephone`, `actif`, `derniere_connexion`, `created_at`, `updated_at`) VALUES
(1, 'Admin Principal', 'admin@chantiers.com', '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe', 'admin', '0601020304', 1, NULL, NOW(), NOW()),
(2, 'Chef Dupont', 'chef.dupont@chantiers.com', '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe', 'chef', '0605060708', 1, NULL, NOW(), NOW()),
(3, 'Ouvrier Martin', 'ouvrier.martin@chantiers.com', '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe', 'ouvrier', '0609101112', 1, NULL, NOW(), NOW()),
(4, 'Ouvrier Durand', 'ouvrier.durand@chantiers.com', '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe', 'ouvrier', '0613141516', 1, NULL, NOW(), NOW()),
(5, 'Test User API', 'testapi@chantiers.com', 'password123', 'ouvrier', '0612345678', 1, NULL, NOW(), NOW());

-- ============================================
-- Insertion des chantiers
-- ============================================
INSERT INTO `chantiers` (`id`, `nom`, `description`, `adresse`, `date_debut`, `date_fin_prevue`, `date_fin_reelle`, `statut`, `budget`, `chef_id`, `priorite`, `created_at`, `updated_at`) VALUES
(1, 'Construction immeuble résidentiel', 'Construction d\'un immeuble de 10 étages avec 20 appartements', '123 Avenue des Champs, Paris', '2024-01-15', '2024-12-15', NULL, 'en_cours', 2500000.00, 2, 'haute', NOW(), NOW()),
(2, 'Rénovation école primaire', 'Rénovation complète des salles de classe et sanitaires', '45 Rue des Écoles, Lyon', '2024-02-01', '2024-08-01', NULL, 'planifié', 850000.00, 2, 'moyenne', NOW(), NOW()),
(3, 'Pont piétonnier', 'Construction d\'un pont piétonnier sur la rivière', 'Rue de la Rivière, Bordeaux', '2023-11-01', '2024-03-01', '2024-02-28', 'terminé', 450000.00, 2, 'faible', NOW(), NOW()),
(4, 'Test Chantier API', 'Chantier de test via API', '123 Rue Test API', '2025-02-01', '2025-08-31', NULL, 'planifié', 250000.00, 2, 'haute', NOW(), NOW());

-- ============================================
-- Insertion des affectations
-- ============================================
INSERT INTO `affectations` (`id`, `chantier_id`, `ouvrier_id`, `date_debut`, `date_fin`, `role_sur_chantier`, `heures_prevues`, `created_at`, `updated_at`) VALUES
(1, 1, 3, '2024-01-15', NULL, 'maçon', 160, NOW(), NOW()),
(2, 1, 4, '2024-01-15', NULL, 'charpentier', 120, NOW(), NOW()),
(3, 2, 3, '2024-02-01', NULL, 'électricien', 80, NOW(), NOW());

-- ============================================
-- Insertion d'un log initial
-- ============================================
INSERT INTO `logs` (`id`, `action`, `niveau`, `user_id`, `ip_address`, `user_agent`, `details`, `endpoint`, `method`, `created_at`) VALUES
(1, 'Système initialisé sur Railway', 'info', 1, '0.0.0.0', NULL, 'Installation initiale avec données de test', NULL, NULL, NOW());

-- ============================================
-- Reset des AUTO_INCREMENT
-- ============================================
ALTER TABLE users AUTO_INCREMENT = 6;
ALTER TABLE chantiers AUTO_INCREMENT = 5;
ALTER TABLE affectations AUTO_INCREMENT = 4;
ALTER TABLE logs AUTO_INCREMENT = 2;

-- Fin du script
SELECT 'Données insérées avec succès!' AS message;
