import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import LanguageSwitcher from '../components/LanguageSwitcher';

const IAAnalyst = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, file } = location.state || { 
    result: {
      resume: "Ce document est un contrat type...",
      droits: ["Droit au logement décent", "Paiement du loyer"],
      etapes_suivantes: ["Contester la clause", "Signer l'avenant"],
      alerte_fraude: "Des incohérences ont été détectées."
    },
    file: { name: "Contrat.pdf" }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showLawyerModal, setShowLawyerModal] = useState(false);

  const handlePdfDownload = () => {
    if (!result) return;
    const div = document.createElement('div');
    const droits = result.droits || [];
    const etapes = result.etapes_suivantes || [];
    
    div.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #1c1c1a;">
        <h1 style="color: #2F855A; border-bottom: 2px solid #2F855A; padding-bottom: 10px;">📋 Rapport Professionnel Mizan</h1>
        <p><strong>Date d'analyse :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        
        <h2 style="margin-top:30px; font-size:18px; color:#333;">📄 Résumé de l'analyse</h2>
        <p style="text-align:justify; line-height: 1.6; font-size: 14px;">${result.resume}</p>
        
        <h2 style="margin-top:30px; font-size:18px; color:#333;">⚖️ Vos Droits / Points Clés</h2>
        <ul style="line-height: 1.6; font-size: 14px;">${droits.length > 0 ? droits.map(d => `<li>${d}</li>`).join('') : '<li>Aucun point détecté.</li>'}</ul>
        
        <h2 style="margin-top:30px; font-size:18px; color:#333;">➡️ Prochaines Étapes</h2>
        <ul style="line-height: 1.6; font-size: 14px;">${etapes.length > 0 ? etapes.map(d => `<li>${d}</li>`).join('') : '<li>Aucune étape détectée.</li>'}</ul>
        
        ${result.alerte_fraude && result.alerte_fraude.toLowerCase() !== 'null' ? `<div style="margin-top: 30px; padding: 20px; border: 2px solid red; background-color: #fff0f0; color: #cc0000; border-radius: 8px;"><strong>⚠️ ALERTE DE SÉCURITÉ:</strong> ${result.alerte_fraude}</div>` : ''}
        
        <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">Généré automatiquement par Mizan Legal AI - Plateforme Sécurisée d'Assistance Juridique</div>
      </div>
    `;
    const opt = { margin: 0.5, filename: `Rapport_Mizan_Analyse.pdf`, jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' } };
    html2pdf().set(opt).from(div).save();
  };

  const handleGenerateLetter = async () => {
    setIsGenerating(true);
    setShowLetterModal(true);
    setGeneratedLetter('');
    try {
      const token = localStorage.getItem('token');
      const payloadContext = `Résumé: ${result?.resume} | Droits/Attentions: ${result?.droits?.join(', ')}`;
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/generate-letter`,
        { context: payloadContext },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedLetter(res.data.letter);
    } catch (err) {
      console.error(err);
      setGeneratedLetter('Erreur lors de la génération par l\'IA. Vérifiez votre connexion.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed min-h-screen font-sans">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcf9f5]/80 backdrop-blur-md dark:bg-[#1c1c1a]/80">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold font-serif text-[#1c1c1a] dark:text-[#fcf9f5]">
            <Link to="/">Mizan Legal AI</Link>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/dashboard/b2c" className="font-serif text-lg tracking-tight text-[#1c1c1a] dark:text-[#fcf9f5] hover:text-[#aa3000] transition-colors duration-300">Dashboard</Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-8 max-w-[1600px] mx-auto min-h-screen">
        {/* Alert Banner */}
        {result?.alerte_fraude && (
          <div className="mb-8 overflow-hidden rounded-xl bg-error-container border-l-8 border-error flex items-center p-6 gap-6 shadow-sm">
            <div className="p-3 bg-error rounded-full text-white shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div className="flex-1">
              <h3 className="font-serif font-bold text-lg text-on-error-container uppercase tracking-tight">Alerte Fraude Détectée</h3>
              <p className="text-on-error-container/80 text-sm">{result.alerte_fraude}</p>
            </div>
            <button className="text-on-error-container font-bold text-sm underline hover:opacity-70">Détails techniques</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Left Column: PDF Preview (40%) */}
          <aside className="w-full lg:w-[40%] flex flex-col gap-4">
            <div className="flex items-center justify-between px-4">
              <h2 className="font-serif text-xl font-bold">Document Source</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined">zoom_in</span>
                </button>
              </div>
            </div>
            <div className="relative bg-surface-container-low aspect-[3/4] rounded-xl overflow-hidden border border-outline-variant/20 shadow-inner group">
              <img className="w-full h-full object-cover opacity-60 mix-blend-multiply transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRPKLNG5GkmUQa7BpckDhwkUpQmS8g0u7dG6vnDMNnjXK_WAn5g7t-M8L1cjZ5ZV_qgYE09IxmVPY5RBmbLgik4C6Y3vxqW88MjMpvCmCVsq5I6O4m30kxuJ6XJEZ0p5wCtuYB8aG1dP9_JdhTZqKZFbI-boekCdedPZ2Vpxgb8mxOZ4TsKZGhRnOD_Ai6WN28HV243ZHmuyXT14Q9MYa3YmB8BcbyMK6gyaEsOW3OcuqqaUsvazmp_lo088KrFLaOB5ZjI5eL19y4" alt="Document Background" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                </div>
                <p className="font-serif text-lg font-semibold text-on-surface">{file?.name}</p>
                <p className="text-sm text-on-surface/60 mt-2">Document • Scanné avec succès</p>
                <div className="mt-8 flex flex-col gap-2 w-full max-w-xs">
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[100%]"></div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface/40 font-bold">Extraction OCR active</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: AI Analysis (60%) */}
          <section id="analysis-container" className="w-full lg:w-[60%] flex flex-col gap-8 bg-background p-4 rounded-xl">
            {/* Résumé */}
            <article className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h2 className="font-serif text-2xl font-black tracking-tight">Résumé de l'analyse</h2>
              </div>
              <p className="text-lg leading-relaxed text-on-surface/80 font-light">
                {result?.resume}
              </p>
            </article>

            {/* Droits & Devoirs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-low p-8 rounded-xl">
                <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">gavel</span>
                  Vos Droits & Attentions
                </h3>
                <ul className="space-y-4">
                  {result?.droits?.map((droit, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary text-sm mt-1">check_circle</span>
                      <span className="text-sm text-on-surface/80">{droit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface-container-low p-8 rounded-xl">
                <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">priority_high</span>
                  Vos Devoirs 
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">error_outline</span>
                    <span className="text-sm text-on-surface/80">Respect des clauses générales indiquées dans le résumé.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">error_outline</span>
                    <span className="text-sm text-on-surface/80">Obligation de bonne foi dans l'exécution de l'accord.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Étapes à suivre */}
            <article className="bg-on-surface text-surface-bright p-10 rounded-xl">
              <h3 className="font-serif text-2xl font-bold mb-8">Prochaines Étapes Recommandées</h3>
              <div className="space-y-3">
                {result?.etapes_suivantes?.map((etape, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_circle_right</span>
                    <span className="text-sm font-medium text-on-surface leading-relaxed">
                      {etape}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col md:flex-row gap-4 flex-wrap">
                <button onClick={handlePdfDownload} className="px-6 py-4 flex-1 md:flex-none border border-transparent bg-[#2F855A] text-white hover:bg-[#22543D] rounded-md font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 shadow-md">
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  Télécharger Analyse (PDF)
                </button>
                <button onClick={handleGenerateLetter} className="flex-1 py-4 bg-primary text-on-primary rounded-md font-bold uppercase tracking-widest text-xs hover:bg-primary-container transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">edit_document</span>
                  Générer un courrier
                </button>
                <button onClick={() => navigate('/lawyers', { state: { result } })} className="px-6 py-4 border border-outline-variant/30 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-surface-container-lowest transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">gavel</span>
                  Trouver un avocat
                </button>
              </div>
            </article>
            
            <footer className="mt-auto pt-12">
              <div className="flex flex-col items-center gap-8 py-12 px-8 w-full bg-[#fcf9f5] dark:bg-[#1c1c1a] border-t border-[#ebe8e4] dark:border-[#333333]">
                <div className="font-serif font-bold text-[#1c1c1a]">Mizan Legal AI</div>
                <div className="flex gap-8">
                  <a className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline" href="#">Mentions Légales</a>
                  <a className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline" href="#">Confidentialité</a>
                  <a className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline" href="#">Contact</a>
                </div>
                <p className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60">© 2024 Mizan Legal AI. All rights reserved.</p>
              </div>
            </footer>
          </section>
        </div>
      </main>

      {/* MODAL: Génération de Courrier */}
      {showLetterModal && (
        <div className="fixed inset-0 bg-[#000000]/60 z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl relative">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_document</span>
                Courrier Recommandé Géré par l'IA
              </h3>
              <button onClick={() => setShowLetterModal(false)} className="p-2 hover:bg-surface-variant rounded-full"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
                  <p className="font-serif font-bold text-lg">Mizan rédige votre lettre...</p>
                  <p className="text-sm text-on-surface-variant text-center max-w-sm">Application du vocabulaire juridique, structuration du courrier et mise en avant de vos droits.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="bg-surface-container-low p-4 rounded-lg text-sm text-on-surface-variant border border-outline-variant/20 flex gap-3">
                    <span className="material-symbols-outlined text-primary">info</span>
                    Ce brouillon a été généré sur la base de l'analyse juridique. Veuillez vérifier et compléter les champs entre crochets [ ] avant tout envoi.
                  </div>
                  <textarea 
                    className="w-full h-96 p-4 border border-outline-variant/30 rounded-xl bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary/40 font-sans text-sm leading-relaxed"
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>

            {!isGenerating && (
              <div className="p-6 border-t border-outline-variant/10 flex justify-end gap-4 bg-surface-container-lowest/50 rounded-b-2xl">
                <button 
                  onClick={() => { navigator.clipboard.writeText(generatedLetter); alert("Copié !") }}
                  className="px-6 py-2 border border-outline-variant/30 rounded-lg font-medium hover:bg-surface-container-low transition-colors"
                >Copier le texte</button>
                <button 
                  onClick={() => {
                    const opt = { margin: 1, filename: 'Mise_en_demeure.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter' } };
                    const div = document.createElement('div');
                    div.innerHTML = `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap; font-size: 11pt;">${generatedLetter}</pre>`;
                    html2pdf().set(opt).from(div).save();
                  }}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
                ><span className="material-symbols-outlined text-sm">download</span> Exporter en PDF</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IAAnalyst;
