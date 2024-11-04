import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const Accueil = () => {
    const handleButtonClick = () => {
        Inertia.visit('/home');
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center">
                <h1 id="welcomeText" className="text-5xl font-bold text-center mb-4">
                    Oui
                </h1>
                <button
                    onClick={handleButtonClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Aller à HomePage
                </button>
            </div>
        </div>
    );
};

export default Accueil;