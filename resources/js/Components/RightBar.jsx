import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FiUsers, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Inertia } from '@inertiajs/inertia';

const RightBar = ({ isOpen, onClose, isBoardLeader, projectId, currentUser, projectUsers, onOpenProjectMemberModal }) => {
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const rightBarRef = useRef(null);

    const handleClickOutside = (event) => {
        if (rightBarRef.current && !rightBarRef.current.contains(event.target)) {
            ('Clicked outside RightBar, closing RightBar');
            onClose();
        }
    };

    useEffect(() => {
        ('Adding event listener for mousedown');
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            ('Removing event listener for mousedown');
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLeaveProject = async () => {
        ('Attempting to leave project');
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
            ('Left project successfully');
            onClose();
            Inertia.visit('/profile', { preserveState: true });
        } catch (error) {
            ('Error leaving project:', projectId, error);
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
        ('Attempting to delete project');
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
            ('Deleted project successfully');
            onClose();
            Inertia.visit('/profile', { preserveState: true });
        } catch (error) {
            ('Error deleting project:', error);
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

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: isOpen ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full bg-white shadow-lg z-50 w-64"
            ref={rightBarRef}
        >
            <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-semibold text-center">Menu</h2>
                <button onClick={() => { ('Closing RightBar'); onClose(); }} className="text-gray-600 hover:text-gray-800">
                    <FaTimes />
                </button>
            </div>
            <div className="p-4 space-y-4">
                <p className='rounded p-2 hover:bg-gray-300/30 duration-200 cursor-pointer'>Changer le fond d'ecran</p>
                <p className='rounded p-2 hover:bg-gray-300/30 duration-200 cursor-pointer'>Partager le projet</p>
                
                {/* Onglet Projet avec menu déroulant */}
                <div>
                    <div
                        className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                        onClick={() => { ('Toggling project menu'); setIsProjectOpen(!isProjectOpen); }}
                    >
                        <FiUsers className="mr-3 text-gray-600" />
                        <span>Projet</span>
                        {isProjectOpen ? <FiChevronDown className="ml-auto text-gray-600" /> : <FiChevronRight className="ml-auto text-gray-600" />}
                    </div>
                    <motion.div
                        initial={false}
                        animate={isProjectOpen ? "open" : "closed"}
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
                                onClick={() => { ('Opening project member modal'); onOpenProjectMemberModal(); }}
                            >
                                <span>Membres</span>
                            </div>
                            <div
                                className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                                onClick={() => ('Ajouter un membre')}
                            >
                                <span>Ajouter un membre</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {isBoardLeader ? (
                    <>
                        <p className='text-red-600 rounded p-2 border border-red-600 hover:bg-red-600 hover:text-white duration-200 cursor-pointer' onClick={handleLeaveProject}>Se retirer du tableau</p>
                        <p className='text-red-600 rounded p-2 border border-red-600 hover:bg-red-600 hover:text-white duration-200 cursor-pointer' onClick={handleDeleteProject}>Supprimer le tableau</p>
                    </>
                ) : (
                    <p className='text-red-600 rounded p-2 border border-red-600 hover:bg-red-600 hover:text-white duration-200 cursor-pointer' onClick={handleLeaveProject}>Se retirer du tableau</p>
                )}
            </div>
        </motion.div>
    );
};

export default RightBar;