import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';
import { FiLock, FiMail } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result && result.user) {
        toast.success('Connexion réussie');
        // Forcer la navigation immédiate
        window.location.href = '/';
      } else {
        throw new Error('Données utilisateur manquantes');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(handleApiError(error));
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Gestion des Chantiers</h1>
            <p>Connectez-vous à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FiMail /> Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="exemple@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FiLock /> Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="login-footer">
            <p className="demo-info">
              <strong>Comptes de démonstration:</strong>
            </p>
            <ul className="demo-accounts">
              <li>
                <strong>Admin:</strong> admin@chantiers.com / password123
              </li>
              <li>
                <strong>Chef:</strong> chef.dupont@chantiers.com / password123
              </li>
              <li>
                <strong>Ouvrier:</strong> ouvrier.martin@chantiers.com / password123
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
