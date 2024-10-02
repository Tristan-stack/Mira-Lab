import React, { useEffect, useState } from 'react';
import { FiGrid, FiUsers, FiCalendar, FiMessageCircle, FiBell, FiLogOut } from 'react-icons/fi';

// Fonction pour générer un gradient aléatoire
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

export default function Sidebar({ user }) {
    const [gradientStyle, setGradientStyle] = useState({});

    useEffect(() => {
        // Générez le gradient une seule fois lors du montage du composant
        setGradientStyle({
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
            marginRight: '1rem', // Espace entre le cercle et le texte
        });
    }, []); // Le tableau vide signifie que cela s'exécute uniquement lors du premier rendu

    return (
        <div className="bg-white h-screen p-4 shadow-md">
            <div className="text-2xl font-bold text-purple-600 mb-8">Mira Labs</div>
            <div className="w-full flex flex-col items-center justify-between mr-6">
                <nav className="space-y-4 w-full">
                    <div className="w-full flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                        <FiGrid className="mr-3 text-gray-600" />
                        <span>Tableau</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                        <FiUsers className="mr-3 text-gray-600" />
                        <span>Teams</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                        <FiCalendar className="mr-3 text-gray-600" />
                        <span>Calendrier</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                        <FiMessageCircle className="mr-3 text-gray-600" />
                        <span>Chat</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                        <FiBell className="mr-3 text-gray-600" />
                        <span>Notifications</span>
                    </div>
                </nav>

                <div className="border-t border-gray-200 mt-8 pt-8">
                    <div className="flex items-center mb-4">
                        <div style={gradientStyle}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                            <p className="font-bold">{user.name}</p> {/* Affiche le nom de l'utilisateur */}
                            <p className="text-sm text-gray-500">{user.email}</p> {/* Affiche l'email de l'utilisateur */}
                        </div>
                    </div>
                    <button className="w-full duration-300 flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                        <FiLogOut className="mr-3" />
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}
