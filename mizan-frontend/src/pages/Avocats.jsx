import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MOCK_LAWYERS = [
  { 
    id: 1, 
    name: "Maître Nawal Ghaouti", 
    specialty: "Droit des contrats & B2B", 
    rating: 4.9, 
    reviews: 154, 
    availability: "Aujourd'hui",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
  },
  { 
    id: 2, 
    name: "Cabinet Bassamat & Laraqui", 
    specialty: "Droit des Sociétés", 
    rating: 4.8, 
    reviews: 210, 
    availability: "Demain",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" 
  },
  { 
    id: 3, 
    name: "Maître Fatima Z. Benmansour", 
    specialty: "Droit du Travail", 
    rating: 4.8, 
    reviews: 89, 
    availability: "Dans 2 jours",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" 
  },
  { 
    id: 4, 
    name: "Maître Youssef El Fassi", 
    specialty: "Contentieux Commercial", 
    rating: 4.7, 
    reviews: 67, 
    availability: "Aujourd'hui",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200" 
  },
];

const Avocats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const result = location.state?.result;
  
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [message, setMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);

  const [subject, setSubject] = useState("Consultation Juridique Standard (Visio)");

  const handleSelectLawyer = (lawyer) => {
    setSelectedLawyer(lawyer);
    setRequestStatus(null);
    setMeetingDate('');
    setMessage('');
    setSubject("Consultation Juridique Standard (Visio)");
  };

  const handleBookMeeting = async (e) => {
    e.preventDefault();
    if(!meetingDate) {
      alert("Veuillez sélectionner une date de rendez-vous.");
      return;
    }
    setRequestStatus('sending');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/demands`, {
        lawyerName: selectedLawyer.name,
        lawyerImage: selectedLawyer.image,
        subject: subject,
        message: message,
        date: meetingDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequestStatus('sent');
      setTimeout(() => {
        navigate('/demands');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la demande");
      setRequestStatus(null);
    }
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed-dim min-h-screen font-sans flex">
      <Sidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 min-h-screen flex flex-col min-w-0 bg-background relative">
        {/* TopNavBar */}
        <header className="bg-[#fcf9f5]/80 backdrop-blur-md dark:bg-[#1c1c1a]/80 flex justify-between items-center w-full px-12 py-4 docked full-width top-0 z-40 sticky shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-black text-[#1c1c1a] dark:text-[#fcf9f5]"><Link to="/">Mizan</Link></h1>
            <div className="bg-[#f6f3ef] dark:bg-[#2a2a28] h-6 w-[1px] mx-2"></div>
            <span className="font-serif text-lg tracking-tight text-[#1c1c1a]/70 dark:text-[#fcf9f5]/70">Réseau d'Avocats</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-medium text-sm">Bienvenue, {user?.name || 'Utilisateur'}</span>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div className="px-12 py-12 flex-grow flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Lawyers List */}
          <div className={`flex-1 transition-all ${selectedLawyer ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="mb-10">
              <h2 className="text-4xl font-serif font-bold text-on-surface tracking-tight mb-2">Avocats Partenaires</h2>
              <p className="text-on-surface-variant font-body text-lg">
                Rencontrez les meilleurs experts pour vous accompagner.
              </p>
              {result && (
                <div className="mt-4 p-4 bg-secondary/10 border border-secondary/20 rounded-xl inline-flex items-center gap-3 text-sm font-medium text-secondary-container-dark">
                  <span className="material-symbols-outlined text-secondary">magic_button</span>
                  Ces profils sont particulièrement recommandés pour traiter votre dossier d'analyse en cours.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_LAWYERS.map((lawyer) => (
                <div 
                  key={lawyer.id} 
                  onClick={() => handleSelectLawyer(lawyer)}
                  className={`bg-surface-container-low border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${selectedLawyer?.id === lawyer.id ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-outline-variant/20 hover:border-primary/50'}`}
                >
                  <div className="p-6 flex flex-col items-center text-center gap-4">
                    <img src={lawyer.image} alt={lawyer.name} className="w-24 h-24 rounded-full object-cover shadow-sm border-4 border-surface" />
                    <div>
                      <h3 className="font-serif font-bold text-lg">{lawyer.name}</h3>
                      <p className="text-secondary font-medium text-sm mt-1">{lawyer.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-highest px-3 py-1 rounded-full">
                      <span className="material-symbols-outlined text-yellow-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold">{lawyer.rating}</span>
                      <span className="text-xs text-on-surface-variant ml-1">({lawyer.reviews} avis)</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Dispo: {lawyer.availability}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Booking Form */}
          {selectedLawyer && (
            <div className="lg:w-1/2 mt-12 lg:mt-0 lg:pl-8 lg:border-l border-outline-variant/20 animate-in slide-in-from-right-8 duration-500">
              <div className="sticky top-24 bg-surface-container-lowest p-8 rounded-2xl shadow-lg border border-outline-variant/10 relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    Prendre Rendez-vous
                  </h3>
                  <button onClick={() => setSelectedLawyer(null)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl mb-8">
                  <img src={selectedLawyer.image} alt={selectedLawyer.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <p className="font-bold">{selectedLawyer.name}</p>
                    <p className="text-xs text-on-surface-variant">{selectedLawyer.specialty}</p>
                  </div>
                </div>

                {requestStatus === 'sending' ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                     <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-4">sync</span>
                     <p className="font-serif text-xl font-bold">Transmission au cabinet...</p>
                     <p className="text-on-surface-variant text-sm mt-2">Votre analyse et vos coordonnées sont en cours d'envoi sécurisé.</p>
                  </div>
                ) : requestStatus === 'sent' ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                     <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-5xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                     </div>
                     <p className="font-serif text-2xl font-bold mb-2">Demande Envoyée !</p>
                     <p className="text-on-surface-variant mb-8 px-4">
                       {selectedLawyer.name} a bien reçu votre demande de consultation pour le <strong>{new Date(meetingDate).toLocaleDateString()}</strong>.
                     </p>
                     <div className="inline-flex items-center gap-2 bg-warning-container text-on-warning-container px-4 py-2 rounded-lg font-medium text-sm">
                        <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                        En attente de confirmation du cabinet
                     </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookMeeting} className="flex flex-col gap-6">
                    {result && (
                       <div className="p-3 bg-surface-container-high rounded-lg flex items-start gap-3 border border-outline-variant/20">
                          <span className="material-symbols-outlined text-primary text-sm mt-0.5">attach_file</span>
                          <span className="text-xs text-on-surface-variant leading-relaxed">
                            <strong>Note :</strong> Mizan joindra automatiquement le résumé de l'analyse juridique actuelle lors de la demande pour que l'avocat ait tout le contexte.
                          </span>
                       </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date et Heure Souhaitée</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/40 font-sans shadow-sm" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Sujet de la consultation</label>
                      <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/40 font-sans shadow-sm">
                        <option>Consultation Juridique Standard (Visio)</option>
                        <option>Contestation / Contentieux</option>
                        <option>Relecture de documents</option>
                        <option>Rendez-vous au cabinet physique</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Message supplémentaire (Optionnel)</label>
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Précisez votre demande ou vos disponibilités..."
                        className="w-full p-4 h-28 bg-surface-container-lowest border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/40 font-sans shadow-sm"
                      ></textarea>
                    </div>

                    <button type="submit" className="w-full py-4 bg-[#1c1c1a] text-[#fcf9f5] dark:bg-[#fcf9f5] dark:text-[#1c1c1a] rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Confirmer la demande
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Avocats;
