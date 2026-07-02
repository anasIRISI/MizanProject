import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { name: t('sidebar_dashboard'), path: '/dashboard/b2c', icon: 'dashboard' },
    { name: t('sidebar_history'), path: '/history', icon: 'history' },
    { name: t('sidebar_demands'), path: '/demands', icon: 'mark_email_read' },
    { name: t('sidebar_settings'), path: '#', icon: 'settings' }
  ];

  return (
    <aside className="h-screen w-64 border-r border-[#ebe8e4] dark:border-[#333333] bg-[#f6f3ef] dark:bg-[#1c1c1a] flex flex-col py-6 sticky top-0 shrink-0">
      <div className="px-6 mb-10">
        <Link to="/">
          <h1 className="font-serif font-black text-xl text-[#1c1c1a] dark:text-[#fcf9f5]">Mizan AI</h1>
          <p className="font-sans text-sm font-medium text-[#aa3000]">Legal Assistant</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith('/dashboard') && item.name === 'Dashboard');
          return (
            <Link 
              key={index}
              to={item.path} 
              className={`flex items-center px-6 py-3 transition-all ${
                isActive 
                  ? 'text-[#aa3000] bg-[#ebe8e4] dark:bg-[#333333] font-bold rounded-r-full translate-x-1' 
                  : 'text-[#1c1c1a]/70 dark:text-[#fcf9f5]/70 hover:bg-[#ebe8e4] dark:hover:bg-[#333333]'
              }`}
            >
              <span className="material-symbols-outlined mr-3">{item.icon}</span>
              <span className="font-sans text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
        <div className="mt-auto px-4 py-8 border-t border-[#ebe8e4] dark:border-[#333333]">
          <button onClick={logout} className="flex items-center w-full px-6 py-3 text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] hover:bg-[#ebe8e4] dark:hover:bg-[#333333] font-medium rounded-r-full transition-all cursor-pointer">
            <span className="material-symbols-outlined mr-3 text-lg">logout</span>
            {t('sidebar_logout')}
          </button>
        </div>
      </nav>

      <div className="px-6 mt-auto">
        {/* Language Switcher */}
        <div className="mb-4">
          <LanguageSwitcher />
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-[#ebe8e4] dark:bg-[#333333] p-3 rounded-lg">
          <div className="w-10 h-10 rounded-full border border-[#aa3000]/20 flex items-center justify-center bg-[#fcf9f5] dark:bg-[#1c1c1a]">
            <span className="material-symbols-outlined text-[#aa3000]">person</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm text-[#1c1c1a] dark:text-[#fcf9f5]">{user?.name || 'Utilisateur'}</span>
            <span className="font-sans text-[10px] text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 uppercase tracking-widest">{user?.role || 'B2C'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
