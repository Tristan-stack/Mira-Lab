import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                window.location.href = '/profile';
            },
        });
    };

    return (
        <div className="shadow-lg rounded-lg" style={{ boxShadow: '0px 0px 41px 5px rgba(0,0,0,0.1)' }}>
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md transform transition duration-300 hover:shadow-xl">
                <h2 className="text-3xl font-extrabold text-gray-800 text-center">Bon retour 👋</h2>
                <p className="mt-2 text-center text-gray-500">
                    Connectez-vous à votre compte pour continuer
                </p>

                {status && (
                    <div className="mt-4 text-sm text-center text-purple-600 font-medium">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-gray-700 font-semibold" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Mot de passe" className="text-gray-700 font-semibold" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-1 text-sm text-red-600" />
                    </div>

                    <div className="mt-6">
                        <PrimaryButton
                            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 transition duration-150"
                            disabled={processing}
                        >
                            Connexion
                        </PrimaryButton>
                    </div>
                </form>

                <p className="mt-6 text-sm text-center text-gray-500">
                    Vous n'avez pas de compte ?{' '}
                    <Link href={route('register')} className="text-purple-600 font-semibold hover:underline">
                        S'inscrire
                    </Link>
                </p>
            </div>
        </div>
    );
}
