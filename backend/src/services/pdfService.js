const PDFDocument = require('pdfkit');
const moment = require('moment');
const db = require('../models');

class PdfService {
  static async generateChantierReport(chantierId) {
    try {
      const chantier = await db.Chantier.findByPk(chantierId, {
        include: [
          {
            model: db.User,
            as: 'chef',
            attributes: ['id', 'nom', 'email', 'telephone']
          },
          {
            model: db.Affectation,
            as: 'affectations',
            include: [{
              model: db.User,
              as: 'ouvrier',
              attributes: ['id', 'nom', 'email']
            }]
          }
        ]
      });
      
      if (!chantier) {
        throw new Error('Chantier non trouvé');
      }
      
      return new Promise((resolve, reject) => {
        try {
          const doc = new PDFDocument({ margin: 50 });
          const chunks = [];
          
          doc.on('data', chunk => chunks.push(chunk));
          doc.on('end', () => resolve(Buffer.concat(chunks)));
          doc.on('error', reject);
          
          // En-tête
          doc.fontSize(20)
             .text('RAPPORT DE CHANTIER', { align: 'center' });
          
          doc.moveDown();
          doc.fontSize(12)
             .text(`Généré le: ${moment().format('DD/MM/YYYY HH:mm')}`, { align: 'right' });
          
          doc.moveDown(2);
          
          // Informations du chantier
          doc.fontSize(16)
             .text(chantier.nom);
          
          doc.fontSize(12)
             .text(`Description: ${chantier.description || 'Non renseignée'}`);
          
          doc.moveDown();
          
          // Tableau des informations
          const tableData = [
            ['Adresse', chantier.adresse || 'Non renseignée'],
            ['Date de début', moment(chantier.date_debut).format('DD/MM/YYYY')],
            ['Date fin prévue', moment(chantier.date_fin_prevue).format('DD/MM/YYYY')],
            ['Statut', chantier.statut.toUpperCase()],
            ['Budget', `${parseFloat(chantier.budget || 0).toLocaleString('fr-FR')} €`],
            ['Priorité', chantier.priorite.toUpperCase()]
          ];
          
          tableData.forEach(([label, value]) => {
            doc.text(`${label}: ${value}`, { continued: false });
          });
          
          doc.moveDown();
          
          // Chef de chantier
          if (chantier.chef) {
            doc.fontSize(14)
               .text('CHEF DE CHANTIER');
            
            doc.fontSize(12)
               .text(`Nom: ${chantier.chef.nom}`);
            doc.text(`Email: ${chantier.chef.email}`);
            doc.text(`Téléphone: ${chantier.chef.telephone || 'Non renseigné'}`);
            
            doc.moveDown();
          }
          
          // Affectations
          if (chantier.affectations && chantier.affectations.length > 0) {
            doc.fontSize(14)
               .text('OUVRIERS AFFECTÉS');
            
            chantier.affectations.forEach((affectation, index) => {
              if (affectation.ouvrier) {
                doc.fontSize(12)
                   .text(`${index + 1}. ${affectation.ouvrier.nom} - ${affectation.role_sur_chantier || 'Ouvrier'} (${affectation.heures_prevues || 0} heures)`);
              }
            });
            
            doc.moveDown();
          } else {
            doc.fontSize(12)
               .text('Aucun ouvrier affecté pour le moment');
            
            doc.moveDown();
          }
          
          // Calculs
          try {
            const duree = chantier.calculerDuree();
            const retard = chantier.verifierRetard();
            const progression = chantier.calculerProgression();
            
            doc.fontSize(14)
               .text('STATISTIQUES');
            
            doc.fontSize(12)
               .text(`Durée prévue: ${duree} jours`);
            doc.text(`Progression: ${progression}%`);
            
            if (retard.en_retard) {
              doc.fillColor('red')
                 .text(`Retard: ${retard.jours_retard} jours`)
                 .fillColor('black');
            } else {
              doc.fillColor('green')
                 .text('Pas de retard')
                 .fillColor('black');
            }
          } catch (calcError) {
            console.error('Erreur lors du calcul des statistiques:', calcError);
            doc.fontSize(12)
               .text('Statistiques non disponibles');
          }
          
          doc.end();
        } catch (error) {
          console.error('Erreur lors de la génération du PDF:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du chantier:', error);
      throw error;
    }
  }
  
  static async generateStatisticsReport() {
    const stats = await db.sequelize.query(`
      SELECT 
        COUNT(*) as total_chantiers,
        SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as chantiers_en_cours,
        SUM(CASE WHEN statut = 'terminé' THEN 1 ELSE 0 END) as chantiers_termines,
        SUM(CASE WHEN statut = 'planifié' THEN 1 ELSE 0 END) as chantiers_planifies,
        AVG(budget) as budget_moyen
      FROM chantiers
    `, { type: db.sequelize.QueryTypes.SELECT });
    
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text('RAPPORT STATISTIQUES', { align: 'center' });
        
        doc.moveDown(2);
        
        if (stats.length > 0) {
          const data = stats[0];
          
          doc.fontSize(16)
             .font('Helvetica-Bold')
             .text('Aperçu général');
          
          doc.fontSize(12)
             .font('Helvetica')
             .text(`Total chantiers: ${data.total_chantiers}`);
          doc.text(`Chantiers en cours: ${data.chantiers_en_cours}`);
          doc.text(`Chantiers terminés: ${data.chantiers_termines}`);
          doc.text(`Chantiers planifiés: ${data.chantiers_planifies}`);
          doc.text(`Budget moyen: ${parseFloat(data.budget_moyen || 0).toLocaleString('fr-FR')} €`);
        }
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PdfService;