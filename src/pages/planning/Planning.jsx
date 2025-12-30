import { useState, useEffect } from 'react';
import { chantierService } from '../../services/chantierService';
import { toast } from 'react-toastify';
import { handleApiError, formatDate, getStatusColor, getStatusLabel, getPriorityColor } from '../../utils/helpers';
import { FiCalendar } from 'react-icons/fi';
import Loading from '../../components/common/Loading';
import './Planning.css';

const Planning = () => {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchPlanning();
  }, []);

  const fetchPlanning = async () => {
    try {
      setLoading(true);
      const response = await chantierService.getPlanning();
      // Le backend renvoie { success, data: [...] } directement
      const chantiers = response.data || response.chantiers || [];
      console.log('Planning chantiers loaded:', chantiers.length);
      setChantiers(chantiers);
    } catch (error) {
      console.error('Fetch planning error:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getChantierPosition = (chantier, daysInMonth) => {
    const startDate = new Date(chantier.date_debut);
    const endDate = new Date(chantier.date_fin_prevue);
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    if (endDate < monthStart || startDate > monthEnd) {
      return null;
    }

    const start = startDate < monthStart ? 1 : startDate.getDate();
    const end = endDate > monthEnd ? daysInMonth : endDate.getDate();

    return {
      left: ((start - 1) / daysInMonth) * 100,
      width: ((end - start + 1) / daysInMonth) * 100,
    };
  };

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  if (loading) {
    return <Loading />;
  }

  const daysInMonth = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>
          <FiCalendar /> Planning des Chantiers
        </h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => changeMonth(-1)}>
            ← Mois précédent
          </button>
          <button className="btn btn-outline" onClick={() => setCurrentMonth(new Date())}>
            Aujourd'hui
          </button>
          <button className="btn btn-outline" onClick={() => changeMonth(1)}>
            Mois suivant →
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{monthName}</h2>
        </div>
        <div className="card-body">
          <div className="planning-container">
            {/* Days header */}
            <div className="planning-header">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                <div key={day} className="planning-day">
                  {day}
                </div>
              ))}
            </div>

            {/* Chantiers */}
            <div className="planning-body">
              {chantiers.length === 0 ? (
                <p className="text-center" style={{ padding: '2rem', color: '#666' }}>
                  Aucun chantier pour ce mois
                </p>
              ) : (
                chantiers.map((chantier) => {
                  const position = getChantierPosition(chantier, daysInMonth);
                  if (!position) return null;

                  return (
                    <div key={chantier.id} className="planning-row">
                      <div className="planning-chantier-name">
                        <div>
                          <strong>{chantier.nom}</strong>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>
                            {formatDate(chantier.date_debut)} - {formatDate(chantier.date_fin_prevue)}
                          </div>
                        </div>
                      </div>
                      <div className="planning-timeline">
                        <div
                          className="planning-bar"
                          style={{
                            left: `${position.left}%`,
                            width: `${position.width}%`,
                            backgroundColor: getStatusColor(chantier.statut),
                            borderLeft: `4px solid ${getPriorityColor(chantier.priorite)}`,
                          }}
                          title={`${chantier.nom} - ${getStatusLabel(chantier.statut)}`}
                        >
                          <span className="planning-bar-label">{chantier.nom}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legend */}
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Légende:</strong>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '10px', backgroundColor: '#6c757d' }}></div>
                <span>Planifié</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '10px', backgroundColor: '#007bff' }}></div>
                <span>En cours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '10px', backgroundColor: '#28a745' }}></div>
                <span>Terminé</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '10px', backgroundColor: '#ffc107' }}></div>
                <span>Suspendu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;
