import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BackgroundLines } from "@/components/ui/background-lines";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">

            <div className='w-dvw h-dvh flex justify-center items-center'>

                <motion.div
                    className='w-dvw flex flex-col items-center'
                    initial={{ opacity: 0, y: 20 }} // Initial position and opacity
                    animate={{ opacity: 1, y: 0 }} // Animation to show the div
                    exit={{ opacity: 0, y: 20 }} // Animation to hide the div
                    transition={{ duration: 0.5 }} // Adjust duration as needed
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                        Créez votre compte 👋
                    </h2>

                    <div className="w-1/4 p-8 mt-6 bg-white shadow-lg rounded-lg" style={{ boxShadow: '0px 0px 41px 5px rgba(0,0,0,0.1)' }}>
                        <motion.form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            {status && (
                                <div className="mb-4 text-sm font-medium text-purple-600">
                                    {status}
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="name" value="Nom" className="block text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-sm text-red-600" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" className="block text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2 text-sm text-red-600" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Mot de passe" className="block text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2 text-sm text-red-600" />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirmer le mot de passe"
                                    className="block text-sm font-medium text-gray-700"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2 text-sm text-red-600" />
                            </div>

                            <div className="mt-6">
                                <PrimaryButton className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg focus:ring-4 focus:ring-purple-500 disabled:opacity-50" disabled={processing}>
                                    S'inscrire
                                </PrimaryButton>
                            </div>

                            <p className="mt-4 text-sm text-center text-gray-600">
                                Déjà inscrit ? <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">Se connecter</Link>
                            </p>
                        </motion.form>
                    </div>
                </motion.div>
            </div>
        </BackgroundLines>
    );
}
