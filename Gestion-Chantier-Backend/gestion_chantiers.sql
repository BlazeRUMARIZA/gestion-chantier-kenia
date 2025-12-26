-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 26, 2025 at 04:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestion_chantiers`
--

-- --------------------------------------------------------

--
-- Table structure for table `affectations`
--

CREATE TABLE `affectations` (
  `id` int(11) NOT NULL,
  `chantier_id` int(11) NOT NULL,
  `ouvrier_id` int(11) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `role_sur_chantier` varchar(100) DEFAULT 'ouvrier',
  `heures_prevues` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `affectations`
--

INSERT INTO `affectations` (`id`, `chantier_id`, `ouvrier_id`, `date_debut`, `date_fin`, `role_sur_chantier`, `heures_prevues`, `created_at`, `updated_at`) VALUES
(1, 1, 3, '2024-01-15', NULL, 'maçon', 160, '2025-12-26 13:24:06', '2025-12-26 13:24:06'),
(2, 1, 4, '2024-01-15', NULL, 'charpentier', 120, '2025-12-26 13:24:06', '2025-12-26 13:24:06'),
(3, 2, 3, '2024-02-01', NULL, 'électricien', 80, '2025-12-26 13:24:06', '2025-12-26 13:24:06');

-- --------------------------------------------------------

--
-- Table structure for table `chantiers`
--

CREATE TABLE `chantiers` (
  `id` int(11) NOT NULL,
  `nom` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin_prevue` date NOT NULL,
  `date_fin_reelle` date DEFAULT NULL,
  `statut` enum('planifié','en_cours','suspendu','terminé','annulé') NOT NULL DEFAULT 'planifié',
  `budget` decimal(15,2) DEFAULT 0.00,
  `chef_id` int(11) NOT NULL,
  `priorite` enum('faible','moyenne','haute','critique') DEFAULT 'moyenne',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chantiers`
--

INSERT INTO `chantiers` (`id`, `nom`, `description`, `adresse`, `date_debut`, `date_fin_prevue`, `date_fin_reelle`, `statut`, `budget`, `chef_id`, `priorite`, `created_at`, `updated_at`) VALUES
(1, 'Construction immeuble résidentiel', 'Construction d\'un immeuble de 10 étages avec 20 appartements', '123 Avenue des Champs, Paris', '2024-01-15', '2024-12-15', NULL, 'en_cours', 2500000.00, 2, 'haute', '2025-12-26 13:24:06', '2025-12-26 13:24:06'),
(2, 'Rénovation école primaire', 'Rénovation complète des salles de classe et sanitaires', '45 Rue des Écoles, Lyon', '2024-02-01', '2024-08-01', NULL, 'planifié', 850000.00, 2, 'moyenne', '2025-12-26 13:24:06', '2025-12-26 13:24:06'),
(3, 'Pont piétonnier', 'Construction d\'un pont piétonnier sur la rivière', 'Rue de la Rivière, Bordeaux', '2023-11-01', '2024-03-01', '2024-02-28', 'terminé', 450000.00, 2, 'faible', '2025-12-26 13:24:06', '2025-12-26 13:24:06'),
(4, 'Test Chantier API', 'Chantier de test via API', '123 Rue Test API', '2025-02-01', '2025-08-31', NULL, 'planifié', 250000.00, 2, 'haute', '2025-12-26 14:01:39', '2025-12-26 14:01:39');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `niveau` enum('info','warning','error','critical') DEFAULT 'info',
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `details` text DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `method` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `action`, `niveau`, `user_id`, `ip_address`, `user_agent`, `details`, `endpoint`, `method`, `created_at`) VALUES
(1, 'Système initialisé', 'info', 1, '127.0.0.1', NULL, 'Installation initiale avec données de test', NULL, NULL, '2025-12-26 13:24:06'),
(2, 'GET /api/health - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"18ms\",\"bodySize\":92}', '/api/health', 'GET', '2025-12-26 13:54:55'),
(3, 'POST /api/auth/login - 401', 'error', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":401,\"duration\":\"69ms\",\"bodySize\":61}', '/api/auth/login', 'POST', '2025-12-26 13:55:05'),
(4, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 13:57:59'),
(5, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"203ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 13:57:59'),
(6, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:01:37'),
(7, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"295ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:01:37'),
(8, 'GET /api/health - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"2ms\",\"bodySize\":92}', '/api/health', 'GET', '2025-12-26 14:01:37'),
(9, 'GET /api/auth/profile - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"23ms\",\"bodySize\":265}', '/api/auth/profile', 'GET', '2025-12-26 14:01:37'),
(10, 'Connexion - chef', 'info', 2, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"chef.dupont@chantiers.com\",\"role\":\"chef\"}', '/api/auth/login', 'POST', '2025-12-26 14:01:38'),
(11, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"317ms\",\"bodySize\":456}', '/api/auth/login', 'POST', '2025-12-26 14:01:38'),
(12, 'Connexion - ouvrier', 'info', 3, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"ouvrier.martin@chantiers.com\",\"role\":\"ouvrier\"}', '/api/auth/login', 'POST', '2025-12-26 14:01:38'),
(13, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"323ms\",\"bodySize\":477}', '/api/auth/login', 'POST', '2025-12-26 14:01:38'),
(14, 'POST /api/auth/login - 400', 'error', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":400,\"duration\":\"4ms\",\"bodySize\":157}', '/api/auth/login', 'POST', '2025-12-26 14:01:38'),
(15, 'GET /api/users - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"45ms\",\"bodySize\":1047}', '/api/users', 'GET', '2025-12-26 14:01:38'),
(16, 'GET /api/users/stats - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"27ms\",\"bodySize\":152}', '/api/users/stats', 'GET', '2025-12-26 14:01:38'),
(17, 'Création utilisateur: testapi@chantiers.com', 'info', 1, NULL, NULL, '{\"user_id\":5,\"role\":\"ouvrier\"}', NULL, NULL, '2025-12-26 14:01:38'),
(18, 'POST /api/users - 201', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":201,\"duration\":\"52ms\",\"bodySize\":260}', '/api/users', 'POST', '2025-12-26 14:01:38'),
(19, 'GET /api/chantiers - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"97ms\",\"bodySize\":2522}', '/api/chantiers', 'GET', '2025-12-26 14:01:38'),
(20, 'GET /api/chantiers/planning - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"31ms\",\"bodySize\":503}', '/api/chantiers/planning', 'GET', '2025-12-26 14:01:39'),
(21, 'GET /api/chantiers/stats/dashboard - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"41ms\",\"bodySize\":457}', '/api/chantiers/stats/dashboard', 'GET', '2025-12-26 14:01:39'),
(22, 'Création chantier: Test Chantier API', 'info', 1, NULL, NULL, '{\"chantier_id\":4}', NULL, NULL, '2025-12-26 14:01:39'),
(23, 'POST /api/chantiers - 201', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":201,\"duration\":\"58ms\",\"bodySize\":368}', '/api/chantiers', 'POST', '2025-12-26 14:01:39'),
(24, 'GET /api/affectations - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"37ms\",\"bodySize\":1199}', '/api/affectations', 'GET', '2025-12-26 14:01:39'),
(25, 'GET /api/logs - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"43ms\",\"bodySize\":8342}', '/api/logs', 'GET', '2025-12-26 14:01:39'),
(26, 'GET /api/logs/connexions - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"26ms\",\"bodySize\":1554}', '/api/logs/connexions', 'GET', '2025-12-26 14:01:39'),
(27, 'Déconnexion', 'info', 1, NULL, NULL, '{\"action\":\"logout\"}', NULL, NULL, '2025-12-26 14:01:39'),
(28, 'POST /api/auth/logout - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"20ms\",\"bodySize\":104}', '/api/auth/logout', 'POST', '2025-12-26 14:01:39'),
(29, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:26:46'),
(30, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"298ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:26:46'),
(31, 'GET /api/auth/profile - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"7ms\",\"bodySize\":265}', '/api/auth/profile', 'GET', '2025-12-26 14:26:46'),
(32, 'Connexion - chef', 'info', 2, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"chef.dupont@chantiers.com\",\"role\":\"chef\"}', '/api/auth/login', 'POST', '2025-12-26 14:26:47'),
(33, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"341ms\",\"bodySize\":456}', '/api/auth/login', 'POST', '2025-12-26 14:26:47'),
(34, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:27:03'),
(35, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"281ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:27:03'),
(36, 'GET /api/users - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"15ms\",\"bodySize\":1269}', '/api/users', 'GET', '2025-12-26 14:27:03'),
(37, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:27:11'),
(38, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"259ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:27:11'),
(39, 'GET /api/users - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"12ms\",\"bodySize\":1269}', '/api/users', 'GET', '2025-12-26 14:27:11'),
(40, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:27:42'),
(41, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"217ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:27:42'),
(42, 'GET /api/users/stats - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"8ms\",\"bodySize\":152}', '/api/users/stats', 'GET', '2025-12-26 14:27:42'),
(43, 'Création utilisateur: newtest@chantiers.com', 'info', 1, NULL, NULL, '{\"user_id\":6,\"role\":\"ouvrier\"}', NULL, NULL, '2025-12-26 14:27:42'),
(44, 'POST /api/users - 201', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":201,\"duration\":\"25ms\",\"bodySize\":260}', '/api/users', 'POST', '2025-12-26 14:27:42'),
(45, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:27:59'),
(46, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"238ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:27:59'),
(47, 'GET /api/users/6 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"7ms\",\"bodySize\":245}', '/api/users/6', 'GET', '2025-12-26 14:27:59'),
(48, 'Modification utilisateur: newtest@chantiers.com', 'info', 1, NULL, NULL, '{\"nom\":\"Updated Test User\",\"telephone\":\"0699999999\"}', NULL, NULL, '2025-12-26 14:27:59'),
(49, 'PUT /api/users/6 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"22ms\",\"bodySize\":296}', '/api/users/6', 'PUT', '2025-12-26 14:27:59'),
(50, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:28:25'),
(51, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"237ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:28:25'),
(52, 'GET /api/chantiers - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"29ms\",\"bodySize\":3031}', '/api/chantiers', 'GET', '2025-12-26 14:28:25'),
(53, 'GET /api/chantiers/planning - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"14ms\",\"bodySize\":654}', '/api/chantiers/planning', 'GET', '2025-12-26 14:28:25'),
(54, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:29:10'),
(55, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"222ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:29:10'),
(56, 'GET /api/chantiers/stats/dashboard - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"15ms\",\"bodySize\":458}', '/api/chantiers/stats/dashboard', 'GET', '2025-12-26 14:29:10'),
(57, 'Création chantier: Nouveau Chantier Test', 'info', 1, NULL, NULL, '{\"chantier_id\":5}', NULL, NULL, '2025-12-26 14:29:10'),
(58, 'POST /api/chantiers - 201', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":201,\"duration\":\"27ms\",\"bodySize\":352}', '/api/chantiers', 'POST', '2025-12-26 14:29:10'),
(59, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:31:24'),
(60, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"168ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:31:24'),
(61, 'GET /api/chantiers/5 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"17ms\",\"bodySize\":674}', '/api/chantiers/5', 'GET', '2025-12-26 14:31:24'),
(62, 'Modification chantier: Nouveau Chantier Test', 'info', 1, NULL, NULL, '{\"statut\":\"en_cours\",\"budget\":600000}', NULL, NULL, '2025-12-26 14:31:24'),
(63, 'PUT /api/chantiers/5 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"32ms\",\"bodySize\":381}', '/api/chantiers/5', 'PUT', '2025-12-26 14:31:24'),
(64, 'GET /api/chantiers/5/pdf - 500', 'error', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":500,\"duration\":\"190ms\",\"bodySize\":134}', '/api/chantiers/5/pdf', 'GET', '2025-12-26 14:31:24'),
(65, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:32:56'),
(66, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"377ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:32:56'),
(67, 'GET /api/affectations - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"29ms\",\"bodySize\":1199}', '/api/affectations', 'GET', '2025-12-26 14:32:56'),
(68, 'GET /api/affectations/ouvriers-disponibles?chantier_id=5 - 500', 'error', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":500,\"duration\":\"12ms\",\"bodySize\":113}', '/api/affectations/ouvriers-disponibles?chantier_id=5', 'GET', '2025-12-26 14:32:56'),
(69, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:33:11'),
(70, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"186ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:33:11'),
(71, 'Affectation ouvrier au chantier 5', 'info', 1, NULL, NULL, '{\"chantier_id\":5,\"ouvrier_id\":4,\"date_debut\":\"2025-03-01\",\"role_sur_chantier\":\"électricien\",\"heures_prevues\":150}', NULL, NULL, '2025-12-26 14:33:11'),
(72, 'POST /api/affectations - 201', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":201,\"duration\":\"27ms\",\"bodySize\":264}', '/api/affectations', 'POST', '2025-12-26 14:33:11'),
(73, 'Modification affectation 4', 'info', 1, NULL, NULL, '{\"heures_prevues\":180,\"role_sur_chantier\":\"chef électricien\"}', NULL, NULL, '2025-12-26 14:33:11'),
(74, 'PUT /api/affectations/4 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"28ms\",\"bodySize\":621}', '/api/affectations/4', 'PUT', '2025-12-26 14:33:11'),
(75, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:33:40'),
(76, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"197ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:33:40'),
(77, 'GET /api/logs?limit=5 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"25ms\",\"bodySize\":1832}', '/api/logs?limit=5', 'GET', '2025-12-26 14:33:40'),
(78, 'GET /api/logs/connexions - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"14ms\",\"bodySize\":6576}', '/api/logs/connexions', 'GET', '2025-12-26 14:33:40'),
(79, 'Connexion - admin', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"email\":\"admin@chantiers.com\",\"role\":\"admin\"}', '/api/auth/login', 'POST', '2025-12-26 14:34:07'),
(80, 'POST /api/auth/login - 200', 'info', NULL, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"255ms\",\"bodySize\":453}', '/api/auth/login', 'POST', '2025-12-26 14:34:07'),
(81, 'Suppression affectation 4', 'warning', 1, NULL, NULL, '{\"affectation_id\":\"4\"}', NULL, NULL, '2025-12-26 14:34:07'),
(82, 'DELETE /api/affectations/4 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"25ms\",\"bodySize\":62}', '/api/affectations/4', 'DELETE', '2025-12-26 14:34:07'),
(83, 'Suppression chantier: Nouveau Chantier Test', 'warning', 1, NULL, NULL, '{\"chantier_id\":5}', NULL, NULL, '2025-12-26 14:34:07'),
(84, 'DELETE /api/chantiers/5 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"23ms\",\"bodySize\":58}', '/api/chantiers/5', 'DELETE', '2025-12-26 14:34:07'),
(85, 'Suppression utilisateur: newtest@chantiers.com', 'warning', 1, NULL, NULL, '{\"user_id\":6}', NULL, NULL, '2025-12-26 14:34:07'),
(86, 'DELETE /api/users/6 - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"40ms\",\"bodySize\":61}', '/api/users/6', 'DELETE', '2025-12-26 14:34:07'),
(87, 'Déconnexion', 'info', 1, NULL, NULL, '{\"action\":\"logout\"}', NULL, NULL, '2025-12-26 14:34:07'),
(88, 'POST /api/auth/logout - 200', 'info', 1, '::ffff:127.0.0.1', 'curl/7.53.1', '{\"statusCode\":200,\"duration\":\"22ms\",\"bodySize\":104}', '/api/auth/logout', 'POST', '2025-12-26 14:34:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','chef','ouvrier') NOT NULL DEFAULT 'ouvrier',
  `telephone` varchar(20) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `derniere_connexion` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `password`, `role`, `telephone`, `actif`, `derniere_connexion`, `created_at`, `updated_at`) VALUES
(1, 'Admin Principal', 'admin@chantiers.com', '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe', 'admin', '0601020304', 1, '2025-12-26 14:34:07', '2025-12-26 13:24:06', '2025-12-26 14:34:07'),
(2, 'Chef Dupont', 'chef.dupont@chantiers.com', '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe', 'chef', '0605060708', 1, '2025-12-26 14:26:47', '2025-12-26 13:24:06', '2025-12-26 14:26:47'),
(3, 'Ouvrier Martin', 'ouvrier.martin@chantiers.com', '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe', 'ouvrier', '0609101112', 1, '2025-12-26 14:01:38', '2025-12-26 13:24:06', '2025-12-26 14:01:38'),
(4, 'Ouvrier Durand', 'ouvrier.durand@chantiers.com', '$2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe', 'ouvrier', '0613141516', 1, NULL, '2025-12-26 13:24:06', '2025-12-26 13:24:06'),
(5, 'Test User API', 'testapi@chantiers.com', 'password123', 'ouvrier', '0612345678', 1, NULL, '2025-12-26 14:01:38', '2025-12-26 14:01:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affectations`
--
ALTER TABLE `affectations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `affectation_unique` (`chantier_id`,`ouvrier_id`),
  ADD KEY `affectations_ouvrier_id` (`ouvrier_id`);

--
-- Indexes for table `chantiers`
--
ALTER TABLE `chantiers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chantiers_statut` (`statut`),
  ADD KEY `chantiers_chef_id` (`chef_id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `logs_user_id` (`user_id`),
  ADD KEY `logs_created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `affectations`
--
ALTER TABLE `affectations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `chantiers`
--
ALTER TABLE `chantiers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `affectations`
--
ALTER TABLE `affectations`
  ADD CONSTRAINT `affectations_ibfk_11` FOREIGN KEY (`chantier_id`) REFERENCES `chantiers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `affectations_ibfk_12` FOREIGN KEY (`ouvrier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chantiers`
--
ALTER TABLE `chantiers`
  ADD CONSTRAINT `chantiers_ibfk_1` FOREIGN KEY (`chef_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
