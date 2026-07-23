import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardB2C from './pages/DashboardB2C';
import DashboardB2B from './pages/DashboardB2B';
import IAAnalyst from './pages/IAAnalyst';
import Connexion from './pages/Connexion';
import CreationCompte from './pages/CreationCompte';
import Historique from './pages/Historique';
import Avocats from './pages/Avocats';
import Demandes from './pages/Demandes';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col font-sans">
            <Routes>
              <Route path="/" element={
                <>
                  <NavBar />
                  <div className="flex-grow">
                    <LandingPage />
                  </div>
                  <Footer />
                </>
              } />
              <Route path="/login" element={<Connexion />} />
              <Route path="/register" element={<CreationCompte />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/b2c" element={<DashboardB2C />} />
                <Route path="/dashboard/b2b" element={<DashboardB2B />} />
                <Route path="/analyze" element={<IAAnalyst />} />
                <Route path="/history" element={<Historique />} />
                <Route path="/lawyers" element={<Avocats />} />
                <Route path="/demands" element={<Demandes />} />
              </Route>
            </Routes>
            <ChatbotWidget />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
