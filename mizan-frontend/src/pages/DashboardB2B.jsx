import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UploadDropzone from '../components/UploadDropzone';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const KpiCard = ({ icon, label, value, sub, color = 'text-primary' }) => (
  <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
    <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
      <span className={`material-symbols-outlined text-2xl ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-serif font-black text-on-surface">{value}</p>
      <p className="text-sm font-medium text-on-surface-variant">{label}</p>
      {sub && <p className="text-xs text-on-surface-variant/60 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const RiskBadge = ({ hasAlert }) => hasAlert ? (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-error-container text-on-error-container">
    <span className="w-1.5 h-1.5 rounded-full bg-error" />
    Alerte Détectée
  </span>
) : (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-secondary-container text-on-secondary-container">
    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
    Conforme
  </span>
);

const DashboardB2B = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentDocs(res.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const alertCount = recentDocs.filter(d => d.alerteFraude).length;
  const complianceScore = recentDocs.length === 0 ? '—' : `${Math.max(60, 100 - alertCount * 15)}%`;

  return (
    <div className="bg-surface text-on-surface flex min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-surface overflow-y-auto">

        {/* Header */}
        <header className="px-12 pt-12 pb-8 border-b border-outline-variant/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-3 py-1 mb-3">
                <span className="material-symbols-outlined text-[14px] text-primary">business_center</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Portail Entreprise</span>
              </div>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-on-surface mb-2">
                Bonjour, {user?.name || 'Juriste'}
              </h1>
              <p className="text-on-surface/60 max-w-2xl font-light leading-relaxed">
                Auditez vos contrats fournisseurs, accords commerciaux et vérifiez la conformité réglementaire en temps réel grâce à l'IA juridique de Mizan.
              </p>
            </div>
            <Link
              to="/lawyers"
              className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">gavel</span>
              Conseil Juridique
            </Link>
          </div>
        </header>

        <div className="px-12 py-8 space-y-10">

          {/* KPIs */}
          <section>
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Indicateurs Contractuels</p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <KpiCard icon="description"    label="Contrats analysés"      value={recentDocs.length}  sub="Ce mois"             color="text-primary" />
              <KpiCard icon="warning"        label="Alertes détectées"      value={alertCount}         sub="Clauses à risque"    color="text-error" />
              <KpiCard icon="verified_user"  label="Score de conformité"    value={complianceScore}    sub="RGPD / Légal"        color="text-secondary" />
              <KpiCard icon="bolt"           label="Temps d'analyse moyen"  value="< 30s"              sub="Par document"        color="text-tertiary" />
            </div>
          </section>

          {/* Scanner */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Scanner IA — Mode Entreprise B2B</p>
                <p className="text-xs text-on-surface-variant/60 mt-0.5">Analyse contractuelle avancée · Détection RGPD · Clauses abusives · Pénalités</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-secondary font-bold">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Moteur B2B Actif
              </span>
            </div>
            <div className="group relative overflow-hidden bg-surface-container-low rounded-2xl p-1 w-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <div className="relative bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-xl p-8 transition-colors group-hover:border-primary/40">
                <UploadDropzone type="B2B" />
              </div>
            </div>
          </section>

          {/* B2B Modules */}
          <section>
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Modules d'Analyse Inclus</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: 'verified_user', title: 'Conformité RGPD',       desc: 'Vérification automatique des clauses de protection des données personnelles selon le règlement européen.' },
                { icon: 'gavel',         title: 'Clauses Abusives',       desc: 'Détection des clauses déséquilibrées, pénalités excessives et conditions léonines dans vos contrats.' },
                { icon: 'handshake',     title: 'Analyse Fournisseurs',   desc: 'Audit des accords de prestation, SLA, garanties et responsabilités contractuelles inter-entreprises.' },
              ].map((mod, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl p-6 hover:shadow-sm hover:border-outline-variant/30 transition-all">
                  <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary">{mod.icon}</span>
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">{mod.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{mod.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Contracts Table */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Contrats Récents</p>
              <Link to="/history" className="text-sm font-medium text-primary hover:underline">Voir tout l'historique</Link>
            </div>
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40">Document</th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40">Date</th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40">Statut</th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {isLoading ? (
                    <tr><td colSpan="4" className="px-8 py-10 text-center text-on-surface-variant">Chargement...</td></tr>
                  ) : recentDocs.length === 0 ? (
                    <tr><td colSpan="4" className="px-8 py-10 text-center text-on-surface-variant">Aucun contrat analysé récemment.</td></tr>
                  ) : recentDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => navigate('/history')}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-primary/5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">description</span>
                          </div>
                          <div>
                            <p className="font-medium text-on-surface group-hover:text-primary transition-colors truncate max-w-[200px]">{doc.documentName}</p>
                            <p className="text-[11px] text-on-surface/40 italic">ID: {doc.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface/70">
                        {new Date(doc.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5">
                        <RiskBadge hasAlert={!!doc.alerteFraude} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={(e) => { e.stopPropagation(); navigate('/history'); }} className="text-on-surface/30 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentDocs.length > 0 && (
                <div className="bg-surface-container-low/30 px-8 py-4 text-center">
                  <p className="text-[11px] uppercase tracking-widest font-bold text-on-surface/40">Fin de la liste</p>
                </div>
              )}
            </div>
          </section>

          {/* Compliance strip */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-t border-outline-variant/10 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/50">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-secondary">verified</span> RGPD Conforme</span>
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">lock</span> Chiffrement AES-256</span>
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">gavel</span> Droit Marocain</span>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardB2B;
