import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';
import Loading from '../../components/common/Loading';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const dataToUpdate = {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
      };

      if (formData.password) {
        dataToUpdate.password = formData.password;
      }

      const response = await authService.updateProfile(user.id, dataToUpdate);
      updateUser(response.user);
      toast.success('Profil mis à jour avec succès');

      // Réinitialiser les champs de mot de passe
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Mon Profil</h1>

      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className="card-header">
          <h2 className="card-title">Informations personnelles</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nom" className="form-label required">
                <FiUser /> Nom complet
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                className="form-control"
                value={formData.nom}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label required">
                <FiMail /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone" className="form-label">
                <FiPhone /> Téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                className="form-control"
                value={formData.telephone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rôle</label>
              <input
                type="text"
                className="form-control"
                value={user.role}
                disabled
              />
            </div>

            <hr style={{ margin: '2rem 0' }} />

            <h3 style={{ marginBottom: '1rem' }}>Changer le mot de passe</h3>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
