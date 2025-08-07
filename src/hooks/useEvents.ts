// src/hooks/useEvents.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Event, SearchFilters } from '../types'; // Importez SearchFilters

// Définissez l'URL de base de votre API PHP
const API_BASE_URL = 'https://jamaltech.alwaysdata.net/api'; // Assurez-vous que c'est correct

interface UseEventsHook {
  events: Event[];
  loading: boolean;
  error: string | null;
  getEventById: (id: number) => Promise<Event | undefined>;
  createEvent: (eventData: Partial<Event>) => Promise<Event>;
  getEventsByOrganizerId: (organizerId: number) => Promise<Event[]>; // Nouvelle méthode
}

// Le hook accepte maintenant des filtres pour la recherche
export const useEvents = (filters?: SearchFilters): UseEventsHook => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer tous les événements depuis l'API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Construire les paramètres de requête à partir des filtres
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.query) queryParams.append('query', filters.query);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.is_free !== undefined) queryParams.append('is_free', String(filters.is_free));
        if (filters.date_from) queryParams.append('date_from', filters.date_from);
        if (filters.date_to) queryParams.append('date_to', filters.date_to);
        // Assurez-vous que votre backend PHP gère category_id comme un nombre ou une chaîne
        if (filters.category) queryParams.append('category', filters.category);
      }

      const response = await axios.get<{ events: Event[] }>(
        `${API_BASE_URL}/events?${queryParams.toString()}`
      );
      setEvents(response.data.events);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des événements:', err.response?.data || err);
      setError(err.response?.data?.message || err.message || 'Échec de la récupération des événements.');
    } finally {
      setLoading(false);
    }
  }, [filters]); // Déclenche la récupération si les filtres changent

  // Exécute fetchEvents au montage du composant et lorsque les filtres changent
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // Dépendance à fetchEvents (qui est useCallback)

  // Fonction pour récupérer un événement par ID depuis l'API
  const getEventById = useCallback(async (id: number): Promise<Event | undefined> => {
    try {
      const response = await axios.get<{ event: Event }>(`${API_BASE_URL}/events/${id}`);
      return response.data.event;
    } catch (err: any) {
      console.error(`Erreur lors de la récupération de l'événement ${id}:`, err.response?.data || err);
      throw err; // Propage l'erreur
    }
  }, []);

  // Fonction pour créer un événement via l'API
  const createEvent = useCallback(async (eventData: Partial<Event>): Promise<Event> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error('Jeton d\'authentification manquant. Veuillez vous connecter.');
      }

      const response = await axios.post<{ message: string; event: Event }>(`${API_BASE_URL}/events`, eventData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      // Optionnel: Re-fetch les événements pour inclure le nouveau
      // fetchEvents();
      setLoading(false);
      return response.data.event;
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Échec de la création de l\'événement';
      setError(errorMessage);
      console.error('Erreur lors de la création de l\'événement:', err.response?.data || err);
      throw new Error(errorMessage);
    }
  }, []);

  // Nouvelle fonction pour récupérer les événements par ID d'organisateur
  const getEventsByOrganizerId = useCallback(async (organizerId: number): Promise<Event[]> => {
    try {
      const token = localStorage.getItem('jwt_token'); // Le token est probablement requis pour les événements d'un utilisateur spécifique
      const response = await axios.get<{ events: Event[] }>(
        `${API_BASE_URL}/events?organizer_id=${organizerId}`, // Assurez-vous que votre backend gère ce paramètre de requête
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      return response.data.events;
    } catch (err: any) {
      console.error(`Erreur lors de la récupération des événements de l'organisateur ${organizerId}:`, err.response?.data || err);
      throw new Error(err.response?.data?.message || 'Échec de la récupération des événements de l\'organisateur.');
    }
  }, []);

  return {
    events,
    loading,
    error,
    getEventById,
    createEvent,
    getEventsByOrganizerId, // Inclure la nouvelle fonction
  };
};
