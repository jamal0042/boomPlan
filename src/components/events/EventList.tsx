import React from 'react';
import { Event } from '../../types';
import EventCard from './EventCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  favorites?: number[];
  onToggleFavorite?: (eventId: number) => void;
  title?: string;
  emptyMessage?: string;
}

const EventList: React.FC<EventListProps> = ({
  events,
  loading = false,
  favorites = [],
  onToggleFavorite,
  title,
  emptyMessage = "No events found."
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1h3z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Pas d'evenements</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{events.length} evennement trouve</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isFavorite={favorites.includes(event.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;