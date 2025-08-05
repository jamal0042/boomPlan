// src/pages/Static/SystemStatusPage.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const SystemStatusPage: React.FC = () => {
const [status, setStatus] = useState({
api: 'operational',
website: 'operational',
payments: 'operational',
lastUpdated: new Date(),
});

// Simule la mise à jour du statut (dans une vraie app, ce serait un appel API)
useEffect(() => {
const interval = setInterval(() => {
    // Pour la démo, on simule un statut aléatoire pour l'API de temps en temps
    const newApiStatus = Math.random() > 0.9 ? 'degraded' : 'operational';
    setStatus(prevStatus => ({
    ...prevStatus,
    api: newApiStatus,
    lastUpdated: new Date(),
    }));
}, 15000); // Met à jour toutes les 15 secondes

return () => clearInterval(interval);
}, []);

const getStatusIcon = (serviceStatus: string) => {
switch (serviceStatus) {
    case 'operational':
    return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    case 'degraded':
    return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
    case 'maintenance':
    return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    default:
    return <InformationCircleIcon className="h-6 w-6 text-gray-500" />;
}
};

const getStatusText = (serviceStatus: string) => {
switch (serviceStatus) {
    case 'operational':
    return 'Opérationnel';
    case 'degraded':
    return 'Performance Dégradée';
    case 'maintenance':
    return 'En Maintenance';
    default:
    return 'Inconnu';
}
};

return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Statut du Système
    </h1>
    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
        Vérifiez l'état de nos services en temps réel. Nous nous efforçons de maintenir
        nos systèmes opérationnels 24h/24, 7j/7.
    </p>

    <div className="text-left space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        État Actuel des Services
        </h2>
        <div className="space-y-4">
        {/* API Service Status */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
            {getStatusIcon(status.api)}
            <span className="ml-3 text-lg font-medium text-gray-900">API du Service</span>
            </div>
            <span className={`font-semibold ${
            status.api === 'operational' ? 'text-green-600' :
            status.api === 'degraded' ? 'text-yellow-600' :
            'text-blue-600'
            }`}>
            {getStatusText(status.api)}
            </span>
        </div>

        {/* Website Status */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
            {getStatusIcon(status.website)}
            <span className="ml-3 text-lg font-medium text-gray-900">Site Web</span>
            </div>
            <span className={`font-semibold ${
            status.website === 'operational' ? 'text-green-600' :
            status.website === 'degraded' ? 'text-yellow-600' :
            'text-blue-600'
            }`}>
            {getStatusText(status.website)}
            </span>
        </div>

        {/* Payments Status */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
            {getStatusIcon(status.payments)}
            <span className="ml-3 text-lg font-medium text-gray-900">Système de Paiements</span>
            </div>
            <span className={`font-semibold ${
            status.payments === 'operational' ? 'text-green-600' :
            status.payments === 'degraded' ? 'text-yellow-600' :
            'text-blue-600'
            }`}>
            {getStatusText(status.payments)}
            </span>
        </div>
        </div>

        <p className="text-sm text-gray-600 mt-6 text-center">
        Dernière mise à jour : {status.lastUpdated.toLocaleString('fr-FR')}
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
        Incidents Récents
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Aucun incident majeur n'a été signalé récemment. En cas de problème,
        nous mettrons à jour cette page et nos réseaux sociaux.
        </p>
    </div>
    </div>
</div>
);
};

export default SystemStatusPage;
