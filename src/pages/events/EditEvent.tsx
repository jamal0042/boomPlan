// src/pages/events/EditEvent.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
CalendarIcon, MapPinIcon, UserIcon, PhotoIcon, TicketIcon,
ArrowPathIcon, TrashIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../context/AuthContext';
import { Event, EventCategory, Ticket } from '../../types';
import toast from 'react-hot-toast';
import axios from 'axios'; // For fetching categories

// Define form data structure
interface EditEventFormData {
title: string;
description: string;
location: string;
address: string;
city: string;
country: string;
start_datetime: string;
end_datetime: string;
category_id: number;
image_url?: string; // For existing image URL or new base64/url
is_public: boolean;
// Dynamic tickets will be handled separately from react-hook-form's register
}

const API_BASE_URL = 'http://jamaltech.alwaysdata.net/api';

const EditEvent: React.FC = () => {
const { id } = useParams<{ id: string }>();
const eventId = id ? parseInt(id) : undefined;
const navigate = useNavigate();
const { user, isAuthenticated } = useAuth();
const { getEventById, updateEvent } = useEvents(); // Assuming updateEvent exists in useEvents

const [event, setEvent] = useState<Event | null>(null);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [imageFile, setImageFile] = useState<File | null>(null);
const [ticketTypes, setTicketTypes] = useState<Ticket[]>([]);
const [categories, setCategories] = useState<EventCategory[]>([]);
const [isSubmitting, setIsSubmitting] = useState(false);

const {
register,
handleSubmit,
setValue,
formState: { errors },
reset // To reset form after fetching data
} = useForm<EditEventFormData>();

// Fetch event details and categories on component mount
useEffect(() => {
const fetchData = async () => {
    if (!isAuthenticated || !user) {
    toast.error("Vous devez être connecté pour modifier un événement.");
    navigate('/login');
    return;
    }
    if (eventId === undefined || isNaN(eventId)) {
    setError("ID d'événement invalide.");
    setLoading(false);
    return;
    }

    setLoading(true);
    setError(null);

    try {
    const fetchedEvent = await getEventById(eventId);
    if (fetchedEvent) {
        // Check if the authenticated user is the organizer or an admin
        if (fetchedEvent.organizer_id !== user.id && user.role_id !== 3) { // Assuming role_id 3 is admin
        toast.error("Vous n'êtes pas autorisé à modifier cet événement.");
        navigate('/events');
        return;
        }

        setEvent(fetchedEvent);
        // Populate form fields
        reset({
        title: fetchedEvent.title,
        description: fetchedEvent.description || '',
        location: fetchedEvent.location || '',
        address: fetchedEvent.address || '',
        city: fetchedEvent.city || '',
        country: fetchedEvent.country || '',
        start_datetime: fetchedEvent.start_datetime ? format(parseISO(fetchedEvent.start_datetime), "yyyy-MM-dd'T'HH:mm") : '',
        end_datetime: fetchedEvent.end_datetime ? format(parseISO(fetchedEvent.end_datetime), "yyyy-MM-dd'T'HH:mm") : '',
        category_id: fetchedEvent.category_id || 0,
        image_url: fetchedEvent.image_url || '',
        is_public: fetchedEvent.is_public,
        });
        setImagePreview(fetchedEvent.image_url || null);
        setTicketTypes(fetchedEvent.tickets || []);
    } else {
        setError("Événement non trouvé.");
    }

    // Fetch categories
    const categoriesResponse = await axios.get<{ message: string; data: EventCategory[] }>(`${API_BASE_URL}/event_categories`);
    setCategories(categoriesResponse.data.data || categoriesResponse.data); // Adjust based on actual API response structure

    } catch (err: any) {
    console.error("Erreur lors du chargement de l'événement ou des catégories:", err.response?.data || err);
    setError(err.response?.data?.message || err.message || "Échec du chargement des données.");
    toast.error(err.response?.data?.message || err.message || "Échec du chargement des données.");
    } finally {
    setLoading(false);
    }
};

fetchData();
}, [eventId, getEventById, isAuthenticated, user, navigate, reset]);

// Handle image file selection
const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
    setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
} else {
    setImageFile(null);
    setImagePreview(event?.image_url || null); // Revert to original if no new file selected
}
};

