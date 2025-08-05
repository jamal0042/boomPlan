import React, { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'; // Ajout de PhotoIcon pour l'upload
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../hooks/useEvents';
import { Event, Ticket } from '../../types';
import toast from 'react-hot-toast';

interface EventFormData {
  title: string;
  description: string;
  category_id: number;
  location: string;
  address: string;
  city: string;
  country: string;
  start_datetime: string;
  end_datetime: string;
  image_url: string; // L'URL de l'image après l'upload
  is_public: boolean;
}

interface TicketFormData {
  type: string;
  description: string;
  price: number;
  quantity_total: number;
  sale_start?: string;
  sale_end?: string;
}

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const { createEvent } = useEvents();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [tickets, setTickets] = useState<TicketFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ajout de l'état pour gérer le fichier image et sa prévisualisation
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register: registerEvent,
    handleSubmit: handleEventSubmit,
    formState: { errors: eventErrors },
    watch,
  } = useForm<EventFormData>();

  const {
    register: registerTicket,
    handleSubmit: handleTicketSubmit,
    reset: resetTicket,
    formState: { errors: ticketErrors },
  } = useForm<TicketFormData>();

  // Fonction pour gérer le changement de fichier image
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
      setImagePreview(null);
    }
  };

  // Redirection si l'utilisateur n'est pas un organisateur ou un administrateur
  if (!user || (user.role_id !== 2 && user.role_id !== 3)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h2>
          <p className="text-gray-600 mb-6">Vous devez être un organisateur pour créer des événements.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const addTicket = (data: TicketFormData) => {
    setTickets([...tickets, data]);
    resetTicket();
    toast.success('Type de billet ajouté !');
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
    toast.success('Type de billet supprimé !');
  };

  const onEventSubmit = async (data: EventFormData) => {
    try {
      setIsLoading(true);

      let imageUrl = data.image_url;
      // En production, vous téléverseriez l'image sur un service de stockage cloud (ex: Firebase Storage, Cloudinary, S3)
      // et récupéreriez l'URL publique de l'image.
      if (imageFile) {
        // Exemple d'upload (logique à implémenter)
        // const uploadedImageUrl = await uploadImage(imageFile);
        // imageUrl = uploadedImageUrl;
        // Pour l'exemple, nous allons utiliser une URL de placeholder
        imageUrl = 'https://placehold.co/800x400/E5E7EB/4B5563?text=Image+de+l\'événement';
      }

      // Conversion de category_id en nombre
      const categoryId = Number(data.category_id);

      // Création de l'objet d'événement avec les billets
      const eventData: Partial<Event> = {
        ...data,
        category_id: categoryId,
        image_url: imageUrl,
        tickets: tickets as Ticket[],
      };

      const newEvent = await createEvent(eventData);
      toast.success('Événement créé avec succès !');
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Échec de la création de l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Détails de l\'événement', description: 'Informations de base sur votre événement' },
    { id: 2, name: 'Billets', description: 'Configurer les types de billets et les prix' },
    { id: 3, name: 'Révision', description: 'Revoir et publier votre événement' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un Nouvel Événement</h1>
          <p className="text-gray-600 mt-2">Rassemblons les gens avec votre événement incroyable</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Step 1: Event Details */}
          {currentStep === 1 && (
            <form onSubmit={handleEventSubmit(() => setCurrentStep(2))} className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails de l'événement</h2>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'événement
                </label>
                <input
                  id="title"
                  {...registerEvent('title', { required: 'Le titre de l\'événement est requis' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le titre de votre événement"
                />
                {eventErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{eventErrors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  {...registerEvent('description', { required: 'La description est requise' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre événement..."
                />
                {eventErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{eventErrors.description.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Image de l'événement
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Aperçu de l'image" className="mx-auto h-32 w-auto object-cover rounded-md" />
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                      >
                        <span>Télécharger une image</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                </div>
              </div>


              {/* Category */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  id="category_id"
                  {...registerEvent('category_id')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value={1}>Technologie</option>
                  <option value={2}>Musique</option>
                  <option value={3}>Affaires</option>
                  <option value={4}>Art & Culture</option>
                  <option value={5}>Sports</option>
                  <option value={6}>Alimentation & Boissons</option>
                  <option value={7}>Éducation</option>
                  <option value={8}>Santé & Bien-être</option>
                </select>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du lieu
                  </label>
                  <input
                    id="location"
                    {...registerEvent('location', { required: 'Le lieu est requis' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom du lieu"
                  />
                  {eventErrors.location && (
                    <p className="mt-1 text-sm text-red-600">{eventErrors.location.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    id="address"
                    {...registerEvent('address', { required: 'L\'adresse est requise' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adresse de la rue"
                  />
                  {eventErrors.address && (
                    <p className="mt-1 text-sm text-red-600">{eventErrors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    id="city"
                    {...registerEvent('city', { required: 'La ville est requise' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ville"
                  />
                  {eventErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{eventErrors.city.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <input
                    id="country"
                    {...registerEvent('country', { required: 'Le pays est requis' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pays"
                  />
                  {eventErrors.country && (
                    <p className="mt-1 text-sm text-red-600">{eventErrors.country.message}</p>
                  )}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure de début
                  </label>
                  <input
                    id="start_datetime"
                    {...registerEvent('start_datetime', { required: 'La date de début est requise' })}
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {eventErrors.start_datetime && (
                    <p className="mt-1 text-sm text-red-600">{eventErrors.start_datetime.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700 mb-2">
                    Date et heure de fin
                  </label>
                  <input
                    id="end_datetime"
                    {...registerEvent('end_datetime', { required: 'La date de fin est requise' })}
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {eventErrors.end_datetime && (
                    <p className="mt-1 text-sm text-red-600">{eventErrors.end_datetime.message}</p>
                  )}
                </div>
              </div>

              {/* Visibilite */}
              <div>
                <label htmlFor="is_public" className="flex items-center">
                  <input
                    id="is_public"
                    {...registerEvent('is_public')}
                    type="checkbox"
                    defaultChecked={true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Rendre cet événement public (visible par tous)
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Suivant : Configurer les billets
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Tickets */}
          {currentStep === 2 && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Types de Billets</h2>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Passer cette étape
                </button>
              </div>

              {/* Add Ticket Form */}
              <form onSubmit={handleTicketSubmit(addTicket)} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un Type de Billet</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="ticket_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du billet
                    </label>
                    <input
                      id="ticket_type"
                      {...registerTicket('type', { required: 'Le nom du billet est requis' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Entrée générale, VIP, Early Bird"
                    />
                    {ticketErrors.type && (
                      <p className="mt-1 text-sm text-red-600">{ticketErrors.type.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="ticket_price" className="block text-sm font-medium text-gray-700 mb-2">
                      Prix ($)
                    </label>
                    <input
                      id="ticket_price"
                      {...registerTicket('price', { required: 'Le prix est requis', min: 0 })}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    {ticketErrors.price && (
                      <p className="mt-1 text-sm text-red-600">{ticketErrors.price.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="ticket_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    id="ticket_description"
                    {...registerTicket('description')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brève description de ce qui est inclus"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="ticket_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité disponible
                    </label>
                    <input
                      id="ticket_quantity"
                      {...registerTicket('quantity_total', { required: 'La quantité est requise', min: 1 })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                    />
                    {ticketErrors.quantity_total && (
                      <p className="mt-1 text-sm text-red-600">{ticketErrors.quantity_total.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="sale_start" className="block text-sm font-medium text-gray-700 mb-2">
                      Début des ventes
                    </label>
                    <input
                      id="sale_start"
                      {...registerTicket('sale_start')}
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="sale_end" className="block text-sm font-medium text-gray-700 mb-2">
                      Fin des ventes
                    </label>
                    <input
                      id="sale_end"
                      {...registerTicket('sale_end')}
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ajouter un type de billet
                </button>
              </form>

              {/* Ticket List */}
              {tickets.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Types de billets ajoutés</h3>
                  <div className="space-y-3">
                    {tickets.map((ticket, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{ticket.type}</h4>
                          <p className="text-sm text-gray-600">
                            ${ticket.price.toFixed(2)} • {ticket.quantity_total} disponibles
                            {ticket.description && ` • ${ticket.description}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeTicket(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Suivant : Révision
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Réviser Votre Événement</h2>

              <div className="space-y-6">
                {/* Event Summary */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Détails de l'événement</h3>
                  {imagePreview && (
                    <div className="mb-4">
                      <img src={imagePreview} alt="Aperçu de l'événement" className="w-full h-48 object-cover rounded-md" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Titre:</span>
                      <span className="ml-2 font-medium">{watch('title')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lieu:</span>
                      <span className="ml-2 font-medium">{watch('location')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Début:</span>
                      <span className="ml-2 font-medium">
                        {watch('start_datetime') && new Date(watch('start_datetime')).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fin:</span>
                      <span className="ml-2 font-medium">
                        {watch('end_datetime') && new Date(watch('end_datetime')).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tickets Summary */}
                {tickets.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Types de Billets ({tickets.length})</h3>
                    <div className="space-y-2">
                      {tickets.map((ticket, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{ticket.type}</span>
                          <span>${ticket.price.toFixed(2)} × {ticket.quantity_total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleEventSubmit(onEventSubmit)}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Création de l'événement...
                      </div>
                    ) : (
                      'Créer l\'événement'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
