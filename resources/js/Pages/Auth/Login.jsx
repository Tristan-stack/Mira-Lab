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
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="w-full h-dvh flex justify-center items-center  bg-gray-100">
                <div>
                    <div className='mb-5'>
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Bon retour 👋
                        </h2>
                        <p className="text-sm text-gray-400 w-8/12">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis morbi pulvinar venatis non.
                        </p>
                    </div>
                    <div className=" w-5/6 p-8  bg-white shadow-lg rounded-l" style={{ boxShadow: '0px 0px 41px 5px rgba(0,0,0,0.1)' }}>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-purple-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className=" space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" className="block text-sm font-medium text-gray-700" />

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
                                <InputLabel htmlFor="password" value="Create Password" className="block text-sm font-medium text-gray-700" />

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

                            <div className="mt-4 flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="ms-2 text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <div className="mt-6">
                                <PrimaryButton className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg focus:ring-4 focus:ring-purple-500 disabled:opacity-50" disabled={processing}>
                                    Sign In
                                </PrimaryButton>
                            </div>

                            <div className="flex items-center justify-center mt-4">
                                <button type="button" className="w-full py-2 text-sm border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.74 24.56c0-.56-.05-1.12-.13-1.66H24v7.31h13.41c-.58 2.97-2.32 5.49-4.91 7.18l7.6 5.87c4.47-4.13 7.06-10.23 7.06-17.7z" /><path fill="#34A853" d="M24 48c6.48 0 11.91-2.15 15.87-5.83l-7.6-5.87c-2.1 1.42-4.78 2.29-8.27 2.29-6.35 0-11.73-4.29-13.64-10.06H1.69v6.33C5.62 43.14 13.89 48 24 48z" /><path fill="#FBBC05" d="M10.36 28.49a13.93 13.93 0 010-8.98V13.2H1.69a23.94 23.94 0 000 21.6l8.67-6.31z" /><path fill="#EA4335" d="M24 9.42c3.32 0 6.29 1.14 8.64 3.36l6.43-6.43C34.62 2.56 29.84 0 24 0 13.89 0 5.62 4.86 1.69 13.2l8.67 6.32C12.27 13.71 17.65 9.42 24 9.42z" /></svg>
                                    <span>Sign in with Google</span>
                                </button>
                            </div>

                            <p className="mt-4 text-sm text-center text-gray-600">
                                Don't have an account? <Link href={route('register')} className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
                <div className='w-2/5 bg-gray-400 bg-opacity-10 h-5/6 flex flex-col justify-around items-center'>
                    <div className='w-5/6 h-4/6 bg-black'>

                    </div>
                    <div className='flex flex-col justify-around items-center space-y-3'>
                        <h1 className='font-black text-3xl  text-center text-black '>Créer de magnifique tableau</h1>
                        <p className='w-2/3 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta nesciunt fugiat cumque, enim fuga reiciendis.</p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
