import React from 'react';

// Fonction pour générer un gradient aléatoire
//ca ne peut pas etre la meme couleur deux fois

const getRandomGradient = () => {
    const colors = [
        '#FF5733', // Rouge
        '#33FF57', // Vert
        '#3357FF', // Bleu
        '#FF33A6', // Rose
        '#FFEB33', // Jaune
        '#33FFF6', // Cyan
        '#8A33FF', // Violet
    ];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    let color2 = colors[Math.floor(Math.random() * colors.length)];
    while (color1 === color2) {
        color2 = colors[Math.floor(Math.random() * colors.length)];
    }
    return `linear-gradient(135deg, ${color1}, ${color2})`;
};

export default function Navbar({ username }) {
    const gradientStyle = {
        background: getRandomGradient(),
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem',
    };

    return (
        <nav className="flex items-center justify-around p-4 shadow-md bg-white">
            <div className="flex items-center">
                <div className="font-black">Mira</div>
            </div>
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
            <div className="flex space-x-4">
                <button className="text-gray-600">Espaces de travail</button>
                <button className="text-gray-600">Récent</button>
                <button className="text-gray-600">Favoris</button>
            </div>
            {/* Cercle avec le gradient et la première lettre du nom d'utilisateur */}
            <div style={gradientStyle}>
                {username ? username.charAt(0).toUpperCase() : '?'}
            </div>
        </nav>
    );
}
