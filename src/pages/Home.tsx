// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  UsersIcon, 
  GlobeAltIcon, 
  SparklesIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import SearchBar from '../components/common/SearchBar';
import EventList from '../components/events/EventList';
import { useEvents } from '../hooks/useEvents';

const Home: React.FC = () => {
  const { events, loading } = useEvents();

  // Correction: Assurez-vous que 'events' est un tableau avant d'appeler .slice()
  // Si 'events' est undefined (par exemple, pendant le chargement), utilisez un tableau vide.
  const featuredEvents = (events || []).slice(0, 6); 

  const features = [
    {
      icon: CalendarIcon,
      title: 'Discover Events',
      description: 'Find amazing events happening near you or around the world.',
    },
    {
      icon: UsersIcon,
      title: 'Connect with People',
      description: 'Meet like-minded people and build lasting connections.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Access events from anywhere, anytime, on any device.',
    },
    {
      icon: SparklesIcon,
      title: 'Create Memories',
      description: 'Attend unforgettable experiences and create lasting memories.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Découvrez des événements exceptionnels
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Trouvez ou organisez des conférences, mariages et plus encore.
            </p>
          </div>
          
          <SearchBar />
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/events"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              Parcourir tous les evenements
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/create-event"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Creer ton premien evenement
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BoomPlan?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to discover, attend, and create amazing events that bring people together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-gray-600">
              Ne manquez pas cette grande boom
            </p>
          </div>
          
          {/* L'EventList doit gérer son propre état de chargement et d'erreur si nécessaire */}
          <EventList events={featuredEvents} loading={loading} /> 
          
          <div className="text-center mt-12">
            <Link
              to="/events"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              afficher tous les evenements
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pret a creeer un evenement?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of organizers who trust BoomPlan to power their events.
          </p>
          <Link
            to="/create-event"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center text-lg"
          >
            Get Started Free
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
