// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  ShoppingCartIcon,
  BellIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // Assurez-vous que ce chemin est correct

const Navbar: React.FC = () => {
  // CORRECTION: Ajouter 'loading' à la déstructuration de useAuth
  const { user, isAuthenticated, loading, logout } = useAuth(); 
  const { getTotalItems } = useCart(); 
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const cartItemsCount = getTotalItems();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BoomPlan</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher les evenements..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* CORRECTION: Afficher les éléments d'authentification seulement après le chargement */}
            {loading ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                <span>Chargement...</span>
              </div>
            ) : isAuthenticated ? ( 
              <>
                {(user?.role_id === 2 || user?.role_id === 3) && ( 
                  <Link
                    to="/create-event"
                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Creer un evennement</span>
                  </Link>
                )}
                
                {/* Cart */}
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <Link to="/notifications" className="p-2 text-gray-600 hover:text-gray-900">
                  <BellIcon className="h-6 w-6" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    {user?.avatar_url ? ( 
                      <img
                        src={user.avatar_url}
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/32x32/E0E7FF/4F46E5?text=${user?.name ? user.name[0].toUpperCase() : 'U'}`;
                        }}
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">{user?.name || 'Profil'}</span> 
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/events"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Mes Evenements
                      </Link>
                      <Link
                        to="/my-tickets"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Mes Tickets
                      </Link>
                      {(user?.role_id === 2 || user?.role_id === 3) && ( 
                        <Link
                          to="/organizer/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Tableau de bord Organisateur
                        </Link>
                      )}
                      {user?.role_id === 3 && ( 
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Paneau Administrateur 
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Se Deconnecter
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Se Connecter
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Recherche des evenements..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
                    setIsMenuOpen(false); 
                  }
                }}
              />
            </div>

            {/* CORRECTION: Afficher les éléments d'authentification seulement après le chargement */}
            {loading ? (
              <div className="flex items-center justify-center py-2 text-gray-700">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent mr-2"></div>
                <span>Chargement...</span>
              </div>
            ) : isAuthenticated ? ( 
              <>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon Profile
                </Link>
                <Link
                  to="/my-events"
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mes Evenements
                </Link>
                <Link
                  to="/my-tickets"
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mes Tickets
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center justify-between text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Panier</span>
                  {cartItemsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                {(user?.role_id === 2 || user?.role_id === 3) && ( 
                  <Link
                    to="/create-event"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Creeer un Evenement
                  </Link>
                )}
                {user?.role_id === 3 && ( 
                  <Link
                    to="/admin/dashboard"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Paneau Administrateur
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 py-2"
                >
                  Se Deconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se Connecter
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
