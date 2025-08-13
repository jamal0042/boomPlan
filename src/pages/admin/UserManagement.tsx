// src/pages/admin/UserManagement.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Définition d'un type pour nos données utilisateur simulées
interface User {
id: string;
name: string;
email: string;
role: 'user' | 'organizer' | 'admin';
role_id: 1 | 2 | 3; // CORRECTION: Ajout de role_id pour correspondre à votre Navbar
status: 'Active' | 'Inactive' | 'Pending';
}

// Données fictives pour simuler un appel d'API
const mockUsers: User[] = [
{ id: '1', name: 'Alice Dupont', email: 'alice.d@example.com', role: 'user', role_id: 1, status: 'Active' },
{ id: '2', name: 'Bob Martin', email: 'bob.m@example.com', role: 'organizer', role_id: 2, status: 'Active' },
{ id: '3', name: 'Charlie Lefevre', email: 'charlie.l@example.com', role: 'admin', role_id: 3, status: 'Active' },
{ id: '4', name: 'Diana Dubois', email: 'diana.d@example.com', role: 'user', role_id: 1, status: 'Inactive' },
{ id: '5', name: 'Eve Bernard', email: 'eve.b@example.com', role: 'user', role_id: 1, status: 'Pending' },
];

const UserManagement: React.FC = () => {
const { user, isAuthenticated } = useAuth();
// CORRECTION: Utiliser user?.role_id === 3 pour vérifier le rôle d'administrateur
const isAdmin = isAuthenticated && user?.role_id === 3; 

const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
const fetchUsers = async () => {
    setLoading(true);
    try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUsers(mockUsers);
    } catch (error) {
    toast.error('Erreur lors du chargement des utilisateurs.');
    console.error('Failed to fetch users:', error);
    } finally {
    setLoading(false);
    }
};

if (isAdmin) {
    fetchUsers();
}
}, [isAdmin]);

const handleEdit = (userId: string) => {
toast.info(`Modifier l'utilisateur avec l'ID: ${userId}`);
// Logique d'édition
};

const handleDelete = (userId: string) => {
toast.error(`Supprimer l'utilisateur avec l'ID: ${userId}`);
// Logique de suppression
};

if (!isAdmin) {
return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-red-600">
    <h1 className="text-3xl font-bold mb-4">Accès refusé</h1>
    <p className="text-lg text-center">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
    </p>
    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Retour à l'accueil
    </Link>
    </div>
);
}

return (
<div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">
        Gestion des utilisateurs
    </h1>
    <p className="text-lg text-gray-600 mb-8">
        Gérez l'ensemble des comptes, des rôles et des permissions de la plateforme.
    </p>

    {loading ? (
        <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                <tr key={userItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {userItem.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userItem.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${userItem.role_id === 3 ? 'bg-red-100 text-red-800' :
                            userItem.role_id === 2 ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {userItem.role}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${userItem.status === 'Active' ? 'bg-green-100 text-green-800' :
                            userItem.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }`}
                    >
                        {userItem.status}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        onClick={() => handleEdit(userItem.id)}
                        className="text-indigo-600 hover:text-indigo-900 mx-2"
                        title="Modifier l'utilisateur"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(userItem.id)}
                        className="text-red-600 hover:text-red-900 mx-2"
                        title="Supprimer l'utilisateur"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    )}
    </div>
</div>
);
};

export default UserManagement;
