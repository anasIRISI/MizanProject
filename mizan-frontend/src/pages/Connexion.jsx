import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Connexion = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
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
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    const { success, message } = await login(email, password);
    if (!success) {
      setError(message);
    } else {
      navigate('/dashboard/b2c');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed font-sans">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto bg-surface/80 backdrop-blur-md">
        <div className="text-2xl font-bold font-headline text-on-surface">
          <Link to="/">Mizan Legal AI</Link>
        </div>
        <div>
          <a className="text-sm font-medium hover:text-primary transition-colors duration-300" href="#">Besoin d'aide ?</a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-12">
        {/* Login Card Container */}
        <div className="w-full max-w-md">
          {/* Tonal shift background for the card */}
          <div className="bg-surface-container-lowest rounded-xl p-10 md:p-12 shadow-[0_40px_60px_rgba(28,28,26,0.05)] border border-outline-variant/15">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-headline font-bold text-on-surface mb-3 tracking-tight">Ravi de vous revoir</h1>
              <p className="text-on-surface-variant font-body text-sm">Entrez vos identifiants pour accéder à votre espace juridique.</p>
            </div>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm mb-4 border-l-4 border-error">
                  {error}
                </div>
              )}
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface/60 mb-2 ml-1 transition-colors group-focus-within:text-primary" htmlFor="email">Email professionnel</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                    id="email" 
                    type="email" 
                    placeholder="jean.dupont@cabinet.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="group">
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60 transition-colors group-focus-within:text-primary" htmlFor="password">Mot de passe</label>
                    <a className="text-xs font-semibold text-primary hover:text-primary-container transition-colors" href="#">Oublié ?</a>
                  </div>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                      id="password" 
                      type="password" 
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40 hover:text-primary transition-colors" type="button">
                      <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>visibility</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="block text-center w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-[0_8px_20px_rgba(170,48,0,0.15)] hover:bg-[#c43800] hover:shadow-[0_12px_25px_rgba(170,48,0,0.25)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-surface-container-lowest px-4 text-on-surface-variant">Ou continuer avec</span>
              </div>
            </div>
            
            {/* Social Login */}
            <button className="w-full flex items-center justify-center gap-3 py-3.5 px-6 border border-outline-variant/30 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-300 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="text-sm font-medium text-on-surface">Continuer avec Google</span>
            </button>
            <p className="mt-10 text-center text-sm text-on-surface-variant font-body">
              Nouveau sur Mizan ? 
              <Link to="/register" className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 ml-1">Créer un compte</Link>
            </p>
          </div>
          
          {/* Trust Indicator / Decorative element */}
          <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <img alt="Certification Logo" className="h-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG8EToan0Ad45jsCSCcj6P2t0sO_nsIlwTk3GowznFWZtgf2YCH_bmwFimK0ICb95SAC_ADP5BA6MsFhKk9kBKdXm5hyCJX-dtfDl-4nLCvEjJacpPfKG5aHbjd1hbK5FfthyNTJT-oOy_bcJzVoWRtahFtPjipDGAuKv8arZZGz2ehd_mdIGR7pVqchkTgVf415RczBOzAh5t0Vi4u4FbUIYO3pcTHKitTAfFWJUikyECVPhOsd48psVJzyz245MWcUhTATo70kJn" />
            <img alt="AI Safety" className="h-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgnEVLKOkbQPP-_djmJJViqmcz5LXPYVt7OZ-31ng6czXYl-nCHFGm3BLhp-W_V1ZIKq_zxIwalSzD7zYfxsiAfEyyARsAQSX-yurMxlbXNcGrLiJJ16avB2S3wn-ZVXpzgdFXSM85so8wSEY6WpmvNUT5ss39glHPsS_Rgrcq4ahigAr9iZUlYCv_NvMc0cqzVLLli-PvREnVQVnOnFpxvy5gTh9j8OfF0QbRVK8jpRRNIeK4EY4PBlF_sYzWwdOG_9ONcr0xJiOw" />
          </div>
        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-[#ebe8e4] dark:border-[#333333] bg-[#fcf9f5] dark:bg-[#1c1c1a] py-12 px-8 flex flex-col items-center gap-8 z-10 relative">
        <div className="flex gap-8 flex-wrap justify-center">
          <a className="text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 font-sans text-xs uppercase tracking-widest hover:text-[#aa3000] underline transition-all opacity-80 hover:opacity-100" href="#">Mentions Légales</a>
          <a className="text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 font-sans text-xs uppercase tracking-widest hover:text-[#aa3000] underline transition-all opacity-80 hover:opacity-100" href="#">Confidentialité</a>
          <a className="text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 font-sans text-xs uppercase tracking-widest hover:text-[#aa3000] underline transition-all opacity-80 hover:opacity-100" href="#">Contact</a>
        </div>
        <div className="font-serif font-bold text-[#1c1c1a] text-sm">Mizan Legal AI</div>
        <p className="text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 font-sans text-xs uppercase tracking-widest">© 2024 Mizan Legal AI. All rights reserved.</p>
      </footer>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-secondary-container blur-3xl"></div>
      </div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-primary-fixed-dim blur-3xl"></div>
      </div>
    </div>
  );
};

export default Connexion;
