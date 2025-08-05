// src/pages/EventDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ShareIcon,
  ClockIcon,
  TicketIcon,
  UsersIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useEvents } from '../../hooks/useEvents';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Event } from '../../types'; // Modification : Ticket a été supprimé de l'importation

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = id ? parseInt(id) : undefined;

  const { getEventById } = useEvents();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (eventId === undefined || isNaN(eventId)) {
        setError("ID d'événement invalide.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedEvent = await getEventById(eventId);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
          // Logique pour les favoris
        } else {
          setError("Événement non trouvé.");
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération des détails de l'événement:", err);
        setError(err.message || "Échec de la récupération des détails de l'événement.");
        toast.error(err.message || "Échec de la récupération des détails de l'événement.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, getEventById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-4 text-gray-700">Chargement de l'événement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link to="/events" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Retour aux événements
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Événement non trouvé</h2>
          <p className="text-gray-700 mb-6">L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link
            to="/events"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Parcourir d'autres Événements
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);

  const handleTicketQuantityChange = (ticketId: number, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, quantity),
    }));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour acheter des billets.');
      return;
    }

    let hasTickets = false;
    event.tickets?.forEach(ticket => {
      const quantity = selectedTickets[ticket.id] || 0;
      if (quantity > 0) {
        addToCart(ticket, quantity);
        hasTickets = true;
      }
    });

    if (!hasTickets) {
      toast.error('Veuillez réserver au moins un billet s\'il vous plaît.');
    } else {
      toast.success('Billets ajoutés au panier !');
    }
  };

  const toggleFavorite = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris.');
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
    // Logique d'appel API pour les favoris ici
  };

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Partage annulé', error);
      }
    } else {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast.success('Lien copié dans le presse-papier !');
      } catch (err) {
        toast.error('Échec de la copie du lien.');
        console.error('Échec de la copie du lien:', err);
      }
    }
  };

  const totalSelectedTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = event.tickets?.reduce((sum, ticket) => {
    const quantity = selectedTickets[ticket.id] || 0;
    return sum + (ticket.price * quantity);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 bg-gray-900">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/800x384/E0E7FF/4F46E5?text=Événement`;
            }}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={toggleFavorite}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6 text-gray-700" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
            aria-label="Partager l'événement"
          >
            <ShareIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h1>
                  {event.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {event.category.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <CalendarIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {format(startDate, 'EEEE d MMMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-gray-600">
                    {format(startDate, 'HH:mm', { locale: fr })} - {format(endDate, 'HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start space-x-4 mb-6">
                  <MapPinIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{event.location}</p>
                    {event.address && (
                      <p className="text-gray-600">
                        {event.address}, {event.city}, {event.country}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {event.organizer && (
                <div className="flex items-start space-x-4 mb-6">
                  <UserIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Organisé par</p>
                    <p className="text-gray-600">{event.organizer.name}</p>
                  </div>
                </div>
              )}

              {event.description && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">À propos de cet événement</h3>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              )}
            </div>

            {event.photos && event.photos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.photo_url}
                      alt="Event photo"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/128x128/E0E7FF/4F46E5?text=Photo`;
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Obtenir des billets</h2>

              {event.tickets && event.tickets.length > 0 ? (
                <div className="space-y-4">
                  {event.tickets.filter(ticket => ticket.is_active).map((ticket) => {
                    const availableQuantity = ticket.quantity_total - ticket.quantity_sold;
                    const selectedQuantity = selectedTickets[ticket.id] || 0;

                    return (
                      <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{ticket.type}</h4>
                            {ticket.description && (
                              <p className="text-sm text-gray-600">{ticket.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {ticket.price === 0 ? (
                              <span className="text-lg font-bold text-green-600">GRATUIT</span>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                ${ticket.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-500">
                            {availableQuantity} Disponible
                          </span>

                          {availableQuantity > 0 ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleTicketQuantityChange(ticket.id, selectedQuantity - 1)}
                                disabled={selectedQuantity <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium">{selectedQuantity}</span>
                              <button
                                onClick={() => handleTicketQuantityChange(ticket.id, selectedQuantity + 1)}
                                disabled={selectedQuantity >= availableQuantity}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-red-600 font-medium">Épuisé</span>)}
                        </div>
                      </div>
                    );
                  })}

                  {totalSelectedTickets > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Total billets:</span>
                        <span className="font-medium">{totalSelectedTickets}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Prix total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={totalSelectedTickets === 0}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <TicketIcon className="h-5 w-5 mr-2" />
                    Ajouter au Panier
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun billet disponible pour cet événement.</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    <span>{event.favorites_count || 0} intéressé(s)</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>
                      {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))}h durée
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
