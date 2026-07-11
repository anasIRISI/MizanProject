import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const UploadDropzone = ({ type }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/analyze?lang=${language}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/analyze', { state: { result: response.data, file: file, type } });
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'analyse du document. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-6"></div>
        <h3 className="font-serif text-xl font-bold animate-pulse text-on-surface">{t('uploading')}</h3>
        <p className="text-on-surface-variant mt-2 text-center max-w-sm">
          {t('upload_sub')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
      {/* Upload Side */}
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center py-8 border-b lg:border-b-0 lg:border-r border-outline-variant/20 h-full relative"
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onChange={handleChange}
          accept=".pdf,image/*"
        />
        <div className="mb-6 relative group-hover:after:absolute group-hover:after:-inset-4 group-hover:after:bg-primary/5 group-hover:after:rounded-full group-hover:after:blur-xl transition-all">
          <span className="material-symbols-outlined text-6xl text-primary relative z-0" style={{fontVariationSettings: "'FILL' 0"}}>upload_file</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-on-surface mb-2 text-center">
          {file ? "Fichier Prêt : " + file.name : "Analyse Immédiate"}
        </h3>
        <p className="text-on-surface/50 text-sm mb-8 text-center px-4">
          Glissez-déposez vos fichiers PDF ici ou <span className="text-primary font-semibold underline cursor-pointer">parcourez votre ordinateur</span>
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10">
            <span className="material-symbols-outlined text-sm text-on-surface/40" style={{fontVariationSettings: "'FILL' 0"}}>check_circle</span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface/60">Contrats</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10">
            <span className="material-symbols-outlined text-sm text-on-surface/40" style={{fontVariationSettings: "'FILL' 0"}}>check_circle</span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface/60">Statuts</span>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 w-full p-4 bg-error-container text-on-error-container rounded-lg text-sm border-l-4 border-error z-20 relative">
            {error}
          </div>
        )}
      </div>

      {/* Text Input Side */}
      <div className="flex flex-col h-full py-2 z-20 relative">
        <label className="block text-sm font-bold text-on-surface/70 mb-3 uppercase tracking-wider" htmlFor="situation-description">
          Décrivez la situation juridique
        </label>
        <textarea 
          className="flex-1 min-h-[200px] w-full p-4 bg-surface-container-low/50 border border-outline-variant/20 rounded-xl text-on-surface text-sm font-sans resize-none transition-all placeholder:text-on-surface/30 focus:ring-1 focus:ring-primary/20" 
          id="situation-description" 
          placeholder="Saisissez ici les faits ou les questions juridiques spécifiques..."
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={file ? handleUpload : undefined}
            disabled={!file}
            className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all flex items-center gap-2 ${file ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed text-opacity-50'}`}
          >
            <span>Analyser le document</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDropzone;
