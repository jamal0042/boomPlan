import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 4M7 13h10m0 0l1.5 6M17 13l1.5 6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ton panier est vide</h2>
            <p className="text-gray-600 mb-8">
              Verifie si tu n'as aucun Ticke dans ton panier.
            </p>
            <Link
              to="/events"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Parcourir les événements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">ajouter au Panier</h1>
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                vider le Panier
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => {
              const event = item.ticket.event || {};
              const eventDate = event.start_datetime ? new Date(event.start_datetime) : null;

              return (
                <div key={item.ticket_id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Event image */}
                    <div className="flex-shrink-0">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Event and ticket details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {event.title || 'Event Title'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.ticket.type} • {item.ticket.description}
                          </p>
                          {eventDate && (
                            <p className="text-sm text-gray-500">
                              {format(eventDate, 'EEE, MMM d, yyyy • h:mm a')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.ticket_id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Quantity and price controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.ticket_id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.ticket_id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            ${item.ticket.price.toFixed(2)} each
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            ${(item.ticket.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart summary */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Total: ${getTotalPrice().toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {items.reduce((total, item) => total + item.quantity, 0)} ticket(s)
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/events"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continuer l'achat
                </Link>
                <button
                  onClick={handleCheckout}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  passer à la verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;