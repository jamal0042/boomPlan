import React, { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import EventList from '../../components/events/EventList';
import { useEvents } from '../../hooks/useEvents';
import { SearchFilters } from '../../types';

const Events: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { events, loading } = useEvents(filters);

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parcourir les Evenements</h1>
            <p className="text-gray-600 mt-1">Find amazing events happening near you</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filtres</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.query || ''}
                    onChange={(e) => handleFilterChange({ query: e.target.value })}
                    placeholder="Search events..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={filters.city || ''}
                    onChange={(e) => handleFilterChange({ city: e.target.value })}
                    placeholder="City, venue..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={filters.date_from || ''}
                      onChange={(e) => handleFilterChange({ date_from: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={filters.date_to || ''}
                      onChange={(e) => handleFilterChange({ date_to: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.price_min || ''}
                      onChange={(e) => handleFilterChange({ price_min: parseFloat(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.price_max || ''}
                      onChange={(e) => handleFilterChange({ price_max: parseFloat(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Free Events */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.is_free || false}
                      onChange={(e) => handleFilterChange({ is_free: e.target.checked || undefined })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Free events only</span>
                  </label>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Toutes les categories</option>
                    <option value="technology">Technologies</option>
                    <option value="music">Musique</option>
                    <option value="business">Business</option>
                    <option value="art">Art & Culture</option>
                    <option value="sports">Sports</option>
                    <option value="food">Cuisine & Recettes</option>
                    <option value="education">Education</option>
                    <option value="health">Santé & Bien-etre</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-3">
            <EventList
              events={events}
              loading={loading}
              title="All Events"
              emptyMessage="No events match your current filters. Try adjusting your search criteria."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;