import React, { useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role_id: number;
  terms: boolean;
  // avatar_url n'est plus directement lié à un input text, mais sera généré ou laissé vide
  // Le backend s'attend toujours à une chaîne, donc nous le gardons dans l'interface pour la clarté.
  avatar_url?: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Correction du nom de la fonction
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // État pour l'aperçu de l'avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // État pour le fichier d'avatar réel

  // CORRECTION: Utiliser le nouveau nom de la fonction 'signupUser'
  const { signupUser } = useAuth(); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    // setValue n'est plus nécessaire pour avatar_url car nous n'envoyons plus de base64 directement
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  // Gère la sélection de fichier pour l'avatar
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file); // Stocke le fichier
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string); // Définit l'aperçu pour l'affichage
      };
      reader.readAsDataURL(file); // Lit le fichier comme une URL de données
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      // Créer un objet FormData pour envoyer le fichier et les autres données
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role_id', String(data.role_id)); // Convertir en chaîne pour FormData
      formData.append('terms', String(data.terms)); // Convertir en chaîne pour FormData

      if (avatarFile) {
        // Ajouter le fichier d'avatar à FormData. 'avatar' sera le nom du champ attendu par le backend.
        formData.append('avatar', avatarFile); 
      }

      // Appeler la fonction signupUser avec FormData
      await signupUser(formData);

      toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error(error.message || "Échec de la création du compte. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Se connecter à un compte existant
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Affichage de la photo de profil en haut du formulaire */}
          <div className="flex justify-center mb-6">
            <div className="flex-shrink-0 relative">
              <img
                src={avatarPreview || `https://placehold.co/96x96/E0E7FF/4F46E5?text=Avatar`} // Aperçu ou placeholder
                alt="Aperçu de l'avatar"
                className="h-24 w-24 rounded-full object-cover border-4 border-blue-200 shadow-md"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/96x96/E0E7FF/4F46E5?text=Avatar`;
                }}
              />
              {/* Bouton pour déclencher la sélection de fichier */}
              <label
                htmlFor="avatar_upload"
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
                title="Télécharger une photo de profil"
              >
                <PhotoIcon className="h-5 w-5" />
                <input
                  id="avatar_upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Le champ avatar_url n'est plus un input caché géré par react-hook-form directement */}
            {/* Il est envoyé via FormData si un fichier est sélectionné */}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <div className="mt-1">
                <input
                  {...register('name', {
                    required: 'Le nom complet est requis',
                    minLength: {
                      value: 2,
                      message: 'Le nom doit contenir au moins 2 caractères',
                    },
                  })}
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Taper votre nom complet"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse Email
              </label>
              <div className="mt-1">
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Adresse email invalide',
                    },
                  })}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Taper votre email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Type de compte
              </label>
              <div className="mt-1">
                <select
                  {...register('role_id', {
                    required: 'Veuillez sélectionner un type de compte',
                    valueAsNumber: true, // Assurez-vous que la valeur est traitée comme un nombre
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner le type</option>
                  <option value={1}>Utilisateur - Je veux participer à des Événements sur la plateforme</option>
                  <option value={2}>Organisateur - Je veux créer et gérer des Événements</option>
                </select>
                {errors.role_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.role_id.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de Passe
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                    minLength: {
                      value: 8,
                      message: 'Le mot de passe doit contenir au moins 8 caractères',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Entrer votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer Le mot de passe
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Veuillez confirmer le mot de passe',
                    validate: (value) =>
                      value === password || 'Les mots de passe ne correspondent pas',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Confirmer votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                {...register('terms', {
                  required: 'Vous devez accepter les conditions d\'utilisation et la politique de confidentialité',
                })}
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                J'accepte les{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Politique de Confidentialité
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Création du compte en cours...
                  </div>
                ) : (
                  'Créer un compte'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
