// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import OrganizerTicketsPage from './pages/organizer/OrganizerTicketsPage';

// Importation des pages d'administration
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Composant de protection de route qui vérifie si l'utilisateur est un administrateur
const AdminProtectedRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Affiche un indicateur de chargement en attendant l'authentification
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Vérifie si l'utilisateur est authentifié ET a un role_id de 3 (admin)
  const isAdmin = isAuthenticated && user?.role_id === 3;
  
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
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
                {/* Routes publiques */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/cart" element={<Cart />} />
                
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
                
                {/* Routes protégées par l'authentification */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/events/:id/edit" element={<EditEvent />} />
                <Route path="/organizer/tickets" element={<OrganizerTicketsPage />} />

                {/* Routes d'administration protégées par le rôle */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                </Route>

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
