import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi'; // Importer l'icône +

const TeamMembersModal = ({ isOpen, onClose, teamUsers }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                >
                    <div className="absolute inset-0 bg-gray-200 bg-opacity-70 backdrop-filter backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
                    <motion.div
                        className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Membres de l'équipe</h2>

                        {/* Bouton Ajouter un membre */}
                        <motion.button
                            className="flex items-center justify-center mx-1 my-1 w-8 h-8 bg-green-600 text-white rounded-full absolute top-0 right-0 transform -translate-y-6 transition-all duration-300 hover:bg-green-500"
                            onClick={() => console.log('Ajouter un membre')} // Remplacez par votre logique d'ajout
                            initial={{ scale: 1 }} // État initial
                            whileHover={{ scale: 1.1 }} // État au survol
                        >
                            <FiPlus className="w-5 h-5" />
                        </motion.button>

                        <ul className="list-disc list-inside mb-4 text-gray-700">
                            {teamUsers.map((user, index) => (
                                <motion.li
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex justify-between mb-2 border-b border-gray-200 pb-2"
                                >
                                    <span>{user.name}</span>
                                    <span className="font-semibold">{user.pivot.role}</span>
                                </motion.li>
                            ))}
                        </ul>
                        <button
                            className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors duration-300"
                            onClick={onClose}
                        >
                            Fermer
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TeamMembersModal;
