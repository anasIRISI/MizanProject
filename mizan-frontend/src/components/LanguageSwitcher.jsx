import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ variant = 'light' }) => {
  const { language, setLanguage } = useLanguage();

  const base = 'flex bg-surface-container-high rounded-lg p-0.5 gap-0.5';

  return (
    <div className={base}>
      {[
        { code: 'fr', label: 'FR' },
        { code: 'en', label: 'EN' },
        { code: 'ar', label: 'ع' },
      ].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
            language === code
              ? 'bg-[#aa3000] text-white shadow-sm'
              : 'text-on-surface-variant hover:text-[#aa3000]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
