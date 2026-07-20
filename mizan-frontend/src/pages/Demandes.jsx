import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// MOCK_DEMANDS REMOVED ENTIRELY

const getStatusBadge = (status) => {
  switch(status) {
    case 'attente':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning-container/40 text-on-warning-container rounded-full text-xs font-bold uppercase tracking-wider border border-warning/30">
          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span>
          En Attente
        </span>
      );
    case 'acceptee':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-container/40 text-on-success-container rounded-full text-xs font-bold uppercase tracking-wider border border-success/30">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          Acceptée (RDV Confirmé)
        </span>
      );
    case 'terminee':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-wider border border-outline-variant/30">
          <span className="material-symbols-outlined text-[14px]">history</span>
          Terminée
        </span>
      );
    default:
      return null;
  }
};

const Demandes = () => {
  const { user } = useAuth();
  const [demands, setDemands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/demands`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDemands(res.data);
      } catch (err) {
        console.error("Erreur chargement demandes", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDemands();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed-dim min-h-screen font-sans flex">
      <Sidebar />

      <main className="flex-1 min-h-screen flex flex-col min-w-0 bg-background relative">
        <header className="bg-[#fcf9f5]/80 backdrop-blur-md dark:bg-[#1c1c1a]/80 flex justify-between items-center w-full px-12 py-4 docked full-width top-0 z-40 sticky shadow-sm border-b border-outline-variant/10">
           <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-black text-[#1c1c1a] dark:text-[#fcf9f5]"><Link to="/">Mizan</Link></h1>
            <div className="bg-[#f6f3ef] dark:bg-[#2a2a28] h-6 w-[1px] mx-2"></div>
            <span className="font-serif text-lg tracking-tight text-[#1c1c1a]/70 dark:text-[#fcf9f5]/70">Suivi Avocats</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-medium text-sm">Bienvenue, {user?.name || 'Utilisateur'}</span>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div className="px-12 py-12 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
             <div>
               <h2 className="text-4xl font-serif font-bold text-on-surface tracking-tight mb-2">Mes Demandes</h2>
               <p className="text-on-surface-variant font-body text-lg">
                 Suivez l'état de vos prises de contact avec les avocats de notre réseau.
               </p>
             </div>
             <Link to="/lawyers" className="px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
               <span className="material-symbols-outlined text-[18px]">add</span>
               Nouvelle demande
             </Link>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-on-surface-variant">Dossier</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-on-surface-variant">Avocat & Sujet</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-on-surface-variant">Date Sollicitée</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-on-surface-variant text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {isLoading ? (
                  <tr><td colSpan="4" className="text-center py-10">Chargement...</td></tr>
                ) : demands.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-10">Aucune demande trouvée.</td></tr>
                ) : (
                demands.map((demand) => (
                  <tr key={demand.id} className="hover:bg-surface-container/30 transition-colors group">
                    <td className="px-6 py-6 align-top">
                      <div className="font-mono text-sm font-bold text-primary mb-1">REQ-{demand.id}</div>
                      <div className="text-xs text-on-surface-variant">Envoyée le {formatDate(demand.submittedAt)}</div>
                    </td>
                    <td className="px-6 py-6 align-top">
                      <div className="flex items-start gap-4">
                         <img src={demand.lawyerImage} alt="Lawyer" className="w-12 h-12 rounded-full object-cover border border-outline-variant/20 shadow-sm" />
                         <div>
                            <div className="font-bold text-base text-on-surface">{demand.lawyerName}</div>
                            <div className="text-sm font-medium text-secondary mt-1">{demand.subject}</div>
                            {demand.status === 'attente' && (
                               <div className="mt-3 text-xs text-on-surface-variant flex items-center gap-1 bg-surface-container-high inline-flex px-2 py-1 rounded">
                                  <span className="material-symbols-outlined text-[14px]">attach_file</span> Analyse jointe
                               </div>
                            )}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 align-top">
                      <div className="font-bold text-sm flex items-center gap-2">
                         <span className="material-symbols-outlined text-on-surface-variant">event</span>
                         {new Date(demand.date).toLocaleString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-6 align-top text-right">
                      {getStatusBadge(demand.status)}
                      {demand.status === 'acceptee' && (
                         <div className="mt-4 flex justify-end">
                            <button className="text-primary hover:text-primary/70 font-bold text-xs uppercase tracking-widest underline decoration-2 underline-offset-4 transition-colors">
                              Lien Visio
                            </button>
                         </div>
                      )}
                    </td>
                  </tr>
                ))
               )}
              </tbody>
            </table>
            {!isLoading && demands.length === 0 && (
               <div className="py-20 text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">inbox</span>
                  <p className="font-serif text-xl font-bold mb-2">Aucune demande en cours</p>
                  <p className="text-on-surface-variant max-w-sm">Vous n'avez pas encore contacté d'avocat de notre réseau.</p>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Demandes;
