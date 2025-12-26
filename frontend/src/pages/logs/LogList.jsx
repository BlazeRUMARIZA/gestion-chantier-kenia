import { useState, useEffect } from 'react';
import { logService } from '../../services/logService';
import { toast } from 'react-toastify';
import { handleApiError, formatDateTime } from '../../utils/helpers';
import { FiFileText, FiSearch } from 'react-icons/fi';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

const LogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'connexions'
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [activeTab]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let logs = [];
      if (activeTab === 'connexions') {
        const response = await logService.getLoginHistory();
        // Le backend renvoie { success, data: [...] } directement
        logs = response.data || response.logs || [];
      } else {
        const response = await logService.getAllLogs();
        // Le backend renvoie { success, data: [...] } directement
        logs = response.data || response.logs || [];
      }
      console.log('Logs loaded:', logs.length);
      setLogs(logs);
    } catch (error) {
      console.error('Fetch logs error:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      (log.user?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !actionFilter || (log.action || '').toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Historique des Logs</h1>

      <div className="card mt-3">
        <div className="card-header">
          <div className="flex gap-2">
            <button
              className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('all')}
            >
              Tous les logs
            </button>
            <button
              className={`btn ${activeTab === 'connexions' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('connexions')}
            >
              Connexions
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="filters">
            <div className="filter-group">
              <label className="form-label">
                <FiSearch /> Rechercher
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Utilisateur, action ou détails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {activeTab === 'all' && (
              <div className="filter-group">
                <label className="form-label">Action</label>
                <select
                  className="form-control"
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                >
                  <option value="">Toutes les actions</option>
                  <option value="create">Création</option>
                  <option value="update">Modification</option>
                  <option value="delete">Suppression</option>
                  <option value="login">Connexion</option>
                  <option value="logout">Déconnexion</option>
                </select>
              </div>
            )}
          </div>

          {filteredLogs.length === 0 ? (
            <EmptyState
              icon={<FiFileText />}
              title="Aucun log trouvé"
              message="Aucun log ne correspond à vos critères de recherche"
            />
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date & Heure</th>
                    <th>Utilisateur</th>
                    <th>Action</th>
                    <th>Détails</th>
                    {activeTab === 'connexions' && <th>Adresse IP</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{formatDateTime(log.createdAt || log.date_connexion)}</td>
                      <td>{log.user?.nom || '-'}</td>
                      <td>
                        <span
                          className={`badge ${
                            log.action?.includes('create') || log.action?.includes('login')
                              ? 'badge-success'
                              : log.action?.includes('delete')
                              ? 'badge-danger'
                              : log.action?.includes('update')
                              ? 'badge-warning'
                              : 'badge-secondary'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td style={{ maxWidth: '400px', wordBreak: 'break-word' }}>
                        {log.details || '-'}
                      </td>
                      {activeTab === 'connexions' && <td>{log.ip_address || '-'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogList;
