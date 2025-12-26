const db = require('./src/models');

async function showData() {
  try {
    console.log('📊 DONNÉES DE LA BASE DE DONNÉES\n');
    console.log('='.repeat(80));
    
    // Utilisateurs
    console.log('\n👥 UTILISATEURS:');
    console.log('-'.repeat(80));
    const users = await db.User.findAll({
      attributes: ['id', 'nom', 'email', 'role', 'actif'],
      raw: true
    });
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé');
    } else {
      console.table(users);
    }
    
    // Chantiers
    console.log('\n🏗️  CHANTIERS:');
    console.log('-'.repeat(80));
    const chantiers = await db.Chantier.findAll({
      attributes: ['id', 'nom', 'statut', 'priorite', 'date_debut', 'date_fin_prevue', 'budget'],
      include: [{
        model: db.User,
        as: 'chef',
        attributes: ['nom']
      }],
      raw: true
    });
    
    if (chantiers.length === 0) {
      console.log('❌ Aucun chantier trouvé');
    } else {
      console.table(chantiers);
    }
    
    // Affectations
    console.log('\n👷 AFFECTATIONS:');
    console.log('-'.repeat(80));
    const affectations = await db.Affectation.findAll({
      attributes: ['id', 'date_debut', 'date_fin', 'role_sur_chantier', 'heures_prevues'],
      include: [
        {
          model: db.Chantier,
          as: 'chantier',
          attributes: ['nom']
        },
        {
          model: db.User,
          as: 'ouvrier',
          attributes: ['nom']
        }
      ],
      raw: true
    });
    
    if (affectations.length === 0) {
      console.log('❌ Aucune affectation trouvée');
    } else {
      console.table(affectations);
    }
    
    // Statistiques
    console.log('\n📈 STATISTIQUES:');
    console.log('-'.repeat(80));
    console.log(`Total utilisateurs: ${users.length}`);
    console.log(`  - Admins: ${users.filter(u => u.role === 'admin').length}`);
    console.log(`  - Chefs: ${users.filter(u => u.role === 'chef').length}`);
    console.log(`  - Ouvriers: ${users.filter(u => u.role === 'ouvrier').length}`);
    console.log(`Total chantiers: ${chantiers.length}`);
    console.log(`Total affectations: ${affectations.length}`);
    console.log('='.repeat(80));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

showData();