// Handle ticket type changes
const handleTicketChange = (index: number, field: keyof Ticket, value: any) => {
const newTicketTypes = [...ticketTypes];
// Ensure numeric fields are parsed
if (field === 'price' || field === 'quantity_total' || field === 'quantity_sold') {
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: parseFloat(value) || 0 };
} else if (field === 'is_active') {
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value };
} else {
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value };
}
setTicketTypes(newTicketTypes);
};

const handleAddTicket = () => {
setTicketTypes([...ticketTypes, {
    id: Date.now(), // Temporary ID for new tickets
    event_id: eventId || 0, // Will be updated on backend
    type: '',
    description: '',
    price: 0,
    quantity_total: 0,
    quantity_sold: 0, // New tickets start with 0 sold
    is_active: true,
}]);
};

const handleRemoveTicket = (index: number) => {
setTicketTypes(ticketTypes.filter((_, i) => i !== index));
};

const onSubmit = async (formData: EditEventFormData) => {
setIsSubmitting(true);
setError(null);

try {
    const dataToSend = new FormData();
    // Append all form data
    Object.keys(formData).forEach(key => {
    const value = (formData as any)[key];
    if (value !== null && value !== undefined) {
        if (key === 'start_datetime' || key === 'end_datetime') {
        // Ensure dates are sent in a format backend expects (e.g., ISO 8601)
        dataToSend.append(key, value); 
        } else if (typeof value === 'boolean') {
        dataToSend.append(key, value ? '1' : '0'); // PHP expects '1' or '0' for booleans from FormData
        } else {
        dataToSend.append(key, value);
        }
    }
    });

    // Append image file if new one is selected
    if (imageFile) {
    dataToSend.append('image', imageFile); // 'image' is the key PHP will look for in $_FILES
    } else if (event?.image_url && !imagePreview) {
    // If image was removed (preview cleared but no new file)
    dataToSend.append('image_url', ''); // Send empty string to clear existing image
    } else if (event?.image_url) {
    // If no new image, but existing one should be kept
    dataToSend.append('image_url', event.image_url);
    }

    // Append ticket types as a JSON string
    dataToSend.append('tickets', JSON.stringify(ticketTypes));

    // Call updateEvent from useEvents hook
    // Assuming updateEvent takes eventId and FormData
    await updateEvent(eventId!, dataToSend); // ! asserts eventId is not undefined

    toast.success("Événement mis à jour avec succès !");
    navigate(`/events/${eventId}`); // Redirect to event detail page
} catch (err: any) {
    console.error("Erreur lors de la mise à jour de l'événement:", err.response?.data || err);
    setError(err.response?.data?.message || err.message || "Échec de la mise à jour de l'événement.");
    toast.error(err.response?.data?.message || err.message || "Échec de la mise à jour de l'événement.");
} finally {
    setIsSubmitting(false);
}
};

if (loading) {
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    <p className="ml-4 text-gray-700">Chargement de l'événement...</p>
    </div>
);
}

if (error) {
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Retour
        </button>
    </div>
    </div>
);
}

