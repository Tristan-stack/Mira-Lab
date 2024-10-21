import React, { useState } from 'react';
import { FiGrid, FiUsers, FiCalendar, FiMessageCircle, FiBell, FiLogOut, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useGradient } from '../contexts/GradientContext.jsx'; // Importer le hook useGradient

export default function SidebarProject({ user, onOpenModal }) {
    const gradient = useGradient(); // Utiliser le hook pour obtenir le dégradé
    const [isTeamsOpen, setIsTeamsOpen] = useState(false); // État pour gérer l'ouverture des équipes

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
                        onClick={() => setIsTeamsOpen(!isTeamsOpen)}
                    >
                        <FiUsers className="mr-3 text-gray-600" />
                        <span>Teams</span>
                        {isTeamsOpen ? <FiChevronDown className="ml-auto text-gray-600" /> : <FiChevronRight className="ml-auto text-gray-600" />}
                    </div>
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
                                onClick={onOpenModal}
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
                    <div style={{ background: gradient, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1rem', marginRight: '1rem' }}>
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