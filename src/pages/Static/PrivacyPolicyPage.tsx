// src/pages/Static/PrivacyPolicyPage.tsx
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Politique de Confidentialité
    </h1>
    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Chez BoomPlan, nous nous engageons à protéger la vie privée de nos utilisateurs.
        Cette politique de confidentialité explique comment nous collectons, utilisons,
        divulguons et protégeons vos informations lorsque vous utilisez notre plateforme.
    </p>
    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Nous collectons des informations pour améliorer votre expérience, traiter vos transactions
        et vous fournir des services pertinents. Cela peut inclure des données que vous nous
        fournissez directement (comme votre nom, adresse e-mail) et des données collectées
        automatiquement (comme votre adresse IP, type de navigateur).
    </p>
    <p className="text-lg text-gray-700 leading-relaxed">
        Nous ne vendons ni ne louons vos informations personnelles à des tiers.
        Vos données sont utilisées uniquement dans le cadre de nos services et pour
        améliorer votre expérience sur BoomPlan. Nous mettons en œuvre des mesures de sécurité
        rigoureuses pour protéger vos informations contre tout accès, utilisation ou divulgation non autorisés.
    </p>
    </div>
</div>
);
};

export default PrivacyPolicyPage;
