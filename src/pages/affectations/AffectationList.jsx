import { useState, useEffect } from 'react';
import { affectationService } from '../../services/affectationService';
import { chantierService } from '../../services/chantierService';
import { toast } from 'react-toastify';
import { handleApiError, formatDate } from '../../utils/helpers';
import { FiPlus, FiEdit, FiTrash2, FiUserCheck, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AffectationModal from './AffectationModal';

const AffectationList = () => {
  const { hasRole } = useAuth();
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [chantierFilter, setChantierFilter] = useState('');
  const [chantiers, setChantiers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAffectation, setSelectedAffectation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, affectationId: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [affectationsRes, chantiersRes] = await Promise.all([
        affectationService.getAllAffectations(),
        chantierService.getAllChantiers(),
      ]);
      // Le backend renvoie { success, data: [...] } directement
      const affectations = affectationsRes.data || affectationsRes.affectations || [];
      const chantiers = chantiersRes.data || chantiersRes.chantiers || [];
      console.log('Affectations loaded:', affectations.length, 'Chantiers:', chantiers.length);
      setAffectations(affectations);
      setChantiers(chantiers);
    } catch (error) {
      console.error('Fetch data error:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAffectation(null);
    setShowModal(true);
  };

  const handleEdit = (affectation) => {
    setSelectedAffectation(affectation);
    setShowModal(true);
  };

  const handleDelete = (affectationId) => {
    setDeleteConfirm({ isOpen: true, affectationId });
  };

  const confirmDelete = async () => {
    try {
      await affectationService.deleteAffectation(deleteConfirm.affectationId);
      toast.success('Affectation supprimée avec succès');
      fetchData();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const handleModalClose = (refresh) => {
    setShowModal(false);
    setSelectedAffectation(null);
    if (refresh) {
      fetchData();
    }
  };

  const filteredAffectations = affectations.filter((affectation) => {
    const matchesSearch = affectation.ouvrier?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affectation.chantier?.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChantier = !chantierFilter || affectation.chantier_id === parseInt(chantierFilter);
    return matchesSearch && matchesChantier;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Gestion des Affectations</h1>
        {hasRole(['admin', 'chef']) && (
          <button className="btn btn-primary" onClick={handleCreate}>
            <FiPlus /> Nouvelle Affectation
          </button>
        )}
      </div>

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
                placeholder="Ouvrier ou chantier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Chantier</label>
              <select
                className="form-control"
                value={chantierFilter}
                onChange={(e) => setChantierFilter(e.target.value)}
              >
                <option value="">Tous les chantiers</option>
                {chantiers.map((chantier) => (
                  <option key={chantier.id} value={chantier.id}>
                    {chantier.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredAffectations.length === 0 ? (
            <EmptyState
              icon={<FiUserCheck />}
              title="Aucune affectation trouvée"
              message="Aucune affectation ne correspond à vos critères de recherche"
              action={
                hasRole(['admin', 'chef']) && (
                  <button className="btn btn-primary" onClick={handleCreate}>
                    <FiPlus /> Créer une affectation
                  </button>
                )
              }
            />
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ouvrier</th>
                    <th>Chantier</th>
                    <th>Rôle sur chantier</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Heures prévues</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAffectations.map((affectation) => (
                    <tr key={affectation.id}>
                      <td>{affectation.ouvrier?.nom || '-'}</td>
                      <td>{affectation.chantier?.nom || '-'}</td>
                      <td>{affectation.role_sur_chantier || '-'}</td>
                      <td>{formatDate(affectation.date_debut)}</td>
                      <td>{affectation.date_fin ? formatDate(affectation.date_fin) : 'En cours'}</td>
                      <td>{affectation.heures_prevues || 0} h</td>
                      <td>
                        <div className="table-actions">
                          {hasRole(['admin', 'chef']) && (
                            <>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEdit(affectation)}
                                title="Modifier"
                              >
                                <FiEdit />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(affectation.id)}
                                title="Supprimer"
                              >
                                <FiTrash2 />
                              </button>
                            </>
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

      {showModal && (
        <AffectationModal
          affectation={selectedAffectation}
          onClose={handleModalClose}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, affectationId: null })}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette affectation ?"
        danger
      />
    </div>
  );
};

export default AffectationList;
