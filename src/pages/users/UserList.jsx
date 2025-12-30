import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { handleApiError, getRoleLabel, formatDateTime } from '../../utils/helpers';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiSearch } from 'react-icons/fi';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UserModal from './UserModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, userId: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      // Le backend renvoie { success, data: [...] } directement
      const users = response.data || response.users || [];
      console.log('Users loaded:', users.length);
      setUsers(users);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    setDeleteConfirm({ isOpen: true, userId });
  };

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(deleteConfirm.userId);
      toast.success('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const handleModalClose = (refresh) => {
    setShowModal(false);
    setSelectedUser(null);
    if (refresh) {
      fetchUsers();
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Gestion des Utilisateurs</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          <FiPlus /> Nouvel Utilisateur
        </button>
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
                placeholder="Nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Rôle</label>
              <select
                className="form-control"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="chef">Chef de chantier</option>
                <option value="ouvrier">Ouvrier</option>
              </select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <EmptyState
              icon={<FiUsers />}
              title="Aucun utilisateur trouvé"
              message="Aucun utilisateur ne correspond à vos critères de recherche"
              action={
                <button className="btn btn-primary" onClick={handleCreate}>
                  <FiPlus /> Créer un utilisateur
                </button>
              }
            />
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Téléphone</th>
                    <th>Statut</th>
                    <th>Dernière connexion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nom}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge badge-${user.role === 'admin' ? 'danger' : user.role === 'chef' ? 'warning' : 'secondary'}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td>{user.telephone || '-'}</td>
                      <td>
                        <span className={`badge badge-${user.actif ? 'success' : 'secondary'}`}>
                          {user.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>{user.derniere_connexion ? formatDateTime(user.derniere_connexion) : 'Jamais'}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(user)}
                            title="Modifier"
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(user.id)}
                            title="Supprimer"
                          >
                            <FiTrash2 />
                          </button>
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
        <UserModal
          user={selectedUser}
          onClose={handleModalClose}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, userId: null })}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        danger
      />
    </div>
  );
};

export default UserList;
