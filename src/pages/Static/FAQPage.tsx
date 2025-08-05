// src/pages/Static/FAQPage.tsx
import React from 'react';

const FAQPage: React.FC = () => {
return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Questions Fréquentes (FAQ)
    </h1>
    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
        Trouvez rapidement les réponses à vos questions les plus courantes sur l'utilisation de BoomPlan.
    </p>

    <div className="text-left space-y-6">
        {/* Question 1 */}
        <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Q: Comment puis-je créer un événement sur BoomPlan ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
            R: Pour créer un événement, vous devez d'abord vous connecter en tant qu'organisateur.
            Une fois connecté, naviguez vers la page "Créer un événement" via le menu de navigation.
            Vous serez guidé à travers un processus en plusieurs étapes pour saisir les détails de votre événement,
            ajouter des types de billets et le publier.
        </p>
        </div>

        {/* Question 2 */}
        <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Q: Est-il nécessaire d'avoir un compte pour acheter des billets ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
            R: Oui, pour des raisons de sécurité et pour vous offrir une meilleure expérience (suivi de vos commandes,
            gestion de vos billets), il est nécessaire de créer un compte et de vous connecter avant de pouvoir acheter des billets.
        </p>
        </div>

        {/* Question 3 */}
        <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Q: Comment puis-je contacter le support client ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
            R: Vous pouvez nous contacter via la page "Contact" accessible depuis le pied de page de notre site.
            Nous nous efforçons de répondre à toutes les demandes dans les plus brefs délais.
        </p>
        </div>

        {/* Question 4 */}
        <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Q: Puis-je modifier les détails de mon événement après sa publication ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
            R: Oui, en tant qu'organisateur, vous pouvez modifier la plupart des détails de votre événement
            après sa publication. Accédez à votre tableau de bord d'organisateur, sélectionnez l'événement
            que vous souhaitez modifier et apportez les changements nécessaires.
            Les modifications importantes peuvent nécessiter une nouvelle approbation.
        </p>
        </div>

        {/* Question 5 */}
        <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Q: Comment fonctionne la politique de remboursement des billets ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
            R: La politique de remboursement des billets est définie par l'organisateur de chaque événement.
            Veuillez consulter les conditions spécifiques de l'événement pour lequel vous avez acheté des billets.
            En cas de questions, vous pouvez contacter directement l'organisateur via les informations fournies sur la page de l'événement.
        </p>
        </div>
    </div>
    </div>
</div>
);
};

export default FAQPage;
