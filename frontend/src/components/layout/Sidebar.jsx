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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Gestion Chantiers</h2>
        <p>
          {user?.nom} <span className="badge badge-primary">{user?.role}</span>
        </p>
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
