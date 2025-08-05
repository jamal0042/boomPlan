// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Non Trouvée</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas. Il se peut qu'elle ait été déplacée ou supprimée.
        </p>
        <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            Retour à l'accueil
        </Link>
        </div>
    </div>
    );
};

export default NotFound;
