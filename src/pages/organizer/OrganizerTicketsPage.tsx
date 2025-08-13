import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ArrowRightOnRectangleIcon, TicketIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify'; // Supposons que vous utilisez react-toastify pour les notifications

// Définition des types pour les données simulées
interface Ticket {
id: string;
eventName: string;
ticketHolderName: string;
ticketType: string;
purchaseDate: string;
status: 'valid' | 'pending' | 'used';
eventUrl: string;
ticketPrice: number;
}

const OrganizerTicketsPage: React.FC = () => {
const { user } = useAuth();
const [tickets, setTickets] = useState<Ticket[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Fonction pour simuler la récupération de données depuis une API
const fetchOrganizerTickets = async () => {
// Simuler un appel API
try {
    setLoading(true);
    // Remplacez cette logique par votre véritable appel API
    // Exemple: const response = await fetch(`/api/organizer/${user?.id}/tickets`);
    // const data = await response.json();

    // Données de tickets simulées pour la démonstration
    const mockTickets: Ticket[] = [
    {
        id: 'TKT-12345',
        eventName: 'Conférence Tech 2024',
        ticketHolderName: 'Jean Dupont',
        ticketType: 'VIP',
        purchaseDate: '2024-05-10',
        status: 'valid',
        eventUrl: '/events/tech-conference-2024',
        ticketPrice: 150,
    },
    {
        id: 'TKT-67890',
        eventName: 'Festival de Musique d\'Été',
        ticketHolderName: 'Marie Curie',
        ticketType: 'Standard',
        purchaseDate: '2024-05-15',
        status: 'pending',
        eventUrl: '/events/summer-music-festival',
        ticketPrice: 50,
    },
    {
        id: 'TKT-11223',
        eventName: 'Atelier de Cuisine Italienne',
        ticketHolderName: 'Pierre Bernard',
        ticketType: 'Standard',
        purchaseDate: '2024-05-18',
        status: 'used',
        eventUrl: '/events/italian-cooking-workshop',
        ticketPrice: 75,
    },
    ];
    
    setTickets(mockTickets);
    setError(null);
} catch (err) {
    console.error('Erreur lors de la récupération des tickets:', err);
    setError('Impossible de récupérer les tickets. Veuillez réessayer plus tard.');
    setTickets([]);
} finally {
    setLoading(false);
}
};

useEffect(() => {
if (user) {
    fetchOrganizerTickets();
}
}, [user]);

const handleValidateTicket = (ticketId: string) => {
// Logique de validation de ticket
console.log(`Validation du ticket ${ticketId}...`);
// Mettre à jour l'état du ticket
const updatedTickets = tickets.map(ticket => 
    ticket.id === ticketId ? { ...ticket, status: 'used' } : ticket
);
setTickets(updatedTickets);
// Afficher une notification
toast.success(`Le ticket ${ticketId} a été validé avec succès.`);
};

const getStatusClasses = (status: 'valid' | 'pending' | 'used') => {
switch (status) {
    case 'valid':
    return 'bg-green-100 text-green-800';
    case 'pending':
    return 'bg-yellow-100 text-yellow-800';
    case 'used':
    return 'bg-gray-100 text-gray-800';
    default:
    return 'bg-gray-100 text-gray-800';
}
};

if (loading) {
return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    <p className="ml-4 text-lg text-gray-700">Chargement des tickets...</p>
    </div>
);
}

if (error) {
return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-red-600">
    <ExclamationTriangleIcon className="h-12 w-12 mb-4" />
    <p className="text-xl font-semibold">{error}</p>
    </div>
);
}

if (!user) {
return (
    <div className="text-center p-8">
    <p className="text-xl font-semibold text-gray-700">Vous devez être connecté pour voir cette page.</p>
    <Link to="/login" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Se connecter
    </Link>
    </div>
);
}

return (
<div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">
        Tickets de mes Événements
    </h1>
    <p className="text-lg text-gray-600 mb-8">
        Gérez et validez les tickets vendus pour vos événements.
    </p>

    {tickets.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détenteur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type de Ticket
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                        <TicketIcon className="h-5 w-5 mr-2 text-blue-500" />
                        {ticket.id}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={ticket.eventUrl} className="text-sm font-medium text-blue-600 hover:underline">
                        {ticket.eventName}
                    </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.ticketHolderName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.ticketType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(ticket.status)}`}>
                        {ticket.status === 'valid' ? 'Valide' : ticket.status === 'pending' ? 'En attente' : 'Utilisé'}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {ticket.status === 'valid' && (
                        <button
                        onClick={() => handleValidateTicket(ticket.id)}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-xs transition-colors flex items-center"
                        >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Valider
                        </button>
                    )}
                    {ticket.status === 'pending' && (
                        <span className="text-gray-500 text-xs">En attente de paiement</span>
                    )}
                    {ticket.status === 'used' && (
                        <span className="text-gray-500 text-xs">Ticket déjà utilisé</span>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">Aucun ticket trouvé.</h2>
        <p className="mt-2 text-gray-600">
            Il se peut que vous n'ayez pas encore vendu de tickets pour vos événements.
        </p>
        </div>
    )}
    </div>
</div>
);
};

export default OrganizerTicketsPage;
