// src/pages/organizer/OrganizerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
CalendarDaysIcon,
MapPinIcon,
TicketIcon,
PencilSquareIcon,
TrashIcon,
PlusIcon,
CubeTransparentIcon,
ChartBarIcon, // Icône pour les statistiques
UsersIcon, // Icône pour les participants
EyeIcon, // Importation de EyeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../hooks/useEvents';  
import { Event } from '../../types'; // Importez le type Event

const OrganizerDashboard: React.FC = () => {
const { user, loading: authLoading, isAuthenticated } = useAuth();
const { getEventsByOrganizerId } = useEvents(); // Assurez-vous que cette fonction est disponible
const navigate = useNavigate();

const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
const [eventsLoading, setEventsLoading] = useState(true);
const [eventsError, setEventsError] = useState<string | null>(null);

// Redirection si l'utilisateur n'est pas authentifié ou n'est pas organisateur/admin
useEffect(() => {
if (!authLoading) {
    if (!isAuthenticated) {
    toast.error("Vous devez être connecté pour accéder à cette page.");
    navigate('/login');
    } else if (user?.role_id !== 2 && user?.role_id !== 3) { // 2 pour Organisateur, 3 pour Admin
    toast.error("Accès refusé. Vous n'êtes pas autorisé à voir ce tableau de bord.");
    navigate('/'); // Rediriger vers l'accueil ou une autre page
    }
}
}, [authLoading, isAuthenticated, user, navigate]);

// Chargement des événements de l'organisateur
useEffect(() => {
const fetchEvents = async () => {
    if (user && (user.role_id === 2 || user.role_id === 3)) {
    setEventsLoading(true);
    setEventsError(null);
    try {
        const events = await getEventsByOrganizerId(user.id);
        setOrganizerEvents(events);
    } catch (err: any) {
        console.error("Erreur lors de la récupération des événements de l'organisateur:", err);
        setEventsError(err.message || "Échec du chargement de vos événements.");
        toast.error(err.message || "Échec du chargement de vos événements.");
    } finally {
        setEventsLoading(false);
    }
    }
};

if (!authLoading && user) { // S'assurer que l'authentification est terminée et que l'utilisateur est défini
    fetchEvents();
}
}, [user, authLoading, getEventsByOrganizerId]);

const handleDeleteEvent = async (eventId: number, eventTitle: string) => {
// IMPORTANT: Remplacer window.confirm par une modale personnalisée
if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${eventTitle}" ? Cette action est irréversible.`)) {
    // Logique de suppression d'événement (à implémenter dans useEvents ou un service dédié)
    toast.success(`L'événement "${eventTitle}" a été supprimé (simulé).`);
    // Après suppression réelle, recharger les événements
    // await getEventsByOrganizerId(user.id);
    setOrganizerEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
}
};

// Calcul des statistiques
const totalEvents = organizerEvents.length;
const upcomingEvents = organizerEvents.filter(event => 
event.start_datetime && !isNaN(new Date(event.start_datetime).getTime()) && new Date(event.start_datetime) > new Date()
).length;
const pastEvents = totalEvents - upcomingEvents;

if (authLoading || eventsLoading) {
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    <p className="ml-4 text-gray-700">Chargement du tableau de bord...</p>
    </div>
);
}

if (eventsError) {
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h2>
        <p className="text-gray-700 mb-6">{eventsError}</p>
        <button
        onClick={() => window.location.reload()} // Simple rechargement pour réessayer
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
        Réessayer
        </button>
    </div>
    </div>
);
}

if (!isAuthenticated || (user?.role_id !== 2 && user?.role_id !== 3)) {
// Ce cas devrait être géré par l'useEffect de redirection, mais c'est une sécurité
return null; 
}

return (
<div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Organisateur</h1>
        <Link
            to="/create-event"
            className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
            <PlusIcon className="h-5 w-5" />
            <span>Créer un nouvel événement</span>
        </Link>
        </div>

        {/* Section Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <ChartBarIcon className="h-10 w-10 text-blue-600" />
            <div>
            <p className="text-sm font-medium text-gray-600">Total Événements</p>
            <p className="text-3xl font-bold text-blue-800">{totalEvents}</p>
            </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <CalendarDaysIcon className="h-10 w-10 text-green-600" />
            <div>
            <p className="text-sm font-medium text-gray-600">Événements à Venir</p>
            <p className="text-3xl font-bold text-green-800">{upcomingEvents}</p>
            </div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <TicketIcon className="h-10 w-10 text-yellow-600" />
            <div>
            <p className="text-sm font-medium text-gray-600">Événements Passés</p>
            <p className="text-3xl font-bold text-yellow-800">{pastEvents}</p>
            </div>
        </div>
        </div>

        {/* Liste des Événements */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Événements</h2>

        {organizerEvents.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
            <CubeTransparentIcon className="h-16 w-16 mx-auto mb-6 text-gray-400" />
            <p className="text-lg mb-4">Vous n'avez pas encore créé d'événements.</p>
            <Link
            to="/create-event"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
            <PlusIcon className="h-5 w-5" />
            <span>Commencez par créer votre premier événement !</span>
            </Link>
        </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizerEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <img
                src={event.image_url || `https://placehold.co/400x200/E0E7FF/4F46E5?text=Event`}
                alt={event.title}
                className="w-full h-40 object-cover"
                onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/400x200/E0E7FF/4F46E5?text=Event`;
                }}
                />
                <div className="p-4">
                <h3 className="font-semibold text-xl text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 flex items-center mb-1">
                    <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {event.start_datetime && !isNaN(new Date(event.start_datetime).getTime())
                    ? format(new Date(event.start_datetime), 'PPPp', { locale: fr })
                    : 'Date inconnue'}
                </p>
                <p className="text-sm text-gray-600 flex items-center mb-3">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {event.location}, {event.city}
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                    <Link
                    to={`/events/${event.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                    <EyeIcon className="h-4 w-4 mr-1" /> Voir
                    </Link>
                    <Link
                    to={`/events/${event.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition-colors"
                    >
                    <PencilSquareIcon className="h-4 w-4 mr-1" /> Modifier
                    </Link>
                    <button
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                    >
                    <TrashIcon className="h-4 w-4 mr-1" /> Supprimer
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
    </div>
</div>
);
};

export default OrganizerDashboard;
