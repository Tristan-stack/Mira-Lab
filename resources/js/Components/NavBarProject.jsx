import React from 'react';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-3 bg-red-100">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
                Créer un tableau
            </button>
            <div className="flex-1 max-w-xl mx-4">
                <input
                    type="text"
                    placeholder="Rechercher un tableau"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="flex space-x-4 items-center">
                <button className="text-gray-600">Espaces de travail</button>
                <button className="text-gray-600">Récent</button>
                <button className="text-gray-600">Favoris</button>
            </div>
        </nav>
    );
}
