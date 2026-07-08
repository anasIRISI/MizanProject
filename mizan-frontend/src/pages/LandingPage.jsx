import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <main className="pt-20">
      {/* Hero Section: Split Screen */}
      <section className="min-h-[921px] flex flex-col md:flex-row border-b border-outline-variant/10">
        {/* Left Side: Citoyens */}
        <div className="flex-1 relative group overflow-hidden bg-surface flex flex-col justify-center p-12 lg:p-24">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img alt="Bureau juridique classique" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFoepyjuLNtP1SF7uLrd_cn1Stfq3lSAiOYqlI6e4ymOdNSZrW4zknm93jxGMopBLRJAmsglU4QPBYzSGtguQfatvQFqKK3zyRpAbH1UgbNpTxLJVLyURamVGKk83KlRi4rqIfEgA8PEHIP2GqS9-4CygroJEnSgSGSXxmw3Qv61PJZ02XhpYMcQS0nHknvVAjVqx2PW55gjIC2i_kKp9AAKWOUl4lK1PfZI6QqDJajiOfwUJf_h76o3Bcccj8y2VcEhfT9tEnVBBe"/>
          </div>
          <div className="relative z-10 max-w-lg">
            <span className="text-primary font-label uppercase tracking-widest text-xs mb-4 block">Particuliers</span>
            <h2 className="font-headline text-5xl lg:text-7xl font-black text-on-surface leading-tight mb-8">
              La loi, expliquée <span className="italic text-primary">simplement</span>.
            </h2>
            <p className="text-on-surface-variant text-lg mb-10 leading-relaxed max-w-md">
              Comprenez vos droits sans jargon. Notre IA analyse vos contrats de location, de travail ou de vente en quelques secondes.
            </p>
            <Link to="/dashboard/b2c" className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all group/btn">
              <span className="material-symbols-outlined">description</span>
              Scanner un contrat
            </Link>
          </div>
        </div>

        {/* Right Side: Entreprises */}
        <div className="flex-1 relative bg-surface-container-low flex flex-col justify-center p-12 lg:p-24">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <img alt="Bureau moderne" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNdaZNk_qTdOYu3QComCLE0QUqAxml9iRXShgvfd7dpKXXg45lbdI5IBVIqvxPgETup8H3j7sHaNEJB_4oqTempBsTA9DqVgqi45-7fPEniKpfm-0wxEb2enAHLpPeNqYiLowIeAXPeecvpQ5p7r97SDIkQ6O4LEfD9oTuhKusqgkC_SnAFwNtJDpeujHcs2A0xzgCBuHPpegVFJgyRItMgBLGyCSMFSeADFzYGgBIH2Rd9QEBFu87adNUahE4O2jN1Ty1uXZrD3vE"/>
          </div>
          <div className="relative z-10 max-w-lg">
            <span className="text-secondary font-label uppercase tracking-widest text-xs mb-4 block">Professionnels</span>
            <h2 className="font-headline text-5xl lg:text-7xl font-black text-on-surface leading-tight mb-8">
              Sécurisez votre <span className="text-secondary">croissance</span>.
            </h2>
            <p className="text-on-surface-variant text-lg mb-10 leading-relaxed max-w-md">
              Automatisez votre conformité RGPD et auditez vos accords commerciaux avec la puissance de Gemini Pro.
            </p>
            <Link to="/dashboard/b2b" className="inline-flex items-center gap-3 bg-on-surface text-surface px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">
              <span className="material-symbols-outlined">verified_user</span>
              Audit de conformité
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h3 className="font-headline text-4xl lg:text-5xl mb-6">Un processus rigoureux, une rapidité digitale.</h3>
              <p className="text-on-surface-variant text-lg">Mizan fusionne l'expertise juridique séculaire avec l'intelligence artificielle de pointe.</p>
            </div>
            <div className="hidden lg:block h-[1px] flex-1 bg-outline-variant/30 mx-12 mb-6"></div>
            <div className="text-right">
              <span className="font-headline text-7xl text-primary/10 select-none">01-03</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Step 1 */}
            <div className="relative flex flex-col items-start">
              <div className="w-16 h-16 bg-primary-fixed text-primary rounded-full flex items-center justify-center mb-8 relative z-10">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <h4 className="font-headline text-2xl mb-4">1. Importez</h4>
              <p className="text-on-surface-variant leading-relaxed">
                Glissez-déposez vos PDF ou photos de documents. Notre OCR sécurisé extrait chaque clause avec précision.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative flex flex-col items-start">
              <div className="w-16 h-16 bg-secondary-fixed text-secondary rounded-full flex items-center justify-center mb-8 relative z-10">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <h4 className="font-headline text-2xl mb-4">2. Gemini analyse</h4>
              <p className="text-on-surface-variant leading-relaxed">
                L'IA de Google Gemini scanne les points de vigilance, les clauses abusives et les opportunités légales.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative flex flex-col items-start">
              <div className="w-16 h-16 bg-on-surface text-surface rounded-full flex items-center justify-center mb-8 relative z-10">
                <span className="material-symbols-outlined text-3xl">summarize</span>
              </div>
              <h4 className="font-headline text-2xl mb-4">3. Résumé clair</h4>
              <p className="text-on-surface-variant leading-relaxed">
                Obtenez un rapport structuré : risques identifiés, recommandations et synthèse en langage courant.
              </p>
            </div>
            {/* Horizontal Connector (Desktop) */}
            <div className="hidden md:block absolute top-8 left-16 right-16 h-[2px] bg-outline-variant/20 -z-0"></div>
          </div>
        </div>
      </section>

      {/* Bento Grid Services */}
      <section className="py-32 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Hero Bento Card */}
            <div className="md:col-span-8 bg-surface p-12 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-primary-fixed text-primary text-xs font-bold rounded-full mb-6">NOUVEAU</span>
                <h3 className="font-headline text-4xl mb-6">Assistance en temps réel</h3>
                <p className="text-on-surface-variant text-lg max-w-md mb-8">
                  Posez n'importe quelle question à votre assistant juridique Mizan. Disponible 24/7 pour lever vos doutes.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-medium">Essayer gratuitement</button>
                <span className="text-sm text-on-surface-variant italic">Utilisé par +5000 citoyens</span>
              </div>
            </div>

            {/* Side Bento Card 1 */}
            <div className="md:col-span-4 bg-secondary-container/30 p-10 rounded-3xl flex flex-col items-center text-center justify-center border border-secondary/10">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              </div>
              <h4 className="font-headline text-xl mb-4">Confidentialité Totale</h4>
              <p className="text-sm text-on-surface-variant">Vos données sont chiffrées de bout en bout et jamais utilisées pour l'entraînement.</p>
            </div>

            {/* Bottom Bento Cards */}
            <div className="md:col-span-4 bg-surface-container-high p-10 rounded-3xl">
              <h4 className="font-headline text-xl mb-4">Contrats de Travail</h4>
              <p className="text-on-surface-variant mb-6">Vérifiez vos clauses de non-concurrence et préavis.</p>
              <Link to="/dashboard/b2c" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Analyser <span className="material-symbols-outlined">arrow_right_alt</span>
              </Link>
            </div>
            <div className="md:col-span-4 bg-surface-container-high p-10 rounded-3xl">
              <h4 className="font-headline text-xl mb-4">Bail Immobilier</h4>
              <p className="text-on-surface-variant mb-6">Assurez-vous que votre dépôt de garantie est conforme.</p>
              <Link to="/dashboard/b2c" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Analyser <span className="material-symbols-outlined">arrow_right_alt</span>
              </Link>
            </div>

            <div className="md:col-span-4 bg-primary text-on-primary p-10 rounded-3xl flex flex-col justify-between">
              <h4 className="font-headline text-2xl">Devenir Membre Premium</h4>
              <p className="opacity-80">Accès illimité à l'audit et conseils d'avocats partenaires.</p>
              <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold mt-4 self-start">Voir les tarifs</button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA: The Trust Circle */}
      <section className="py-32 px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto bg-tertiary-fixed rounded-[100px] p-20 relative text-center">
          <div className="relative z-10">
            <h3 className="font-headline text-4xl lg:text-5xl mb-8">Reprenez le pouvoir sur vos documents.</h3>
            <p className="text-on-tertiary-fixed-variant text-lg mb-12 max-w-xl mx-auto">
              Ne signez plus jamais sans comprendre. Mizan Legal AI est votre bouclier contre les mauvaises surprises juridiques.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard/b2c" className="w-full sm:w-auto bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold shadow-xl text-center">Commencer l'analyse</Link>
              <button className="w-full sm:w-auto bg-transparent border-2 border-on-surface text-on-surface px-10 py-5 rounded-2xl font-bold">Parler à un expert</button>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