if (!event) {
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Événement non trouvé</h2>
        <p className="text-gray-700 mb-6">L'événement que vous tentez de modifier n'existe pas.</p>
        <button onClick={() => navigate('/events')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Retour aux événements
        </button>
    </div>
    </div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Modifier l'Événement: {event.title}
    </h1>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section Informations Générales */}
        <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informations Générales</h2>
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre de l'événement</label>
            <input
            type="text"
            id="title"
            {...register('title', { required: "Le titre est requis" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
            id="description"
            {...register('description', { required: "La description est requise" })}
            rows={5}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div className="mt-4">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
            id="category_id"
            {...register('category_id', { required: "La catégorie est requise", valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
            </select>
            {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>}
        </div>
        <div className="mt-4 flex items-center">
            <input
            type="checkbox"
            id="is_public"
            {...register('is_public')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_public" className="ml-2 block text-sm font-medium text-gray-700">Événement public</label>
        </div>
        </div>

        {/* Section Dates et Heures */}
        <div className="border-b border-gray-200 pb-6 pt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dates et Heures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700">Date et heure de début</label>
            <input
                type="datetime-local"
                id="start_datetime"
                {...register('start_datetime', { required: "La date de début est requise" })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.start_datetime && <p className="mt-1 text-sm text-red-600">{errors.start_datetime.message}</p>}
            </div>
            <div>
            <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700">Date et heure de fin</label>
            <input
                type="datetime-local"
                id="end_datetime"
                {...register('end_datetime', { required: "La date de fin est requise" })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.end_datetime && <p className="mt-1 text-sm text-red-600">{errors.end_datetime.message}</p>}
            </div>
        </div>
        </div>

        {/* Section Lieu */}
        <div className="border-b border-gray-200 pb-6 pt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lieu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Nom du lieu</label>
            <input
                type="text"
                id="location"
                {...register('location')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
            <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
                type="text"
                id="address"
                {...register('address')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
            <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
            <input
                type="text"
                id="city"
                {...register('city')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
            <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
            <input
                type="text"
                id="country"
                {...register('country')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
        </div>
        </div>

        {/* Section Image de l'événement */}
        <div className="border-b border-gray-200 pb-6 pt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Image de l'événement</h2>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
            {imagePreview ? (
                <img src={imagePreview} alt="Aperçu de l'image" className="mx-auto h-48 w-full object-cover rounded-md" />
            ) : (
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="flex text-sm text-gray-600">
                <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                <span>Télécharger une image</span>
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
            </div>
        </div>
        </div>

        {/* Section Types de Billets */}
        <div className="border-b border-gray-200 pb-6 pt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Types de Billets</h2>
        {ticketTypes.map((ticket, index) => (
            <div key={ticket.id || `new-${index}`} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Billet #{index + 1}</h3>
            <button
                type="button"
                onClick={() => handleRemoveTicket(index)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                title="Supprimer ce type de billet"
            >
                <TrashIcon className="h-5 w-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label htmlFor={`ticket-type-${index}`} className="block text-sm font-medium text-gray-700">Type de billet</label>
                <input
                    type="text"
                    id={`ticket-type-${index}`}
                    value={ticket.type}
                    onChange={(e) => handleTicketChange(index, 'type', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                </div>
                <div>
                <label htmlFor={`ticket-price-${index}`} className="block text-sm font-medium text-gray-700">Prix ($)</label>
                <input
                    type="number"
                    id={`ticket-price-${index}`}
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    step="0.01"
                    min="0"
                    required
                />
                </div>
                <div className="md:col-span-2">
                <label htmlFor={`ticket-description-${index}`} className="block text-sm font-medium text-gray-700">Description du billet</label>
                <textarea
                    id={`ticket-description-${index}`}
                    value={ticket.description || ''}
                    onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                </div>
                <div>
                <label htmlFor={`ticket-quantity-${index}`} className="block text-sm font-medium text-gray-700">Quantité totale</label>
                <input
                    type="number"
                    id={`ticket-quantity-${index}`}
                    value={ticket.quantity_total}
                    onChange={(e) => handleTicketChange(index, 'quantity_total', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                />
                </div>
                <div>
                <label htmlFor={`ticket-sold-${index}`} className="block text-sm font-medium text-gray-700">Quantité vendue</label>
                <input
                    type="number"
                    id={`ticket-sold-${index}`}
                    value={ticket.quantity_sold}
                    onChange={(e) => handleTicketChange(index, 'quantity_sold', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max={ticket.quantity_total} // Cannot sell more than total
                    required
                />
                </div>
                <div className="md:col-span-2 flex items-center mt-2">
                <input
                    type="checkbox"
                    id={`ticket-active-${index}`}
                    checked={ticket.is_active}
                    onChange={(e) => handleTicketChange(index, 'is_active', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`ticket-active-${index}`} className="ml-2 block text-sm font-medium text-gray-700">Actif</label>
                </div>
            </div>
            </div>
        ))}
        <button
            type="button"
            onClick={handleAddTicket}
            className="mt-4 flex items-center justify-center w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Ajouter un type de billet
        </button>
        </div>

        {/* Bouton de soumission */}
        <div className="pt-6">
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isSubmitting ? (
            <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Mise à jour...
            </div>
            ) : (
            'Mettre à jour l\'événement'
            )}
        </button>
        </div>
    </form>
    </div>
</div>
);
};

export default EditEvent;
