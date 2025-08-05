// src/pages/Static/TermsOfServicePage.tsx
import React from 'react';

const TermsOfServicePage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Conditions d'Utilisation
    </h1>
    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Bienvenue sur BoomPlan. En accédant à notre site web et en utilisant nos services,
        vous acceptez d'être lié par les présentes conditions d'utilisation,
        y compris toutes les politiques et directives mentionnées ici.
        Veuillez les lire attentivement.
    </p>

    <div className="text-left space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        1. Acceptation des Conditions
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Ces Conditions d'Utilisation constituent un accord juridique contraignant
        entre vous et BoomPlan. Si vous n'acceptez pas ces conditions,
        vous ne devez pas utiliser nos services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        2. Modifications des Conditions
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Nous nous réservons le droit de modifier ces conditions à tout moment.
        Toutes les modifications prendront effet immédiatement après leur publication
        sur le site web. Votre utilisation continue des services constitue votre
        acceptation des conditions modifiées.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        3. Utilisation de la Plateforme
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Vous acceptez d'utiliser BoomPlan uniquement à des fins légales et
        conformément aux présentes Conditions. Vous ne devez pas utiliser la
        plateforme d'une manière qui pourrait endommager, désactiver, surcharger
        ou altérer le site ou interférer avec l'utilisation et la jouissance
        de la plateforme par toute autre partie.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        4. Comptes Utilisateur
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Lorsque vous créez un compte chez nous, vous garantissez que les
        informations que vous nous fournissez sont exactes, complètes et
        à jour à tout moment. Vous êtes responsable de la confidentialité de
        votre mot de passe et de toutes les activités qui se produisent sous
        votre compte.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        5. Contenu Utilisateur
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Vous êtes seul responsable du contenu que vous publiez sur BoomPlan,
        y compris les informations sur les événements, les images et les commentaires.
        Vous garantissez que vous avez les droits nécessaires pour publier ce contenu
        et qu'il ne viole pas les droits d'autrui ou les lois applicables.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        6. Limitation de Responsabilité
        </h2>
        <p className="text-gray-700 leading-relaxed">
        BoomPlan ne sera pas responsable des dommages directs, indirects,
        accidentels, spéciaux, consécutifs ou exemplaires résultant de
        v'otre utilisation ou de votre incapacité à utiliser la plateforme.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        7. Droit Applicable
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Ces Conditions seront régies et interprétées conformément aux lois
        du pays où BoomPlan est enregistré, sans égard à ses dispositions
        en matière de conflit de lois.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        8. Contact
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Si vous avez des questions concernant ces Conditions d'Utilisation,
        veuillez nous contacter via notre page de contact.
        </p>
    </div>
    </div>
</div>
);
};

export default TermsOfServicePage;
