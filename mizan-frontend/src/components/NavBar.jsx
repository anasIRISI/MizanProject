import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fcf9f5]/80 backdrop-blur-md dark:bg-[#1c1c1a]/80 border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold font-serif text-[#1c1c1a] dark:text-[#fcf9f5] flex items-center gap-4">
          Mizan Legal AI
          <LanguageSwitcher />
        </Link>
        
        {isAuthenticated ? (
          <>
            <div className="hidden md:flex items-center gap-10 font-serif text-lg tracking-tight">
              <Link to={user?.role === 'ENTREPRISE' ? "/dashboard/b2b" : "/dashboard/b2c"} className="text-[#1c1c1a] dark:text-[#fcf9f5] hover:text-[#aa3000] transition-colors duration-300">
                Dashboard
              </Link>
              <Link to="/history" className="text-[#1c1c1a] dark:text-[#fcf9f5] hover:text-[#aa3000] transition-colors duration-300">
                Historique
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-[#1c1c1a]/70 dark:text-[#fcf9f5]/70">
                Bienvenue, {user?.name || 'Utilisateur'}
              </span>
              <button onClick={logout} className="text-[#aa3000] font-medium hover:text-red-600 transition-colors">
                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="hidden md:flex items-center gap-10 font-serif text-lg tracking-tight">
              <Link to="/dashboard/b2c" className="text-[#aa3000] border-b-2 border-[#aa3000] pb-1 transition-colors duration-300">
                Citoyens
              </Link>
              <Link to="/dashboard/b2b" className="text-[#1c1c1a] dark:text-[#fcf9f5] hover:text-[#aa3000] transition-colors duration-300">
                Entreprises
              </Link>
              <a href="#" className="text-[#1c1c1a] dark:text-[#fcf9f5] hover:text-[#aa3000] transition-colors duration-300">
                Tarifs
              </a>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-[#1c1c1a] dark:text-[#fcf9f5] font-medium hover:text-[#aa3000] transition-colors">
                Connexion
              </Link>
              <Link to="/register" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:bg-primary-container transition-all active:scale-95 duration-200">
                Commencer
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
