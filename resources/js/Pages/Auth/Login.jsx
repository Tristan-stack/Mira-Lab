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
            // Optionnel: gérer la redirection après la connexion réussie
            onSuccess: () => {
                // Redirection vers la page souhaitée après connexion réussie
                window.location.href = '/profile'; // Changez ceci si vous voulez rediriger vers une autre page
            },
        });
    };

    return (
        <div className='w-dvw flex flex-col items-center'>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Bon retour 👋
            </h2>

            <div className="w-1/4 p-8 mt-6 bg-white shadow-lg rounded-lg" style={{ boxShadow: '0px 0px 41px 5px rgba(0,0,0,0.1)' }}>
                {status && (
                    <div className="mb-4 text-sm font-medium text-purple-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="block text-sm font-medium text-gray-700" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2 text-sm text-red-600" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Mot de passe" className="block text-sm font-medium text-gray-700" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2 text-sm text-red-600" />
                    </div>

                    <div className="mt-6">
                        <PrimaryButton className=" rounded w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium focus:ring-4 focus:ring-purple-500 disabled:opacity-50" disabled={processing}>
                            Sign In
                        </PrimaryButton>
                    </div>

                    <p className="mt-4 text-sm text-center text-gray-600">
                        Vous n'avez pas de compte? <Link href={route('register')} className="font-medium text-indigo-600 hover:text-indigo-500">S'inscrire</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
