// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Importez vos pages principales
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Events from './pages/events/Events';
import EventDetail from './pages/events/EventDetail';
import Cart from './pages/Cart';
import CreateEvent from './pages/organizer/CreateEvent';
import EditEvent from './pages/events/EditEvent';
import Profile from './pages/Profile'; 
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import NotFound from './pages/NotFound';

// Import des pages statiques
import AboutPage from './pages/Static/AboutPage';
import PrivacyPolicyPage from './pages/Static/PrivacyPolicyPage';
import FAQPage from './pages/Static/FAQPage';
import TermsOfServicePage from './pages/Static/TermsOfServicePage';
import GDPRPage from './pages/Static/GDPRPage';
import CookiesPage from './pages/Static/CookiesPage'; 
import HelpPage from './pages/Static/HelpPage'; 
import ContactPage from './pages/Static/ContactPage';
import PricingPage from './pages/Static/PricingPage';
import SystemStatusPage from './pages/Static/SystemStatusPage';

// Importation de la nouvelle page de tickets pour les organisateurs
import OrganizerTicketsPage from './pages/organizer/OrganizerTicketsPage';

// AJOUTÉ : Importation des pages d'administration
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* Toaster doit être ici pour être disponible dans toute l'application */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/events/:id/edit" element={<EditEvent />} /> 
                <Route path="/cart" element={<Cart />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/organizer/dashboard" element={<OrganizerDashboard />} /> 
                
                {/* NOUVELLE ROUTE AJOUTÉE : Pour la page de gestion des tickets des organisateurs */}
                <Route path="/organizer/tickets" element={<OrganizerTicketsPage />} />

                {/* Routes pour les pages statiques */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/gdpr" element={<GDPRPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/status" element={<SystemStatusPage />} />
                
                {/* AJOUTÉ : Routes pour l'administration */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />

                {/* Fallback pour les routes non trouvées */}
                <Route path="*" element={<NotFound />} /> 
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
