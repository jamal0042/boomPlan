// src/pages/admin/AdminDashboard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
UsersIcon,
CalendarIcon,
TicketIcon,
ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext'; // Supposons que vous ayez un contexte d'authentification

const AdminDashboard: React.FC = () => {
// En production, vous devrez vérifier si l'utilisateur a le rôle 'admin'
const { user } = useAuth();
const isAdmin = user && user.role === 'admin'; // Exemple de vérification de rôle

if (!user || !isAdmin) {
return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-red-600">
    <h1 className="text-3xl font-bold mb-4">Accès refusé</h1>
    <p className="text-lg">Vous n'avez pas les autorisations nécessaires pour accéder à ce tableau de bord.</p>
    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Retour à l'accueil
    </Link>
    </div>
);
}

// Les "cartes" du tableau de bord
const dashboardCards = [
{
    title: 'Gestion des utilisateurs',
    description: 'Gérer les comptes utilisateurs, les rôles et les permissions.',
    icon: <UsersIcon className="h-12 w-12 text-blue-500" />,
    link: '/admin/users',
    bgColor: 'bg-blue-50',
},
{
    title: 'Gestion des événements',
    description: 'Approuver, modifier ou supprimer des événements.',
    icon: <CalendarIcon className="h-12 w-12 text-green-500" />,
    link: '/admin/events',
    bgColor: 'bg-green-50',
},
{
    title: 'Validation des tickets',
    description: 'Vérifier l\'état et les détails de tous les tickets.',
    icon: <TicketIcon className="h-12 w-12 text-purple-500" />,
    link: '/admin/tickets',
    bgColor: 'bg-purple-50',
},
{
    title: 'Rapports et analyses',
    description: 'Accéder aux statistiques et aux rapports sur la plateforme.',
    icon: <ChartBarIcon className="h-12 w-12 text-orange-500" />,
    link: '/admin/reports',
    bgColor: 'bg-orange-50',
},
];

return (
<div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">
        Tableau de bord administrateur
    </h1>
    <p className="text-lg text-gray-600 mb-8">
        Bienvenue, Admin. Gérez les aspects clés de la plateforme.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
        <Link
            key={index}
            to={card.link}
            className={`p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ${card.bgColor}`}
        >
            <div className="flex items-center mb-4">
            {card.icon}
            <h2 className="ml-4 text-2xl font-semibold text-gray-800">
                {card.title}
            </h2>
            </div>
            <p className="text-gray-600">{card.description}</p>
        </Link>
        ))}
    </div>
    </div>
</div>
);
};

export default AdminDashboard;
