// src/pages/Static/AboutPage.tsx
import React from 'react';

const AboutPage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        À Propos de Nous
    </h1>
    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Bienvenue sur BoomPlan, votre plateforme dédiée à la découverte et à l'organisation d'événements inoubliables.
        Nous croyons que chaque moment spécial mérite d'être célébré et partagé. Notre mission est de simplifier la recherche
        et la gestion d'événements, qu'il s'agisse de conférences professionnelles, de mariages féeriques, de compétitions sportives,
        de fêtes mémorables ou de concerts vibrants.
    </p>
    <p className="text-lg text-gray-700 leading-relaxed">
        Nous mettons en relation les passionnés d'événements avec des organisateurs talentueux, offrant des outils intuitifs
        pour planifier, promouvoir et gérer chaque détail. Rejoignez notre communauté et commencez à créer des souvenirs dès aujourd'hui !
    </p>
    </div>
</div>
);
};

export default AboutPage;
