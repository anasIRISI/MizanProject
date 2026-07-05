import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreationCompte = () => {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('citoyen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'ENTREPRISE' ? '/dashboard/b2b' : '/dashboard/b2c');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    const { success, message } = await register(name, email, password, accountType);
    if (!success) {
      setError(message);
    } else {
      navigate('/dashboard/b2c');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold font-serif text-on-surface tracking-tight">
            <Link to="/">Mizan Legal AI</Link>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a className="font-sans text-sm font-medium text-on-surface/70 hover:text-primary transition-colors" href="#">Citoyens</a>
            <a className="font-sans text-sm font-medium text-on-surface/70 hover:text-primary transition-colors" href="#">Entreprises</a>
            <a className="font-sans text-sm font-medium text-on-surface/70 hover:text-primary transition-colors" href="#">Tarifs</a>
            <Link to="/login" className="ml-4 font-sans text-sm font-semibold text-primary py-2 px-6 border border-primary/20 rounded hover:bg-primary/5 transition-all">Connexion</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <div className="w-full max-w-xl">
          <div className="bg-surface-container-lowest p-10 md:p-16 rounded-xl shadow-[0_40px_60px_-15px_rgba(28,28,26,0.05)] border border-outline-variant/10">
            <div className="mb-12 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-4">Créer votre compte</h1>
              <p className="text-on-surface-variant font-light text-lg">L'excellence juridique augmentée par l'IA.</p>
            </div>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm mb-4 border-l-4 border-error">
                  {error}
                </div>
              )}
              <div className="space-y-6">
                <div className="mb-8">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4 ml-1">Je m'inscris en tant que</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all group/type ${accountType === 'citoyen' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:bg-surface-container-low'}`}>
                      <input 
                        className="sr-only" 
                        name="account_type" 
                        type="radio" 
                        value="citoyen" 
                        checked={accountType === 'citoyen'} 
                        onChange={() => setAccountType('citoyen')} 
                      />
                      <span className={`material-symbols-outlined mb-2 ${accountType === 'citoyen' ? 'text-primary' : 'text-on-surface-variant group-hover/type:text-primary transition-colors'}`}>person</span>
                      <span className={`text-sm font-semibold ${accountType === 'citoyen' ? 'text-primary' : 'text-on-surface group-hover/type:text-primary transition-colors'}`}>Citoyen</span>
                    </label>
                    <label className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all group/type ${accountType === 'entreprise' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:bg-surface-container-low'}`}>
                      <input 
                        className="sr-only" 
                        name="account_type" 
                        type="radio" 
                        value="entreprise" 
                        checked={accountType === 'entreprise'} 
                        onChange={() => setAccountType('entreprise')} 
                      />
                      <span className={`material-symbols-outlined mb-2 ${accountType === 'entreprise' ? 'text-primary' : 'text-on-surface-variant group-hover/type:text-primary transition-colors'}`}>corporate_fare</span>
                      <span className={`text-sm font-semibold ${accountType === 'entreprise' ? 'text-primary' : 'text-on-surface group-hover/type:text-primary transition-colors'}`}>Entreprise</span>
                    </label>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1" htmlFor="name">Nom complet</label>
                  <input className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary/40 focus:ring-0 px-4 py-4 transition-all text-on-surface placeholder:text-on-surface-variant/40" id="name" name="name" placeholder="Jean Dupont" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                
                <div className="group">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1" htmlFor="email">Email</label>
                  <input className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary/40 focus:ring-0 px-4 py-4 transition-all text-on-surface placeholder:text-on-surface-variant/40" id="email" name="email" placeholder="jean.dupont@exemple.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                
                <div className="group">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 ml-1" htmlFor="password">Mot de passe</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary/40 focus:ring-0 px-4 py-4 transition-all text-on-surface placeholder:text-on-surface-variant/40" id="password" name="password" placeholder="••••••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary" type="button">
                      <span className="material-symbols-outlined" data-icon="visibility">visibility</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/40 cursor-pointer" id="terms" name="terms" type="checkbox"/>
                </div>
                <div className="text-xs leading-relaxed text-on-surface-variant">
                  En créant un compte, j'accepte les <a className="text-primary hover:underline underline-offset-4" href="#">Conditions d'utilisation</a> et la <a className="text-primary hover:underline underline-offset-4" href="#">Politique de confidentialité</a> de Mizan Legal AI.
                </div>
              </div>
              
              <button type="submit" disabled={isLoading} className="block text-center w-full py-5 bg-primary text-on-primary font-semibold text-lg rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-container transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95">
                {isLoading ? 'Inscription...' : 'Commencer'}
              </button>
            </form>
            
            <div className="mt-10 pt-8 border-t border-outline-variant/20 flex flex-col items-center gap-4">
              <p className="text-sm text-on-surface-variant">Déjà un compte ? <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">Se connecter</Link></p>
              <div className="flex items-center gap-4 w-full px-4">
                <div className="h-px bg-outline-variant/30 flex-grow"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50 font-bold">ou s'inscrire avec</span>
                <div className="h-px bg-outline-variant/30 flex-grow"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-low border border-outline-variant/20 rounded-lg hover:bg-surface-container-high transition-all">
                  <img alt="" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA25mBqbsFSedWW4Flcb31kNy5S6pwhwy94erH6HfkVMPih8n-r_2tHB0Q9of3lk4njqN16gGtZkMvJBnRp5Gnvy7Do1Xp1Niew2vqnHKp2ouF1GkkALW1PoJSNYnNd56MJEhsTbDwXMdRle-8Zv5gtaonO3nwqwqR8MeE88xVQg2ZceRgpd88IT2L_T2nxCPbvdOYQjhr7vg2Wte0XNkvyBX7pFrk98jRQyHxT1BH8HVBUmKImaE0ESg6jr9cXQ-EIKPTC32NH1Drg"/>
                  <span className="text-xs font-medium">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-low border border-outline-variant/20 rounded-lg hover:bg-surface-container-high transition-all">
                  <img alt="" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANKOxh1pVw8y11CnZ4I2JVbka2rKlGNlo5HCwPfWHkbupAR7AaWsEt8IO-PNBSRk9eftc1ADOvfnUBlobfRWRIIsQ4Ov3_DRhYLcA7UxBcLHwbBRsbRi7uyqaPtr9fcV-_7XJeNVLSws8vqlaPQRw_l0hzWLHVmos1qLKmXCmIDggmZRreZ8S71u64fB5Yf6lHZNWiEZ_wrZZ0b7lNFtTUnbHFQZ6KibCN3_1u4z0h42G41gewYl1mcWEmj0nF1lhwFtcbMQl0BrWs"/>
                  <span className="text-xs font-medium">Microsoft</span>
                </button>
              </div>
            </div>
            
          </div>
          <p className="mt-12 text-center text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40 font-bold">
            Sécurité de niveau bancaire & confidentialité garantie
          </p>
        </div>
      </main>

      <footer className="w-full border-t border-surface-container-high bg-surface mt-auto z-10 relative">
        <div className="flex flex-col items-center gap-6 py-12 px-8 max-w-7xl mx-auto w-full">
          <div className="font-serif font-bold text-on-surface tracking-widest text-lg">
            MIZAN LEGAL AI
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all" href="#">Mentions Légales</a>
            <a className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all" href="#">Confidentialité</a>
            <a className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all" href="#">Contact</a>
          </div>
          <div className="text-[10px] font-sans uppercase tracking-widest text-on-surface-variant/40 mt-4">
            © 2024 Mizan Legal AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreationCompte;
