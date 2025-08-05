import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    if (date) params.append('date', date);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Query */}
        <div className="md:col-span-2 relative">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Que cherche vous maintenant?
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, artists, venues..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Location */}
        <div className="relative">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            où?
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, venue..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Date */}
        <div className="relative">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Quand?
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Button - Full width on mobile */}
        <div className="md:col-span-4 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Rechercher l'événement
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;