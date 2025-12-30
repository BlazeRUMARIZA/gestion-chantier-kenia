#!/bin/bash

# ============================================
# Script d'insertion des données dans Railway MySQL
# ============================================

echo "🚀 Insertion des données dans Railway MySQL..."

# Informations de connexion Railway
MYSQL_HOST="metro.proxy.rlwy.net"
MYSQL_PORT="23926"
MYSQL_USER="root"
MYSQL_PASSWORD="vxdkYHKBSitIIGWPnWhNmpdGUmBBxxFc"
MYSQL_DATABASE="railway"

# Vérification de la connexion
echo "📡 Test de connexion à Railway MySQL..."
mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD -e "SELECT 1" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Connexion réussie!"
    echo ""
    echo "📦 Insertion des données..."
    
    # Exécution du script SQL
    mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < seed-data.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Données insérées avec succès!"
        echo ""
        echo "📊 Vérification des données insérées:"
        mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE -e "
            SELECT 'Users:' AS Table_Info, COUNT(*) AS Count FROM users
            UNION ALL
            SELECT 'Chantiers:', COUNT(*) FROM chantiers
            UNION ALL
            SELECT 'Affectations:', COUNT(*) FROM affectations
            UNION ALL
            SELECT 'Logs:', COUNT(*) FROM logs;
        "
    else
        echo "❌ Erreur lors de l'insertion des données"
        exit 1
    fi
else
    echo "❌ Impossible de se connecter à Railway MySQL"
    echo "Vérifiez les identifiants de connexion"
    exit 1
fi

echo ""
echo "🎉 Terminé!"
