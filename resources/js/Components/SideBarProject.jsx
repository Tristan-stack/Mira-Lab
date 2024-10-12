import React, { useState, useEffect } from 'react';
import { FiGrid, FiUsers, FiCalendar, FiMessageCircle, FiBell, FiLogOut, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

// Fonction pour générer un gradient aléatoire
const getRandomGradient = () => {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFEB33', '#33FFF6', '#8A33FF',
    ];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    let color2 = colors[Math.floor(Math.random() * colors.length)];
    while (color1 === color2) {
        color2 = colors[Math.floor(Math.random() * colors.length)];
    }
    return `linear-gradient(135deg, ${color1}, ${color2})`;
};

export default function SidebarProject({ user, onOpenModal }) {
    const [gradientStyle, setGradientStyle] = useState({});
    const [isTeamsOpen, setIsTeamsOpen] = useState(false);

    useEffect(() => {
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
            marginRight: '1rem',
        });
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleUserClick = () => {
        window.location.href = '/profile';
    };

    const toggleTeamsMenu = () => {
        setIsTeamsOpen(!isTeamsOpen);
    };

    return (
        <div className="bg-white h-screen p-4 shadow-md w-64 flex flex-col">
            <div className="text-2xl font-bold text-purple-600 mb-8">Board View</div>
            <nav className="space-y-4 w-full flex-grow overflow-y-auto">
                <div className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                    <FiGrid className="mr-3 text-gray-600" />
                    <span>Tableau</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                    <FiCalendar className="mr-3 text-gray-600" />
                    <span>Calendrier</span>
                </div>
                <div>
                    <div
                        className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                        onClick={toggleTeamsMenu}
                    >
                        <FiUsers className="mr-3 text-gray-600" />
                        <span>Teams</span>
                        {isTeamsOpen ? <FiChevronDown className="ml-auto text-gray-600" /> : <FiChevronRight className="ml-auto text-gray-600" />}
                    </div>
                    {/* Animation du sous-menu */}
                    <motion.div
                        initial={false}
                        animate={isTeamsOpen ? "open" : "closed"}
                        variants={{
                            open: { height: "auto", opacity: 1 },
                            closed: { height: 0, opacity: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="ml-8 space-y-2">
                            <div
                                className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                                onClick={onOpenModal} // Ouvrir le pop-up
                            >
                                <span>Membres</span>
                            </div>
                            <div className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                                <span>Ajouter un membre</span>
                            </div>
                        </div>
                    </motion.div>
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
                <div className="flex items-center mb-4 cursor-pointer" onClick={handleUserClick}>
                    <div style={gradientStyle}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="ml-4">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                    <FiLogOut className="mr-3" />
                    Log out
                </button>
            </div>
        </div>
    );
}