// src/pages/Static/ContactPage.tsx
import React from 'react';

const ContactPage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Contactez-nous
    </h1>
    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
        Nous sommes là pour vous aider ! Que vous ayez des questions, des suggestions,
        ou que vous rencontriez un problème, n'hésitez pas à nous contacter.
        Notre équipe est prête à vous assister.
    </p>

    <div className="text-left space-y-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Informations de Contact
        </h2>
        <div className="space-y-4 text-gray-700">
        <div>
            <h3 className="font-semibold text-lg mb-1">Support Client</h3>
            <p>Email: <a href="farajaTshomaMalembe:support@boomplan.com" className="text-blue-600 hover:underline">support@boomplan.com</a></p>
            <p>Téléphone: +00 (243) 992-720-042</p>
        </div>
        <div>
            <h3 className="font-semibold text-lg mb-1">Partenariats & Affaires</h3>
            <p>Email: <a href="JAMALTECH:jamalTechPartner@boomplan.com" className="text-blue-600 hover:underline">partnerships@boomplan.com</a></p>
        </div>
        <div>
            <h3 className="font-semibold text-lg mb-1">Adresse de Bureau</h3>
            <p> Campus Wallace</p>
            <p>Uniluk Congo-DRC</p>
        </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Horaires d'Ouverture
        </h2>
        <p className="text-gray-700 leading-relaxed">
        Notre équipe de support est disponible du lundi au vendredi, de 9h00 à 17h00 (heure locale).
        Nous nous efforçons de répondre à toutes les demandes dans les 24 heures ouvrables 6 jours sur 7 jours de la semaine.
        </p>
    </div>
    </div>
</div>
);
};

export default ContactPage;
