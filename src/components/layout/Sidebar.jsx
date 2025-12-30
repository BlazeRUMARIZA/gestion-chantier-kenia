import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome,
  FiUsers,
  FiTool,
  FiUserCheck,
  FiFileText,
  FiLogOut,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fonction pour obtenir les initiales de l'utilisateur
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Couleurs d'avatar basées sur le rôle
  const getAvatarColor = (role) => {
    const colors = {
      admin: '#dc3545',
      chef: '#007bff',
      ouvrier: '#28a745',
    };
    return colors[role] || '#6c757d';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <FiTool className="brand-icon" />
          <h2>Gestion Chantiers</h2>
        </div>
        
        <div className="sidebar-user">
          <div 
            className="user-avatar" 
            style={{ backgroundColor: getAvatarColor(user?.role) }}
          >
            {getInitials(user?.nom)}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.nom}</p>
            <span className={`badge badge-${user?.role === 'admin' ? 'danger' : user?.role === 'chef' ? 'primary' : 'success'}`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end>
              <FiHome />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {hasRole(['admin', 'chef']) && (
            <li>
              <NavLink to="/chantiers">
                <FiTool />
                <span>Chantiers</span>
              </NavLink>
            </li>
          )}

          {user?.role === 'ouvrier' && (
            <li>
              <NavLink to="/mes-chantiers">
                <FiTool />
                <span>Mes Chantiers</span>
              </NavLink>
            </li>
          )}

          {hasRole(['admin', 'chef']) && (
            <li>
              <NavLink to="/affectations">
                <FiUserCheck />
                <span>Affectations</span>
              </NavLink>
            </li>
          )}

          {hasRole(['admin', 'chef']) && (
            <li>
              <NavLink to="/planning">
                <FiCalendar />
                <span>Planning</span>
              </NavLink>
            </li>
          )}

          {hasRole('admin') && (
            <li>
              <NavLink to="/users">
                <FiUsers />
                <span>Utilisateurs</span>
              </NavLink>
            </li>
          )}

          {hasRole('admin') && (
            <li>
              <NavLink to="/logs">
                <FiFileText />
                <span>Logs</span>
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/profile">
              <FiUser />
              <span>Profil</span>
            </NavLink>
          </li>

          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <FiLogOut />
              <span>Déconnexion</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
