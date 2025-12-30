import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chantierService } from '../../services/chantierService';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';
import { FiTool, FiUsers, FiCheckCircle, FiClock, FiActivity, FiHome } from 'react-icons/fi';
import Loading from '../../components/common/Loading';
import PageHeader from '../../components/common/PageHeader';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChantiers: 0,
    chantiersEnCours: 0,
    chantiersTermines: 0,
    totalOuvriers: 0,
    chantiersByStatus: {},
    chantiersByPriority: {},
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (hasRole('admin')) {
        const [chantierStatsRes, userStatsRes] = await Promise.all([
          chantierService.getChantierStats(),
          userService.getUserStats(),
        ]);

        // Le backend renvoie { success, data }
        const chantierStats = chantierStatsRes.data || chantierStatsRes;
        const userStats = userStatsRes.data || userStatsRes;

        // Convertir parStatut en objet
        const statusObj = {};
        if (chantierStats.parStatut) {
          chantierStats.parStatut.forEach(item => {
            statusObj[item.statut] = item.count;
          });
        }

        // Convertir parPriorite en objet
        const priorityObj = {};
        if (chantierStats.parPriorite) {
          chantierStats.parPriorite.forEach(item => {
            priorityObj[item.priorite] = item.count;
          });
        }

        setStats({
          totalChantiers: chantierStats.total || 0,
          chantiersEnCours: statusObj['en_cours'] || 0,
          chantiersTermines: statusObj['terminé'] || 0,
          totalOuvriers: userStats.total_ouvriers || 0,
          chantiersByStatus: statusObj,
          chantiersByPriority: priorityObj,
        });
      } else {
        // Pour chef et ouvrier, récupérer uniquement les chantiers
        const chantiersRes = await chantierService.getAllChantiers();
        const chantiers = chantiersRes.data || chantiersRes.chantiers || [];
        
        const statusCounts = {};
        const priorityCounts = {};
        
        chantiers.forEach(c => {
          statusCounts[c.statut] = (statusCounts[c.statut] || 0) + 1;
          priorityCounts[c.priorite] = (priorityCounts[c.priorite] || 0) + 1;
        });

        setStats({
          totalChantiers: chantiers.length,
          chantiersEnCours: statusCounts['en_cours'] || 0,
          chantiersTermines: statusCounts['terminé'] || 0,
          totalOuvriers: 0,
          chantiersByStatus: statusCounts,
          chantiersByPriority: priorityCounts,
        });
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const statusChartData = {
    labels: Object.keys(stats.chantiersByStatus).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')),
    datasets: [
      {
        data: Object.values(stats.chantiersByStatus),
        backgroundColor: [
          '#6c757d', // planifié
          '#007bff', // en_cours
          '#ffc107', // suspendu
          '#28a745', // terminé
          '#dc3545', // annulé
        ],
      },
    ],
  };

  const priorityChartData = {
    labels: Object.keys(stats.chantiersByPriority).map(p => p.charAt(0).toUpperCase() + p.slice(1)),
    datasets: [
      {
        label: 'Nombre de chantiers',
        data: Object.values(stats.chantiersByPriority),
        backgroundColor: [
          '#28a745', // faible
          '#ffc107', // moyenne
          '#fd7e14', // haute
          '#dc3545', // critique
        ],
      },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <PageHeader
        icon={FiHome}
        title="Tableau de bord"
        description={`Bienvenue, ${user?.nom} (${user?.role})`}
      />

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#007bff' }}>
            <FiTool />
          </div>
          <div className="stat-content">
            <h3>{stats.totalChantiers}</h3>
            <p>Total Chantiers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ffc107' }}>
            <FiClock />
          </div>
          <div className="stat-content">
            <h3>{stats.chantiersEnCours}</h3>
            <p>En cours</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#28a745' }}>
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.chantiersTermines}</h3>
            <p>Terminés</p>
          </div>
        </div>

        {hasRole('admin') && (
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#17a2b8' }}>
              <FiUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.totalOuvriers}</h3>
              <p>Ouvriers</p>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Chantiers par statut</h2>
          </div>
          <div className="card-body">
            {Object.keys(stats.chantiersByStatus).length > 0 ? (
              <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                <Pie data={statusChartData} />
              </div>
            ) : (
              <p className="text-center" style={{ padding: '2rem', color: '#666' }}>
                Aucune donnée disponible
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Chantiers par priorité</h2>
          </div>
          <div className="card-body">
            {Object.keys(stats.chantiersByPriority).length > 0 ? (
              <Bar data={priorityChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            ) : (
              <p className="text-center" style={{ padding: '2rem', color: '#666' }}>
                Aucune donnée disponible
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">
            <FiActivity /> Actions rapides
          </h2>
        </div>
        <div className="card-body">
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {hasRole(['admin', 'chef']) && (
              <>
                <Link to="/chantiers/new" className="btn btn-primary">
                  <FiTool /> Nouveau chantier
                </Link>
                <Link to="/affectations" className="btn btn-secondary">
                  Gérer les affectations
                </Link>
              </>
            )}
            <Link to="/chantiers" className="btn btn-outline">
              Voir tous les chantiers
            </Link>
            <Link to="/planning" className="btn btn-outline">
              Voir le planning
            </Link>
            {hasRole('admin') && (
              <Link to="/users" className="btn btn-outline">
                Gérer les utilisateurs
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
