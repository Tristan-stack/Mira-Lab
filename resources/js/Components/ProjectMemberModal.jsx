import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowUp, FaArrowDown, FaTimes } from 'react-icons/fa';

const ProjectMemberModal = ({ isOpen, onClose, projectUsers = [], currentUser, setProjectUsers }) => {
    const [users, setUsers] = useState(projectUsers);

    useEffect(() => {
        if (JSON.stringify(users) !== JSON.stringify(projectUsers)) {
            setUsers(projectUsers);
        }
    }, [projectUsers]);
    
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Séparer les utilisateurs en deux groupes : "Board Leader" et "Contributors"
    const boardLeaders = users.filter(user => user.pivot?.role === 'Board Leader');
    const contributors = users.filter(user => user.pivot?.role === 'contributor' || user.pivot?.role === 'Contributor');

    // Logs pour vérifier les utilisateurs filtrés
    console.log('Board Leaders:', boardLeaders);
    console.log('Contributors:', contributors);

    // Vérifier si le user connecté est board leader
    const currentUserInProject = users.find(user => user.id === currentUser.id);
    const isBoardLeader = currentUserInProject?.pivot.role === 'Board Leader';

    console.log('currentUserInProject:', currentUserInProject);
    console.log('isBoardLeader:', isBoardLeader);

    // Fonction pour changer le rôle d'un utilisateur
    const changeUserRole = async (userId, newRole) => {
        try {
            const response = await axios.post(`/projects/${users[0].pivot.project_id}/promote`, {
                user_id: userId,
                role: newRole
            });
            toast.success('Le rôle de l\'utilisateur a été mis à jour avec succès.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Mettre à jour l'état local des utilisateurs
            const updatedUsers = users.map(user => 
                user.id === userId ? { ...user, pivot: { ...user.pivot, role: newRole } } : user
            );
            setUsers(updatedUsers);
            setProjectUsers(updatedUsers); // Mettre à jour les utilisateurs dans le composant parent
        } catch (error) {
            console.error('Erreur lors de la mise à jour du rôle :', error);
            toast.error('Erreur lors de la mise à jour du rôle de l\'utilisateur.', {
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

    // Fonction pour rétrograder le rôle d'un utilisateur
    const downgradeUserRole = async (userId) => {
        try {
            const response = await axios.post(`/projects/${users[0].pivot.project_id}/downgrade`, {
                user_id: userId,
                role: 'Contributor'
            });
            toast.success('Le rôle de l\'utilisateur a été rétrogradé avec succès.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Mettre à jour l'état local des utilisateurs
            const updatedUsers = users.map(user => 
                user.id === userId ? { ...user, pivot: { ...user.pivot, role: 'Contributor' } } : user
            );
            setUsers(updatedUsers);
            setProjectUsers(updatedUsers); // Mettre à jour les utilisateurs dans le composant parent
        } catch (error) {
            console.error('Erreur lors de la rétrogradation du rôle :', error);
            toast.error('Erreur lors de la rétrogradation du rôle de l\'utilisateur.', {
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
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                >
                    <div className="absolute inset-0 bg-gray-700/30 bg-opacity-70 backdrop-filter backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
                    <motion.div
                        className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Membres du projet</h2>
                            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Board Leaders</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 max-h-32 overflow-y-auto">
                                {boardLeaders.map((user, index) => (
                                    <motion.li
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
                                    >
                                        <span>{user.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{user.pivot?.role}</span>
                                            {isBoardLeader && user.id !== currentUser.id && (
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => downgradeUserRole(user.id)}
                                                >
                                                    <FaArrowDown />
                                                </button>
                                            )}
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Contributors</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 max-h-32 overflow-y-auto">
                                {contributors.map((user, index) => (
                                    <motion.li
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
                                    >
                                        <span>{user.name}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{user.pivot?.role}</span>
                                            {isBoardLeader && (
                                                <button
                                                    className="text-green-600 hover:text-green-800"
                                                    onClick={() => changeUserRole(user.id, 'Board Leader')}
                                                >
                                                    <FaArrowUp />
                                                </button>
                                            )}
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

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

export default ProjectMemberModal;