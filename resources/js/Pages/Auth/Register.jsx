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
            <div className='w-dvw h-dvh flex justify-center items-center z-10'>
                <motion.div
                    className='w-full max-w-md p-8 mt-6 bg-white transform transition-all duration-500 hover:shadow-2xl shadow-lg rounded-lg' style={{ boxShadow: '0px 0px 41px 5px rgba(0,0,0,0.1)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-3">
                        Créez votre compte 👋
                    </h2>

                    <motion.form onSubmit={submit} className="space-y-6" action="#">
                        <div>
                            <InputLabel htmlFor="name" value="Nom" className="block text-sm font-semibold text-gray-600" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="w-full px-4 py-3 mt-1 border rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:border-purple-400 border-gray-200"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="text-sm text-red-500 mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" className="block text-sm font-semibold text-gray-600" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 mt-1 border rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:border-purple-400 border-gray-200"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="text-sm text-red-500 mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Mot de passe" className="block text-sm font-semibold text-gray-600" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 mt-1 border rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:border-purple-400 border-gray-200"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="text-sm text-red-500 mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" className="block text-sm font-semibold text-gray-600" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full px-4 py-3 mt-1 border rounded-lg shadow-sm focus:ring focus:ring-purple-300 focus:border-purple-400 border-gray-200"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="text-sm text-red-500 mt-2" />
                        </div>

                        <div className="mt-6">
                            <PrimaryButton className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:ring focus:ring-purple-400 focus:ring-opacity-50 disabled:opacity-50" disabled={processing}>
                                S'inscrire
                            </PrimaryButton>
                        </div>

                        <p className="mt-4 text-sm text-center text-gray-500">
                            Déjà inscrit ? <Link href="/home" className="font-medium text-purple-600 hover:text-purple-500">Se connecter</Link>
                        </p>
                    </motion.form>
                </motion.div>
            </div>
        </BackgroundLines>
    );
}
