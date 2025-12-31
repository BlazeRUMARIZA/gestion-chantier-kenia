#!/bin/bash

# ============================================
# Script de correction des mots de passe non cryptés
# ============================================

echo "🔐 Correction des mots de passe non cryptés dans Railway MySQL..."

# Informations de connexion Railway
MYSQL_HOST="metro.proxy.rlwy.net"
MYSQL_PORT="23926"
MYSQL_USER="root"
MYSQL_PASSWORD="vxdkYHKBSitIIGWPnWhNmpdGUmBBxxFc"
MYSQL_DATABASE="railway"

echo "📡 Connexion à Railway MySQL..."

# Script SQL pour crypter les mots de passe
# Note: $2a$10$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe = password123 crypté
SQL_SCRIPT="
-- Mise à jour des utilisateurs avec mots de passe en clair
UPDATE users 
SET password = '\$2a\$10\$CPYAcZKNsK5qGD9ihXUg..MOlvpJDr3zcJcxNIYFiUZYl7mOxMxhe'
WHERE password = 'password123';

-- Afficher les utilisateurs mis à jour
SELECT id, nom, email, 
  CASE 
    WHEN password LIKE '\$2a\$%' THEN '✅ Crypté'
    ELSE '❌ EN CLAIR'
  END as statut_password
FROM users;
"

# Exécuter le script
echo "$SQL_SCRIPT" | mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Mots de passe corrigés avec succès!"
    echo ""
    echo "ℹ️  Tous les utilisateurs avec 'password123' en clair ont maintenant un hash bcrypt"
    echo "🔑 Ils peuvent se connecter avec: password123"
else
    echo "❌ Erreur lors de la correction des mots de passe"
    exit 1
fi

echo ""
echo "🎉 Terminé!"
