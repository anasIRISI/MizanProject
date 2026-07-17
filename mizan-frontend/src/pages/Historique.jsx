import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Historique = () => {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/history`);
        setHistory(res.data);
      } catch (err) {
        console.error("Erreur chargement historique:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const deleteRecord = async (id) => {
    if(window.confirm("Voulez-vous vraiment supprimer cet historique ?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/history/${id}`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const downloadHistoryPdf = () => {
    if(!selectedRecord) return;
    const div = document.createElement('div');
    const droits = JSON.parse(selectedRecord.droitsJson || '[]');
    const etapes = JSON.parse(selectedRecord.etapesSuivantesJson || '[]');
    div.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #1c1c1a;">
        <h1 style="color: #2F855A; border-bottom: 2px solid #2F855A; padding-bottom: 10px;">📋 Rapport Professionnel Mizan</h1>
        <h3>Nom du Document : ${selectedRecord.documentName}</h3>
        <p><strong>Date d'analyse :</strong> ${new Date(selectedRecord.createdAt).toLocaleDateString('fr-FR')}</p>
        
        <h2 style="margin-top:30px; font-size:18px; color:#333;">📄 Résumé de l'analyse</h2>
        <p style="text-align:justify; line-height: 1.6; font-size: 14px;">${selectedRecord.resume}</p>
        
        <h2 style="margin-top:30px; font-size:18px; color:#333;">⚖️ Vos Droits / Points Clés</h2>
        <ul style="line-height: 1.6; font-size: 14px;">${droits.length > 0 ? droits.map(d => `<li>${d}</li>`).join('') : '<li>Aucun point détecté.</li>'}</ul>
        
        <h2 style="margin-top:30px; font-size:18px; color:#333;">➡️ Prochaines Étapes</h2>
        <ul style="line-height: 1.6; font-size: 14px;">${etapes.length > 0 ? etapes.map(d => `<li>${d}</li>`).join('') : '<li>Aucune étape détectée.</li>'}</ul>
        
        ${selectedRecord.alerteFraude && selectedRecord.alerteFraude.toLowerCase() !== 'null' ? `<div style="margin-top: 30px; padding: 20px; border: 2px solid red; background-color: #fff0f0; color: #cc0000; border-radius: 8px;"><strong>⚠️ ALERTE DE SÉCURITÉ:</strong> ${selectedRecord.alerteFraude}</div>` : ''}
        
        <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">Généré automatiquement par Mizan Legal AI - Plateforme Sécurisée d'Assistance Juridique</div>
      </div>
    `;
    const opt = { margin: 0.5, filename: `Rapport_Mizan_${selectedRecord.documentName}.pdf`, jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' } };
    html2pdf().set(opt).from(div).save();
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed-dim min-h-screen font-sans flex">
      <Sidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 min-h-screen flex flex-col min-w-0 bg-background">

        <div className="px-12 py-12 flex-grow">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-serif font-bold text-on-surface tracking-tight mb-2">Historique des documents</h2>
              <p className="text-on-surface-variant font-body">Gérez et consultez l'ensemble de vos analyses juridiques.</p>
            </div>
            <Link to="/dashboard/b2c" className="bg-primary text-on-primary px-8 py-3 rounded-xl font-medium shadow-lg shadow-primary/20 hover:scale-95 active:scale-90 transition-all duration-300 flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Nouvelle Consultation
            </Link>
          </div>

          {/* Filters Bento Grid Section */}
          <section className="grid grid-cols-12 gap-6 mb-10">
            <div className="col-span-12 md:col-span-5 bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Recherche</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">search</span>
                <input className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface" placeholder="Rechercher par nom, type ou contenu..." type="text" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-7 bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-x-auto">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Filtrer par Statut</label>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-medium transition-all">Tous</button>
                  <button className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-container-high transition-all shrink-0">Analysé</button>
                  <button className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-container-high transition-all shrink-0">Action requise</button>
                  <button className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-container-high transition-all shrink-0">En attente</button>
                </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-outline-variant/30"></div>
              <div className="shrink-0">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Date</label>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-on-surface-variant rounded-lg text-sm font-medium border border-outline-variant/20">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  30 derniers jours
                </button>
              </div>
            </div>
          </section>

          {/* Documents Table */}
          <div className="bg-surface-container-low rounded-2xl overflow-x-auto border border-outline-variant/10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Nom du document</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date d'ajout</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Type</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Statut</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {isLoading ? (
                  <tr><td colSpan="5" className="text-center py-10">Chargement...</td></tr>
                ) : history.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10">Aucun historique trouvé.</td></tr>
                ) : (
                  history.map((record) => (
                    <tr key={record.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-12 bg-[#ffdad6] flex items-center justify-center rounded-md border border-error/20">
                            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
                          </div>
                          <div>
                            <div className="font-serif font-bold text-on-surface text-lg">{record.documentName}</div>
                            <div className="text-xs text-on-surface-variant">Type: {record.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-on-surface-variant font-medium">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-bold text-on-surface-variant uppercase tracking-wider">{record.type}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                          <span className="w-2 h-2 bg-secondary rounded-full"></span>
                          Analysé
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedRecord(record)} className="text-primary hover:bg-primary/5 px-4 py-2 rounded-lg font-bold text-sm transition-colors">Voir l'analyse</button>
                          <button onClick={() => deleteRecord(record.id)} className="text-error hover:bg-error/10 p-2 rounded-full transition-colors" title="Supprimer">
                             <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-8 py-6 flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-low">
              <span className="text-sm text-on-surface-variant hidden sm:inline">Affichage de 1 à 10 sur 42 documents</span>
              <div className="flex items-center gap-2 ml-auto">
                <button className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-sm font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-sm font-medium text-on-surface-variant">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-sm font-medium text-on-surface-variant">3</button>
                <button className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-12 py-12 mt-auto bg-surface-container-low border-t border-outline-variant/10 text-on-surface-variant text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-8">
              <a className="hover:text-primary transition-colors" href="#">Conditions d'utilisation</a>
              <a className="hover:text-primary transition-colors" href="#">Confidentialité</a>
              <a className="hover:text-primary transition-colors" href="#">Légal</a>
            </div>
            <div>© 2023-2026 Mizan Legal AI. Tous droits réservés.</div>
          </div>
        </footer>
      </main>

      {/* Analysis Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-[#000000]/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-y-auto shadow-2xl relative flex flex-col">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center sticky top-0 bg-surface/90 backdrop-blur-sm z-10">
              <h3 className="text-2xl font-serif font-bold text-on-surface">Détails de l'Analyse</h3>
              <button onClick={() => setSelectedRecord(null)} className="p-2 text-on-surface-variant hover:bg-outline-variant/20 rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 md:p-10 flex flex-col gap-8">
              <div>
                <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Résumé</h4>
                <p className="text-on-surface-variant text-base leading-relaxed">{selectedRecord.resume}</p>
              </div>
              
              {selectedRecord.alerteFraude && selectedRecord.alerteFraude.toLowerCase() !== "null" && (
                <div className="p-4 bg-error/10 border-l-4 border-error rounded-r text-error relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <span className="material-symbols-outlined text-9xl">warning</span>
                  </div>
                  <h4 className="font-bold flex items-center gap-2 relative z-10"><span className="material-symbols-outlined">warning</span> Alerte Importante</h4>
                  <p className="mt-2 text-sm font-medium relative z-10">{selectedRecord.alerteFraude}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm">
                  <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">gavel</span>
                    {selectedRecord.type === 'B2B' ? 'Risques & Conformité' : 'Vos Droits'}
                  </h4>
                  <ul className="space-y-4">
                    {(() => {
                      try {
                        const items = JSON.parse(selectedRecord.droitsJson || '[]');
                        if(items.length === 0) return <li className="text-on-surface-variant italic text-sm">Aucun point identifié.</li>;
                        return items.map((item, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-on-surface-variant items-start">
                            <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">check_circle</span>
                            <span>{item}</span>
                          </li>
                        ));
                      } catch {
                        return <li className="text-on-surface-variant italic text-sm">Données non formatées correctement.</li>;
                      }
                    })()}
                  </ul>
                </div>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 shadow-sm">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">arrow_forward_ios</span>
                    Étapes Suivantes
                  </h4>
                  <ul className="space-y-4">
                    {(() => {
                      try {
                        const items = JSON.parse(selectedRecord.etapesSuivantesJson || '[]');
                        if(items.length === 0) return <li className="text-on-surface-variant italic text-sm">Aucune étape spécifique.</li>;
                        return items.map((etape, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-on-surface-variant items-start">
                            <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">arrow_forward</span>
                            <span>{etape}</span>
                          </li>
                        ));
                      } catch {
                        return <li className="text-on-surface-variant italic text-sm">Données non formatées correctement.</li>;
                      }
                    })()}
                  </ul>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={downloadHistoryPdf} className="px-8 py-3 bg-[#2F855A] text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#22543D] transition-colors shadow-md flex items-center gap-2">
                   <span className="material-symbols-outlined">picture_as_pdf</span>
                   Télécharger Rapport Pro (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historique;
