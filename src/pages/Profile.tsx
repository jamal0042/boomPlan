// src/pages/Profile.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import {
UserIcon,
EnvelopeIcon,
PhoneIcon,
MapPinIcon,
CalendarDaysIcon,
TicketIcon,
CubeTransparentIcon,
PencilSquareIcon,
CheckIcon,
ArrowPathIcon,
TagIcon,
CreditCardIcon,
} from '@heroicons/react/24/outline';
//import { UsersIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { useOrders } from '../hooks/useOrders'; 
import { User, Event, Order } from '../types'; // Importation des types nécessaires

// Interfaces pour les données du formulaire de profil
interface ProfileFormData {
name: string;
email: string;
phone?: string;
bio?: string;
avatar_url?: string;
}

const Profile: React.FC = () => {
const navigate = useNavigate();
// Assurez-vous que updateUserProfile est bien exporté de useAuth
const { user, updateUserProfile } = useAuth(); 
// Assurez-vous que getEventsByOrganizerId est bien exporté de useEvents
const { getEventsByOrganizerId } = useEvents(); 
// Assurez-vous que fetchUserOrders est bien exporté de useOrders
const { fetchUserOrders } = useOrders(); 

const [activeTab, setActiveTab] = useState<'profile' | 'events' | 'orders'>('profile');
const [isEditingProfile, setIsEditingProfile] = useState(false);

const [userEvents, setUserEvents] = useState<Event[]>([]);
const [userEventsLoading, setUserEventsLoading] = useState(true);
const [userEventsError, setUserEventsError] = useState<string | null>(null);

const [userOrders, setUserOrders] = useState<Order[]>([]); 
const [userOrdersLoading, setUserOrdersLoading] = useState(true);
const [userOrdersError, setUserOrdersError] = useState<string | null>(null);

// Initialisation du formulaire avec les données de l'utilisateur
const {
register,
handleSubmit,
reset,
formState: { errors, isSubmitting },
} = useForm<ProfileFormData>({
defaultValues: {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '',
},
});

// Mettre à jour les valeurs par défaut du formulaire lorsque l'utilisateur change
useEffect(() => {
if (user) {
    reset({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    avatar_url: user.avatar_url || '',
    });
}
}, [user, reset]);

// Rediriger si l'utilisateur n'est pas connecté
useEffect(() => {
if (!user) {
    toast.error("Vous devez être connecté pour accéder à votre profil.");
    navigate('/login');
}
}, [user, navigate]);

// Récupérer les événements de l'utilisateur (si organisateur/admin)
useEffect(() => {
const loadUserEvents = async () => {
    if (user && (user.role_id === 2 || user.role_id === 3) && activeTab === 'events') {
    setUserEventsLoading(true);
    setUserEventsError(null);
    try {
        const events = await getEventsByOrganizerId(user.id);
        setUserEvents(events);
    } catch (err: any) {
        console.error("Erreur lors de la récupération des événements de l'utilisateur:", err);
        setUserEventsError(err.message || "Échec de la récupération de vos événements.");
        toast.error(err.message || "Échec de la récupération de vos événements.");
    } finally {
        setUserEventsLoading(false);
    }
    }
};
loadUserEvents();
}, [user, activeTab, getEventsByOrganizerId]);

// Récupérer les commandes de l'utilisateur
useEffect(() => {
const loadUserOrders = async () => {
    if (user && activeTab === 'orders') {
    setUserOrdersLoading(true);
    setUserOrdersError(null);
    try {
        const orders = await fetchUserOrders();
        setUserOrders(orders);
    } catch (err: any) {
        console.error("Erreur lors de la récupération des commandes de l'utilisateur:", err);
        setUserOrdersError(err.message || "Échec de la récupération de vos commandes.");
        toast.error(err.message || "Échec de la récupération de vos commandes.");
    } finally {
        setUserOrdersLoading(false);
    }
    }
};
loadUserOrders();
}, [user, activeTab, fetchUserOrders]);

// Gérer la soumission du formulaire de profil
const onSubmitProfile = async (data: ProfileFormData) => {
if (!user) return;
try {
    await updateUserProfile(user.id, data);
    toast.success('Profil mis à jour avec succès !');
    setIsEditingProfile(false); // Quitter le mode édition
} catch (err: any) {
    console.error("Erreur lors de la mise à jour du profil:", err);
    toast.error(err.message || 'Échec de la mise à jour du profil.');
}
};

if (!user) {
// Cela devrait être géré par l'useEffect ci-dessus, mais c'est une sécurité
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <p className="text-gray-700">Redirection vers la page de connexion...</p>
    </div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header du profil */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 h-48 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative text-center">
            <img
            src={user.avatar_url || `https://placehold.co/120x120/E0E7FF/4F46E5?text=${user.name ? user.name[0].toUpperCase() : 'U'}`}
            alt={user.name || 'Utilisateur'}
            className="w-24 h-24 rounded-full border-4 border-white mx-auto object-cover shadow-md"
            onError={(e) => {
                e.currentTarget.src = `https://placehold.co/120x120/E0E7FF/4F46E5?text=${user.name ? user.name[0].toUpperCase() : 'U'}`;
            }}
            />
            <h1 className="text-white text-3xl font-bold mt-3">{user.name}</h1>
            <p className="text-blue-100 text-lg">{user.email}</p>
            <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
            {user.role?.name || 'Utilisateur'}
            </span>
        </div>
        </div>

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200">
        <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
            <button
            onClick={() => setActiveTab('profile')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            >
            Mes Informations
            </button>
            {user.role_id === 2 || user.role_id === 3 ? (
            <button
                onClick={() => setActiveTab('events')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                Mes Événements
            </button>
            ) : null}
            <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
            Mes Commandes
            </button>
        </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-8">
        {/* Onglet Mes Informations */}
        {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Détails du Profil</h2>
                <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                {/* CORRECTION: Ajout de clés aux éléments conditionnels à l'intérieur du bouton */}
                {isEditingProfile ? (
                    <span key="cancel-edit-btn-content">
                    <CheckIcon className="h-5 w-5 mr-1" /> Annuler
                    </span>
                ) : (
                    <span key="modify-edit-btn-content">
                    <PencilSquareIcon className="h-5 w-5 mr-1" /> Modifier
                    </span>
                )}
                </button>
            </div>

            {/* CORRECTION: Enveloppe le contenu conditionnel dans un div stable */}
            <div> 
                {isEditingProfile ? (
                <form key="profile-edit-form" onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6"> {/* Ajout de la clé */}
                    <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                        type="text"
                        id="name"
                        {...register('name', { required: 'Le nom est requis' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register('email', { required: 'L\'email est requis', pattern: /^\S+@\S+$/i })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                        type="text"
                        id="phone"
                        {...register('phone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                        id="bio"
                        {...register('bio')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    </div>
                    <div>
                    <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-2">URL de l'Avatar</label>
                    <input
                        type="url"
                        id="avatar_url"
                        {...register('avatar_url')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/avatar.jpg"
                    />
                    </div>
                    <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                        {isSubmitting && <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />}
                        Sauvegarder les modifications
                    </button>
                    </div>
                </form>
                ) : (
                <div key="profile-display-view" className="space-y-4 text-gray-700"> {/* Ajout de la clé */}
                    <div className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <p><strong>Nom:</strong> {user.name}</p>
                    </div>
                    <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    {user.phone && (
                    <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 mr-3 text-gray-500" />
                        <p><strong>Téléphone:</strong> {user.phone}</p>
                    </div>
                    )}
                    {user.bio && (
                    <div>
                        <p className="font-medium mb-1">Bio:</p>
                        <p className="text-gray-600 pl-8">{user.bio}</p>
                    </div>
                    )}
                    <div className="flex items-center">
                    <TagIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <p><strong>Rôle:</strong> {user.role?.name || 'Utilisateur'}</p>
                    </div>
                    <div className="flex items-center">
                    <CalendarDaysIcon className="h-5 w-5 mr-3 text-gray-500" />
                    {/* CORRECTION: Vérification de la validité de la date avant de la formater */}
                    <p><strong>Membre depuis:</strong> {user.created_at && !isNaN(new Date(user.created_at).getTime()) ? format(new Date(user.created_at), 'PPP', { locale: fr }) : 'N/A'}</p>
                    </div>
                </div>
                )}
            </div> {/* Fin de la correction */}
            </div>
        )}

        {/* Onglet Mes Événements */}
        {activeTab === 'events' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Événements</h2>
            {userEventsLoading ? (
                <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="ml-4 text-gray-700">Chargement de vos événements...</p>
                </div>
            ) : userEventsError ? (
                <div className="text-center text-red-600 py-8">
                <p>{userEventsError}</p>
                </div>
            ) : userEvents.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                <CubeTransparentIcon className="h-12 w-12 mx-auto mb-4" />
                <p>Vous n'avez pas encore créé d'événements.</p>
                {user.role_id === 2 || user.role_id === 3 ? (
                    <Link to="/create-event" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Créer un événement
                    </Link>
                ) : null}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.map((event) => (
                    <Link to={`/events/${event.id}`} key={event.id} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <img
                        src={event.image_url || `https://placehold.co/400x200/E0E7FF/4F46E5?text=Event`}
                        alt={event.title}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/400x200/E0E7FF/4F46E5?text=Event`;
                        }}
                    />
                    <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                        <CalendarDaysIcon className="inline h-4 w-4 mr-1 text-gray-500" />
                        {/* CORRECTION: Vérification de la validité de la date avant de la formater */}
                        {event.start_datetime && !isNaN(new Date(event.start_datetime).getTime()) ? format(new Date(event.start_datetime), 'PPP', { locale: fr }) : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                        <MapPinIcon className="inline h-4 w-4 mr-1 text-gray-500" />
                        {event.location}, {event.city}
                        </p>
                    </div>
                    </Link>
                ))}
                </div>
            )}
            </div>
        )}

        {/* Onglet Mes Commandes */}
        {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Commandes</h2>
            {userOrdersLoading ? (
                <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="ml-4 text-gray-700">Chargement de vos commandes...</p>
                </div>
            ) : userOrdersError ? (
                <div className="text-center text-red-600 py-8">
                <p>{userOrdersError}</p>
                </div>
            ) : userOrders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                <TicketIcon className="h-12 w-12 mx-auto mb-4" />
                <p>Vous n'avez pas encore passé de commandes.</p>
                <Link to="/events" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Parcourir les événements
                </Link>
                </div>
            ) : (
                <div className="space-y-6">
                {userOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">Commande #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                        }`}>
                        {order.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                        <CalendarDaysIcon className="inline h-4 w-4 mr-1 text-gray-500" />
                        {/* CORRECTION: Vérification de la validité de la date avant de la formater */}
                        Date: {order.order_datetime && !isNaN(new Date(order.order_datetime).getTime()) ? format(new Date(order.order_datetime), 'PPPp', { locale: fr }) : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                        <CreditCardIcon className="inline h-4 w-4 mr-1 text-gray-500" />
                        Montant Total: <span className="font-bold">${order.total_amount.toFixed(2)}</span>
                    </p>

                    {order.tickets && order.tickets.length > 0 && (
                        <div className="mt-4 border-t border-gray-100 pt-3">
                        <h4 className="font-medium text-gray-800 mb-2">Billets commandés:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {order.tickets.map(orderTicket => (
                            <li key={orderTicket.id}>
                                {orderTicket.quantity} x {orderTicket.ticket?.type || 'Billet inconnu'} (Code: {orderTicket.ticket_code})
                            </li>
                            ))}
                        </ul>
                        </div>
                    )}
                    {/* Vous pouvez ajouter un lien vers les détails de la commande si vous avez une page dédiée */}
                    <div className="mt-4 text-right">
                        <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline text-sm">
                        Voir les détails de la commande
                        </Link>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        )}
        </div>
    </div>
    </div>
</div>
);
};

export default Profile;
