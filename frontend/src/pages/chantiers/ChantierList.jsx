import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chantierService } from '../../services/chantierService';
import { toast } from 'react-toastify';
import { handleApiError, getStatusLabel, getStatusColor, getPriorityLabel, getPriorityColor, formatDate, formatCurrency } from '../../utils/helpers';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiTool, FiSearch, FiCalendar, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import PageHeader from '../../components/common/PageHeader';

const ChantierList = () => {
  const { hasRole } = useAuth();
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, chantierId: null });

  useEffect(() => {
    fetchChantiers();
  }, []);

  const fetchChantiers = async () => {
    try {
      setLoading(true);
      const response = await chantierService.getAllChantiers();
      // Le backend renvoie { success, data: [...] } directement
      const chantiers = response.data || response.chantiers || [];
      console.log('Chantiers loaded:', chantiers.length);
      setChantiers(chantiers);
    } catch (error) {
      console.error('Fetch chantiers error:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (chantierId) => {
    setDeleteConfirm({ isOpen: true, chantierId });
  };

  const confirmDelete = async () => {
    try {
      await chantierService.deleteChantier(deleteConfirm.chantierId);
      toast.success('Chantier supprimé avec succès');
      fetchChantiers();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const handleDownloadPdf = async (chantierId, chantierNom) => {
    try {
      const blob = await chantierService.generatePdfReport(chantierId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${chantierNom.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Rapport PDF téléchargé');
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const filteredChantiers = chantiers.filter((chantier) => {
    const matchesSearch = chantier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chantier.adresse && chantier.adresse.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || chantier.statut === statusFilter;
    const matchesPriority = !priorityFilter || chantier.priorite === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <PageHeader
        icon={FiTool}
        title="Gestion des Chantiers"
        description="Gérez tous vos chantiers en cours et planifiés"
        actions={
          <>
            <Link to="/planning" className="btn btn-secondary">
              <FiCalendar /> Planning
            </Link>
            {hasRole(['admin', 'chef']) && (
              <Link to="/chantiers/new" className="btn btn-primary">
                <FiPlus /> Nouveau Chantier
              </Link>
            )}
          </>
        }
      />

      <div className="card">
        <div className="card-body">
          <div className="filters">
            <div className="filter-group">
              <label className="form-label">
                <FiSearch /> Rechercher
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nom ou adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Statut</label>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="planifié">Planifié</option>
                <option value="en_cours">En cours</option>
                <option value="suspendu">Suspendu</option>
                <option value="terminé">Terminé</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Priorité</label>
              <select
                className="form-control"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">Toutes les priorités</option>
                <option value="faible">Faible</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
                <option value="critique">Critique</option>
              </select>
            </div>
          </div>

          {filteredChantiers.length === 0 ? (
            <EmptyState
              icon={<FiTool />}
              title="Aucun chantier trouvé"
              message="Aucun chantier ne correspond à vos critères de recherche"
              action={
                hasRole(['admin', 'chef']) && (
                  <Link to="/chantiers/new" className="btn btn-primary">
                    <FiPlus /> Créer un chantier
                  </Link>
                )
              }
            />
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Statut</th>
                    <th>Priorité</th>
                    <th>Chef</th>
                    <th>Date début</th>
                    <th>Date fin prévue</th>
                    <th>Budget</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChantiers.map((chantier) => (
                    <tr key={chantier.id}>
                      <td>
                        <strong>{chantier.nom}</strong>
                        {chantier.adresse && (
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>{chantier.adresse}</div>
                        )}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{ backgroundColor: getStatusColor(chantier.statut) }}
                        >
                          {getStatusLabel(chantier.statut)}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{ backgroundColor: getPriorityColor(chantier.priorite) }}
                        >
                          {getPriorityLabel(chantier.priorite)}
                        </span>
                      </td>
                      <td>{chantier.chef?.nom || '-'}</td>
                      <td>{formatDate(chantier.date_debut)}</td>
                      <td>{formatDate(chantier.date_fin_prevue)}</td>
                      <td>{formatCurrency(chantier.budget)}</td>
                      <td>
                        <div className="table-actions">
                          <Link
                            to={`/chantiers/${chantier.id}`}
                            className="btn btn-sm btn-primary"
                            title="Voir détails"
                          >
                            <FiEye />
                          </Link>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleDownloadPdf(chantier.id, chantier.nom)}
                            title="Télécharger PDF"
                          >
                            <FiFileText />
                          </button>
                          {hasRole(['admin', 'chef']) && (
                            <Link
                              to={`/chantiers/${chantier.id}/edit`}
                              className="btn btn-sm btn-warning"
                              title="Modifier"
                            >
                              <FiEdit />
                            </Link>
                          )}
                          {hasRole('admin') && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(chantier.id)}
                              title="Supprimer"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, chantierId: null })}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce chantier ? Cette action est irréversible et supprimera toutes les affectations associées."
        danger
      />
    </div>
  );
};

export default ChantierList;
