// src/pages/Static/CookiesPage.tsx
import React from 'react';

const CookiesPage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Politique des Cookies
    </h1>
    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Ce site web utilise des cookies pour améliorer votre expérience de navigation.
        Les cookies sont de petits fichiers texte stockés sur votre appareil qui nous aident
        à comprendre comment vous utilisez notre site et à personnaliser votre contenu.
    </p>

    <div className="text-left space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Qu'est-ce qu'un cookie ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Un cookie est un petit fichier, généralement composé de lettres et de chiffres,
        téléchargé sur un appareil lorsque l'utilisateur accède à un site web.
        Les cookies permettent à un site web de reconnaître l'appareil d'un utilisateur.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Comment utilisons-nous les cookies ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Nous utilisons les cookies pour diverses raisons :
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
        <li>
            Cookies essentiels : Nécessaires au fonctionnement de base du site web,
            permettant la navigation et l'accès aux zones sécurisées.
        </li>
        <li>
            Cookies de performance : Collectent des informations anonymes sur la façon
            dont les visiteurs utilisent notre site, nous aidant à améliorer son fonctionnement.
        </li>
        <li>
            Cookies de fonctionnalité : Permettent au site web de se souvenir de vos choix
            (comme votre nom d'utilisateur, votre langue ou la région où vous vous trouvez)
            et de fournir des fonctionnalités améliorées et plus personnelles.
        </li>
        <li>
            Cookies de ciblage/publicitaires : Utilisés pour diffuser des publicités
            plus pertinentes pour vous et vos intérêts.
        </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Gestion des cookies
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Vous avez le droit de choisir d'accepter ou de refuser les cookies.
        La plupart des navigateurs web acceptent automatiquement les cookies,
        mais vous pouvez généralement modifier les paramètres de votre navigateur
        pour refuser les cookies si vous le préférez.
        Cependant, cela pourrait vous empêcher de profiter pleinement de notre site web.
        </p>
        <p className="text-gray-700 leading-relaxed">
        Pour plus d'informations sur la gestion des cookies,
        veuillez consulter les options d'aide de votre navigateur.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Modifications de cette Politique
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Nous pouvons mettre à jour notre Politique des Cookies de temps à autre.
        Nous vous informerons de tout changement en publiant la nouvelle politique
        sur cette page.
        </p>
    </div>
    </div>
</div>
);
};

export default CookiesPage;
