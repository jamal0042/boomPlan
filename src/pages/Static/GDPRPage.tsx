// src/pages/Static/GDPRPage.tsx
import React from 'react';

const GDPRPage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Conformité au RGPD (GDPR)
    </h1>
    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        BoomPlan s'engage pleinement à respecter le Règlement Général sur la Protection des Données (RGPD),
        une réglementation de l'Union Européenne qui renforce les droits des individus concernant leurs données personnelles.
        Nous mettons en œuvre des pratiques rigoureuses pour assurer la confidentialité et la sécurité de vos informations.
    </p>

    <div className="text-left space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Vos Droits en vertu du RGPD
        </h2>
        <p className="text-gray-700 leading-relaxed">
        En tant qu'utilisateur de BoomPlan, vous disposez de plusieurs droits concernant vos données personnelles :
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
        <li>
            Droit d'accès : Vous avez le droit de demander une copie des informations personnelles que nous détenons à votre sujet.
        </li>
        <li>
            Droit de rectification : Vous avez le droit de demander la correction de toute information que vous estimez inexacte ou incomplète.
        </li>
        <li>
            Droit à l'effacement : Vous avez le droit de demander la suppression de vos données personnelles, sous certaines conditions.
        </li>
        <li>
            Droit à la limitation du traitement : Vous avez le droit de demander que nous limitions le traitement de vos données personnelles, sous certaines conditions.
        </li>
        <li>
            Droit à la portabilité des données : Vous avez le droit de demander que nous transférions les données que nous avons collectées à une autre organisation, ou directement à vous, sous certaines conditions.
        </li>
        <li>
            Droit d'opposition : Vous avez le droit de vous opposer à notre traitement de vos données personnelles, sous certaines conditions.
        </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Comment Nous Assurons la Conformité
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Pour garantir notre conformité au RGPD, nous avons mis en place :
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
        <li>
            Des politiques claires de collecte et de traitement des données.
        </li>
        <li>
            Des mesures de sécurité techniques et organisationnelles robustes pour protéger vos données.
        </li>
        <li>
            Des procédures pour répondre à vos demandes concernant vos droits en matière de données.
        </li>
        <li>
            La transparence sur la manière dont vos données sont utilisées.
        </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Nous Contacter
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Si vous avez des questions concernant nos pratiques en matière de RGPD ou si vous souhaitez exercer l'un de vos droits,
        n'hésitez pas à nous contacter via notre page de contact ou en vous référant à notre Politique de Confidentialité.
        </p>
    </div>
    </div>
</div>
);
};

export default GDPRPage;
