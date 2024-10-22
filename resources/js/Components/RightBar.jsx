import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Inertia } from '@inertiajs/inertia';

const RightBar = ({ isOpen, onClose, isBoardLeader, projectId, currentUser }) => {
    const handleLeaveProject = async () => {
        try {
            await axios.post(`/projects/${projectId}/leave`, { userId: currentUser.id });
            toast.success('Vous avez quitté le projet avec succès.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onClose();
            Inertia.visit('/profile', { preserveState: true });
        } catch (error) {
            console.log(projectId);
            console.error('Erreur lors de la tentative de quitter le projet :', error);
            toast.error('Erreur lors de la tentative de quitter le projet.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: isOpen ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full bg-white shadow-lg z-50 w-64"
        >
            <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-semibold text-center">Menu</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                    <FaTimes />
                </button>
            </div>
            <div className="p-4 space-y-4">
                <p className='rounded p-2 hover:bg-gray-300/30 duration-200 cursor-pointer'>Changer le fond d'ecran</p>
                <p className='rounded p-2 hover:bg-gray-300/30 duration-200 cursor-pointer'>Partager le projet</p>
                {isBoardLeader ? (
                    <p className='text-red-600 rounded p-2 border border-red-600 hover:bg-red-600 hover:text-white duration-200 cursor-pointer'>Supprimer le tableau</p>
                ) : (
                    <p className='text-red-600 rounded p-2 border border-red-600 hover:bg-red-600 hover:text-white duration-200 cursor-pointer' onClick={handleLeaveProject}>Se retirer du tableau</p>
                )}
            </div>
        </motion.div>
    );
};

export default RightBar;