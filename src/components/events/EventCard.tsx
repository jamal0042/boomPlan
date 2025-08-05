import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  MapPinIcon, 
  CalendarIcon, 
  HeartIcon, 
  ShareIcon,
  TagIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
  onToggleFavorite?: (eventId: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isFavorite = false, 
  onToggleFavorite 
}) => {
  const startDate = new Date(event.start_datetime);
  const minPrice = event.tickets?.length ? 
    Math.min(...event.tickets.filter(t => t.is_active).map(t => t.price)) : 0;
  const hasFreeTags = event.tickets?.some(ticket => ticket.price === 0);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(event.id);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.origin + `/events/${event.id}`,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin + `/events/${event.id}`);
    }
  };

  return (
    <Link 
      to={`/events/${event.id}`}
      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        {/* Overlay with actions */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleFavoriteClick}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={handleShareClick}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <ShareIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Price tag */}
        <div className="absolute bottom-3 left-3">
          {hasFreeTags ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              LIBRE
            </span>
          ) : (
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              POUR ${minPrice}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Date and Time */}
        <div className="flex items-center text-blue-600 text-sm font-medium mb-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          {format(startDate, 'EEE, MMM d')} • {format(startDate, 'h:mm a')}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Location */}
        {event.location && (
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{event.location}, {event.city}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Tags and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {event.category && (
              <div className="flex items-center text-purple-600 text-xs">
                <TagIcon className="h-3 w-3 mr-1" />
                {event.category.name}
              </div>
            )}
          </div>
          
          {event.favorites_count && event.favorites_count > 0 && (
            <div className="flex items-center text-gray-500 text-xs">
              <HeartSolidIcon className="h-3 w-3 mr-1 text-red-500" />
              {event.favorites_count}
            </div>
          )}
        </div>

        {/* Ticket availability indicator */}
        {event.tickets && event.tickets.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {event.tickets.reduce((acc, ticket) => acc + (ticket.quantity_total - ticket.quantity_sold), 0)} tickets available
              </span>
              <span className="text-blue-600 font-medium group-hover:text-blue-700">
                Voir les Details →
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default EventCard;