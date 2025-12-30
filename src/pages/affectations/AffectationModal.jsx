import { useState, useEffect } from 'react';
import { affectationService } from '../../services/affectationService';
import { chantierService } from '../../services/chantierService';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';
import { FiX, FiSave } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const AffectationModal = ({ affectation, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [chantiers, setChantiers] = useState([]);
  const [ouvriers, setOuvriers] = useState([]);
  const [formData, setFormData] = useState({
    chantier_id: '',
    ouvrier_id: '',
    date_debut: '',
    date_fin: '',
    role_sur_chantier: '',
    heures_prevues: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    if (affectation) {
      setFormData({
        chantier_id: affectation.chantier_id || '',
        ouvrier_id: affectation.ouvrier_id || '',
        date_debut: affectation.date_debut || '',
        date_fin: affectation.date_fin || '',
        role_sur_chantier: affectation.role_sur_chantier || '',
        heures_prevues: affectation.heures_prevues || '',
      });
    }
  }, [affectation]);

  // Mettre à jour les ouvriers disponibles quand le chantier change
  useEffect(() => {
    if (formData.chantier_id) {
      fetchOuvriersDisponibles(formData.chantier_id);
    } else {
      fetchOuvriersDisponibles();
    }
  }, [formData.chantier_id]);

  const fetchData = async () => {
    try {
      const [chantiersRes, ouvriersRes] = await Promise.all([
        chantierService.getAllChantiers(),
        affectationService.getOuvriersDisponibles(),
      ]);
      // Le backend renvoie { success, data: [...] } directement
      const chantiers = chantiersRes.data || chantiersRes.chantiers || [];
      const ouvriers = ouvriersRes.data || ouvriersRes.ouvriers || [];
      setChantiers(chantiers);
      setOuvriers(ouvriers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchOuvriersDisponibles = async (chantierId = null) => {
    try {
      const params = chantierId ? { chantier_id: chantierId } : {};
      const ouvriersRes = await affectationService.getOuvriersDisponibles(params);
      // Le backend renvoie { success, data: [...] } directement
      const ouvriers = ouvriersRes.data || ouvriersRes.ouvriers || [];
      setOuvriers(ouvriers);
    } catch (error) {
      console.error('Error fetching ouvriers:', error);
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

    if (!formData.chantier_id) {
      newErrors.chantier_id = 'Le chantier est requis';
    }

    if (!formData.ouvrier_id) {
      newErrors.ouvrier_id = 'L\'ouvrier est requis';
    }

    if (!formData.date_debut) {
      newErrors.date_debut = 'La date de début est requise';
    }

    if (formData.date_debut && formData.date_fin && formData.date_debut > formData.date_fin) {
      newErrors.date_fin = 'La date de fin doit être après la date de début';
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
        chantier_id: parseInt(formData.chantier_id),
        ouvrier_id: parseInt(formData.ouvrier_id),
        date_debut: formData.date_debut,
        date_fin: formData.date_fin || null,
        role_sur_chantier: formData.role_sur_chantier || 'ouvrier',
        heures_prevues: formData.heures_prevues ? parseInt(formData.heures_prevues) : 0,
      };

      if (affectation) {
        await affectationService.updateAffectation(affectation.id, dataToSend);
        toast.success('Affectation modifiée avec succès');
      } else {
        await affectationService.createAffectation(dataToSend);
        toast.success('Affectation créée avec succès');
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
      title={affectation ? 'Modifier l\'affectation' : 'Nouvelle affectation'}
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
          <label htmlFor="chantier_id" className="form-label required">
            Chantier
          </label>
          <select
            id="chantier_id"
            name="chantier_id"
            className={`form-control ${errors.chantier_id ? 'error' : ''}`}
            value={formData.chantier_id}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Sélectionner un chantier</option>
            {chantiers.map((chantier) => (
              <option key={chantier.id} value={chantier.id}>
                {chantier.nom}
              </option>
            ))}
          </select>
          {errors.chantier_id && <div className="form-error">{errors.chantier_id}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="ouvrier_id" className="form-label required">
            Ouvrier
          </label>
          <select
            id="ouvrier_id"
            name="ouvrier_id"
            className={`form-control ${errors.ouvrier_id ? 'error' : ''}`}
            value={formData.ouvrier_id}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Sélectionner un ouvrier</option>
            {ouvriers.map((ouvrier) => (
              <option key={ouvrier.id} value={ouvrier.id}>
                {ouvrier.nom}
              </option>
            ))}
          </select>
          {errors.ouvrier_id && <div className="form-error">{errors.ouvrier_id}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="role_sur_chantier" className="form-label">
            Rôle sur le chantier
          </label>
          <input
            type="text"
            id="role_sur_chantier"
            name="role_sur_chantier"
            className="form-control"
            value={formData.role_sur_chantier}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ex: Maçon, Électricien, etc."
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
            <label htmlFor="date_fin" className="form-label">
              Date de fin
            </label>
            <input
              type="date"
              id="date_fin"
              name="date_fin"
              className={`form-control ${errors.date_fin ? 'error' : ''}`}
              value={formData.date_fin}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.date_fin && <div className="form-error">{errors.date_fin}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="heures_prevues" className="form-label">
            Heures prévues
          </label>
          <input
            type="number"
            id="heures_prevues"
            name="heures_prevues"
            className="form-control"
            value={formData.heures_prevues}
            onChange={handleChange}
            disabled={loading}
            min="0"
          />
        </div>
      </form>
    </Modal>
  );
};

export default AffectationModal;
