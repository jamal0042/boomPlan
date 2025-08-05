// src/hooks/useOrders.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import { User, Event, Order } from '../types'; // Assurez-vous que Order est bien importé

// CORRECTION IMPORTANTE: L'URL de base de votre API PHP doit être cohérente.
// Elle devrait pointer vers le dossier 'api' de votre backend.
const API_BASE_URL = 'http://localhost/backend_bp/api'; 

interface UseOrdersHook {
fetchUserOrders: () => Promise<Order[]>;
loading: boolean;
error: string | null;
}

export const useOrders = (): UseOrdersHook => {
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchUserOrders = useCallback(async (): Promise<Order[]> => {
setLoading(true);
setError(null);
try {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
    throw new Error('Jeton d\'authentification manquant. Veuillez vous connecter.');
    }

    // L'API PHP /api/orders devrait automatiquement filtrer par l'utilisateur authentifié
    // ou vous pouvez passer l'ID de l'utilisateur si nécessaire (ex: /orders?user_id=...)
    const response = await axios.get<{ orders: Order[] }>(`${API_BASE_URL}/orders`, {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    });
    return response.data.orders;
} catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Échec de la récupération des commandes.';
    setError(errorMessage);
    console.error('Erreur lors de la récupération des commandes:', err.response?.data || err);
    throw new Error(errorMessage);
} finally {
    setLoading(false);
}
}, []);

return {
fetchUserOrders,
loading,
error,
};
};
