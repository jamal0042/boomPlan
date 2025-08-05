// src/pages/Static/HelpPage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Pour les liens internes vers d'autres pages d'aide

const HelpPage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Centre d'Aide
    </h1>
    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
        Bienvenue dans notre Centre d'Aide ! Trouvez des guides, des tutoriels
        et des réponses aux questions fréquentes pour vous aider à tirer le meilleur parti de BoomPlan.
    </p>

    <div className="text-left space-y-8 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Sections d'Aide Populaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div>
            <h3 className="font-semibold text-xl mb-2">Pour les Participants</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
            <li><Link to="/faq" className="text-blue-600 hover:underline">Comment acheter des billets ?</Link></li>
            <li>Comment trouver des événements ?</li>
            <li>Gérer mes réservations</li>
            <li>Politique de remboursement</li>
            </ul>
        </div>
        <div>
            <h3 className="font-semibold text-xl mb-2">Pour les Organisateurs</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
            <li><Link to="/create-event" className="text-blue-600 hover:underline">Comment créer un événement ?</Link></li>
            <li>Gérer les billets et les ventes</li>
            <li>Promouvoir votre événement</li>
            <li>Analyser les performances de l'événement</li>
            </ul>
        </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Besoin d'une aide personnalisée ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Si vous n'avez pas trouvé la réponse à votre question, notre équipe de support est là pour vous aider.
        N'hésitez pas à <Link to="/contact" className="text-blue-600 hover:underline">nous contacter</Link> directement.
        </p>
    </div>
    </div>
</div>
);
};

export default HelpPage;
