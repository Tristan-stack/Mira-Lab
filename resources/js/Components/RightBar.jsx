import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FiUsers, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Inertia } from '@inertiajs/inertia';
import Modal from 'react-modal';

const RightBar = ({ isOpen, onClose, isBoardLeader, projectId, currentUser }) => {
    const rightBarRef = useRef(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleClickOutside = (event) => {
        if (rightBarRef.current && !rightBarRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const handleDeleteProject = async () => {
        try {
            await axios.delete(`/projects/${projectId}`);
            toast.success('Le projet a été supprimé avec succès.', {
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
            toast.error('Erreur lors de la tentative de suppression du projet.', {
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

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: isOpen ? '0%' : '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full bg-white shadow-lg z-50 w-64"
                ref={rightBarRef}
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
                        <>
                            <p className='text-red-600 rounded p-2 border border-red-600 hover:bg-red-600 hover:text-white duration-200 cursor-pointer' onClick={handleLeaveProject}>Se retirer du tableau</p>
                            <p className='text-red-600 rounded p-2 border border-red-600 hover:bg-red-600 hover:text-white duration-200 cursor-pointer' onClick={openDeleteModal}>Supprimer le tableau</p>
                        </>
                    ) : (
                        <p className='text-red-600 rounded p-2 border border-red-600 hover:bg-red-600 hover:text-white duration-200 cursor-pointer' onClick={handleLeaveProject}>Se retirer du tableau</p>
                    )}
                </div>
            </motion.div>

            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="Confirmation de suppression"
                appElement={document.getElementById('root') || undefined}
                className="fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-20 backdrop-filter backdrop-blur-sm"
            >
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
                    <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.</p>
                    <div className="flex justify-end space-x-4">
                        <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">Annuler</button>
                        <button onClick={handleDeleteProject} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Supprimer</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RightBar;