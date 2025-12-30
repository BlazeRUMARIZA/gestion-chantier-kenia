import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { handleApiError, validateEmail, validatePassword } from '../../utils/helpers';
import { FiX, FiSave } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const UserModal = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ouvrier',
    telephone: '',
    actif: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'ouvrier',
        telephone: user.telephone || '',
        actif: user.actif !== undefined ? user.actif : true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!user) {
      // Création: mot de passe requis
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
    } else if (formData.password) {
      // Modification: si mot de passe fourni, le valider
      if (!validatePassword(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        nom: formData.nom,
        email: formData.email,
        role: formData.role,
        telephone: formData.telephone,
        actif: formData.actif,
      };

      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      if (user) {
        await userService.updateUser(user.id, dataToSend);
        toast.success('Utilisateur modifié avec succès');
      } else {
        await userService.createUser(dataToSend);
        toast.success('Utilisateur créé avec succès');
      }

      onClose(true);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => onClose(false)}
      title={user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
      footer={
        <>
          <button className="btn btn-outline" onClick={() => onClose(false)} disabled={loading}>
            <FiX /> Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            <FiSave /> {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom" className="form-label required">
            Nom complet
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            className={`form-control ${errors.nom ? 'error' : ''}`}
            value={formData.nom}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.nom && <div className="form-error">{errors.nom}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label required">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label required">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="ouvrier">Ouvrier</option>
            <option value="chef">Chef de chantier</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="telephone" className="form-label">
            Téléphone
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
          <label htmlFor="password" className={`form-label ${!user ? 'required' : ''}`}>
            {user ? 'Nouveau mot de passe' : 'Mot de passe'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'error' : ''}`}
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            placeholder={user ? 'Laisser vide pour ne pas changer' : ''}
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className={`form-label ${!user && formData.password ? 'required' : ''}`}>
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="actif"
              checked={formData.actif}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Utilisateur actif</span>
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
