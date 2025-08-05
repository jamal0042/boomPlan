// src/pages/Static/PricingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Pour les liens internes vers d'autres pages

const PricingPage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Nos Tarifs
    </h1>
    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
        Découvrez nos plans tarifaires flexibles conçus pour s'adapter à tous les besoins,
        des organisateurs individuels aux grandes entreprises. Nous offrons des solutions
        transparentes pour vous aider à maximiser le succès de vos événements.
    </p>

    <div className="text-left space-y-8 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Plans pour les Organisateurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan Basique */}
        <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center shadow-sm">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Basique</h3>
            <p className="text-4xl font-extrabold text-gray-900 mb-4">
            Gratuit
            </p>
            <p className="text-gray-600 text-sm mb-4">Idéal pour les petits événements occasionnels.</p>
            <ul className="text-gray-700 text-sm text-left w-full space-y-2">
            <li>✔️ Création d'événements illimitée</li>
            <li>✔️ Vente de billets de base</li>
            <li>✔️ Support par e-mail</li>
            <li>❌ Rapports avancés</li>
            </ul>
            <button className="mt-auto w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Commencer Gratuitement
            </button>
        </div>

        {/* Plan Pro */}
        <div className="border-2 border-blue-600 rounded-lg p-6 flex flex-col items-center shadow-lg transform scale-105 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Populaire</span>
            <h3 className="text-xl font-bold text-blue-800 mb-2">Pro</h3>
            <p className="text-4xl font-extrabold text-gray-900 mb-4">
            $19<span className="text-xl font-medium text-gray-500">/mois</span>
            </p>
            <p className="text-gray-600 text-sm mb-4">Pour les organisateurs réguliers et les entreprises en croissance.</p>
            <ul className="text-gray-700 text-sm text-left w-full space-y-2">
            <li>✔️ Tout du plan Basique</li>
            <li>✔️ Rapports de vente détaillés</li>
            <li>✔️ Intégrations marketing</li>
            <li>✔️ Support prioritaire</li>
            </ul>
            <button className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Choisir le Plan Pro
            </button>
        </div>

        {/* Plan Entreprise */}
        <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center shadow-sm">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Entreprise</h3>
            <p className="text-4xl font-extrabold text-gray-900 mb-4">
            Personnalisé
            </p>
            <p className="text-gray-600 text-sm mb-4">Solutions sur mesure pour les grandes organisations.</p>
            <ul className="text-gray-700 text-sm text-left w-full space-y-2">
            <li>✔️ Toutes les fonctionnalités Pro</li>
            <li>✔️ Gestion de compte dédiée</li>
            <li>✔️ API personnalisée</li>
            <li>✔️ Solutions d'entreprise</li>
            </ul>
            <Link to="/contact" className="mt-auto w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors inline-block text-center">
            Nous Contacter
            </Link>
        </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Frais de Service
        </h2>
        <p className="text-gray-700 leading-relaxed">
        BoomPlan prélève une petite commission sur les ventes de billets pour couvrir les frais de transaction et de maintenance de la plateforme.
        Ces frais sont généralement un pourcentage du prix du billet et sont clairement indiqués lors de la configuration de votre événement.
        Aucun frais caché.
        </p>
    </div>
    </div>
</div>
);
};

export default PricingPage;
