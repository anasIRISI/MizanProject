import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UploadDropzone from '../components/UploadDropzone';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const DashboardB2C = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentDocs(res.data.slice(0, 3));
      } catch (err) {
        console.error("Erreur lors de la récupération de l'historique", err);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-surface text-on-surface flex min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-surface">
        {/* Header / Greeting */}
        <header className="px-12 pt-12 pb-8">
          <h2 className="text-4xl font-serif font-bold tracking-tight text-on-surface mb-2">{t('dashboard_greeting', { name: user?.name || '' })}</h2>
          <p className="text-on-surface/60 max-w-2xl font-light">
            {t('dashboard_sub')}
          </p>
        </header>

        {/* Drag & Drop & Text Area Component */}
        <section className="px-12 mb-12">
          <div className="group relative overflow-hidden bg-surface-container-low rounded-2xl p-1 w-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <div className="relative bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-xl p-8 transition-colors group-hover:border-primary/40">
              <UploadDropzone type="B2C" />
            </div>
          </div>
        </section>

        {/* Recent Documents Table */}
        <section className="px-12 pb-20 mt-auto">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-2xl font-serif font-bold">{t('recent_docs')}</h3>
            <Link to="/history" className="text-sm font-medium text-primary hover:underline transition-all">{t('see_all')}</Link>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40">{t('doc_name')}</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40">{t('date')}</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40">{t('status')}</th>
                  <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentDocs.length > 0 ? recentDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => navigate('/history')}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-primary/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                        </div>
                        <div>
                          <p className="font-medium text-on-surface group-hover:text-primary transition-colors truncate max-w-[200px]">{doc.documentName}</p>
                          <p className="text-[11px] text-on-surface/40 italic">ID: {doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface/70 w-[180px]">{formatDate(doc.createdAt)}</td>
                    <td className="px-8 py-5">
                       {doc.alerteFraude ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold uppercase tracking-tighter">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Alerte
                          </span>
                       ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-tighter">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            Analysé
                          </span>
                       )}
                    </td>
                    <td className="px-8 py-5 text-right flex justify-end gap-2">
                       <button onClick={(e) => { e.stopPropagation(); navigate('/history'); }} className="text-on-surface/30 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">visibility</span>
                       </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-10 text-center text-on-surface-variant font-medium">
                      {t('no_recent')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {recentDocs.length > 0 && (
              <div className="bg-surface-container-low/30 px-8 py-4 text-center">
                <p className="text-[11px] uppercase tracking-widest font-bold text-on-surface/40">{t('end_of_list')}</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-[#ebe8e4] dark:border-[#333333] bg-[#fcf9f5] dark:bg-[#1c1c1a] flex flex-col items-center gap-8 py-12 px-8 mt-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="font-serif font-bold text-[#1c1c1a] dark:text-[#fcf9f5]">Mizan Legal AI</div>
            <div className="flex gap-8">
              <a className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline transition-all" href="#">Mentions Légales</a>
              <a className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline transition-all" href="#">Confidentialité</a>
              <a className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline transition-all" href="#">Contact</a>
            </div>
          </div>
          <p className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 opacity-80">© 2024 Mizan Legal AI. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default DashboardB2C;
