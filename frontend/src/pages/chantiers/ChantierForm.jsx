import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chantierService } from '../../services/chantierService';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';
import { FiSave, FiX } from 'react-icons/fi';
import Loading from '../../components/common/Loading';

const ChantierForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chefs, setChefs] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    adresse: '',
    date_debut: '',
    date_fin_prevue: '',
    date_fin_reelle: '',
    statut: 'planifié',
    budget: '',
    chef_id: '',
    priorite: 'moyenne',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchChefs();
    if (id) {
      fetchChantier();
    }
  }, [id]);

  const fetchChefs = async () => {
    try {
      const response = await userService.getAllUsers({ role: 'chef' });
      setChefs(response.users || []);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    }
  };

  const fetchChantier = async () => {
    try {
      setLoading(true);
      const response = await chantierService.getChantierById(id);
      const chantier = response.chantier;
      
      setFormData({
        nom: chantier.nom || '',
        description: chantier.description || '',
        adresse: chantier.adresse || '',
        date_debut: chantier.date_debut || '',
        date_fin_prevue: chantier.date_fin_prevue || '',
        date_fin_reelle: chantier.date_fin_reelle || '',
        statut: chantier.statut || 'planifié',
        budget: chantier.budget || '',
        chef_id: chantier.chef_id || '',
        priorite: chantier.priorite || 'moyenne',
      });
    } catch (error) {
      toast.error(handleApiError(error));
      navigate('/chantiers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.date_debut) {
      newErrors.date_debut = 'La date de début est requise';
    }

    if (!formData.date_fin_prevue) {
      newErrors.date_fin_prevue = 'La date de fin prévue est requise';
    }

    if (formData.date_debut && formData.date_fin_prevue && formData.date_debut > formData.date_fin_prevue) {
      newErrors.date_fin_prevue = 'La date de fin doit être après la date de début';
    }

    if (!formData.chef_id) {
      newErrors.chef_id = 'Le chef de chantier est requis';
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
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        chef_id: parseInt(formData.chef_id),
        date_fin_reelle: formData.date_fin_reelle || null,
      };

      if (id) {
        await chantierService.updateChantier(id, dataToSend);
        toast.success('Chantier modifié avec succès');
      } else {
        await chantierService.createChantier(dataToSend);
        toast.success('Chantier créé avec succès');
      }

      navigate('/chantiers');
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>{id ? 'Modifier le chantier' : 'Nouveau chantier'}</h1>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nom" className="form-label required">
                Nom du chantier
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
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="adresse" className="form-label">
                Adresse
              </label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                className="form-control"
                value={formData.adresse}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="date_debut" className="form-label required">
                  Date de début
                </label>
                <input
                  type="date"
                  id="date_debut"
                  name="date_debut"
                  className={`form-control ${errors.date_debut ? 'error' : ''}`}
                  value={formData.date_debut}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.date_debut && <div className="form-error">{errors.date_debut}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="date_fin_prevue" className="form-label required">
                  Date de fin prévue
                </label>
                <input
                  type="date"
                  id="date_fin_prevue"
                  name="date_fin_prevue"
                  className={`form-control ${errors.date_fin_prevue ? 'error' : ''}`}
                  value={formData.date_fin_prevue}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.date_fin_prevue && <div className="form-error">{errors.date_fin_prevue}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="date_fin_reelle" className="form-label">
                Date de fin réelle
              </label>
              <input
                type="date"
                id="date_fin_reelle"
                name="date_fin_reelle"
                className="form-control"
                value={formData.date_fin_reelle}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="statut" className="form-label required">
                  Statut
                </label>
                <select
                  id="statut"
                  name="statut"
                  className="form-control"
                  value={formData.statut}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="planifié">Planifié</option>
                  <option value="en_cours">En cours</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="terminé">Terminé</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priorite" className="form-label required">
                  Priorité
                </label>
                <select
                  id="priorite"
                  name="priorite"
                  className="form-control"
                  value={formData.priorite}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="faible">Faible</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                  <option value="critique">Critique</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="chef_id" className="form-label required">
                  Chef de chantier
                </label>
                <select
                  id="chef_id"
                  name="chef_id"
                  className={`form-control ${errors.chef_id ? 'error' : ''}`}
                  value={formData.chef_id}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Sélectionner un chef</option>
                  {chefs.map((chef) => (
                    <option key={chef.id} value={chef.id}>
                      {chef.nom}
                    </option>
                  ))}
                </select>
                {errors.chef_id && <div className="form-error">{errors.chef_id}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="budget" className="form-label">
                  Budget (€)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  className="form-control"
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={loading}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-2" style={{ marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FiSave /> {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/chantiers')}
                disabled={loading}
              >
                <FiX /> Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChantierForm;
