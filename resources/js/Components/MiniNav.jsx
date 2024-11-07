import React, { useState, useEffect, useRef } from 'react';
import { FaLock, FaLockOpen, FaEllipsisH, FaCrown, FaUsers, FaBell, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGradient } from '../contexts/GradientContext.jsx';
import axios from 'axios';
import VisibilityDialog from './VisibilityDialog';
import RightBar from './RightBar';
import { AnimatePresence, motion } from 'framer-motion';
import Tooltip from './Tooltip';

const MiniNav = ({ project: initialProject, currentUser, isBoardLeader, projectId, onlineUsers }) => {
    const gradient = useGradient();
    const [project, setProject] = useState(initialProject);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(project.name);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Déclaration de l'état
    const [readNotifications, setReadNotifications] = useState([]); // État pour les notifications lues
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Nouvelle tâche assignée : Corriger les bugs' },
        { id: 2, message: 'Alice a commenté sur la tâche : Mettre à jour la documentation' },
        { id: 3, message: 'La date limite du projet est dans 3 jours' },
        { id: 4, message: 'Nouvelle tâche assignée : Réviser le code' },
        { id: 5, message: 'Bob a commenté sur la tâche : Ajouter des tests unitaires' },
    ]); // État pour les notifications

    const userDialogRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        setProject(initialProject);
    }, [initialProject]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDialogRef.current && !userDialogRef.current.contains(event.target)) {
                setIsUserDialogOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(project.project_code)
            .then(() => {
                toast.success('Code du projet copié !', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch(err => {
                toast.error('Erreur lors de la copie du code du projet.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.error('Erreur lors de la copie du code du projet :', err);
            });
    };

    const handleTitleClick = () => {
        setIsEditingTitle(true);
    };

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    };

    const handleTitleBlur = async () => {
        setIsEditingTitle(false);
        if (newTitle !== project.name) {
            try {
                const response = await axios.put(`/projects/${project.id}/update-title`, { name: newTitle });
                toast.success('Le titre du projet a été mis à jour avec succès.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setProject(prevProject => ({ ...prevProject, name: response.data.project.name }));
            } catch (error) {
                toast.error('Erreur lors de la mise à jour du titre du projet.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.error('Erreur lors de la mise à jour du titre du projet :', error);
            }
        }
    };

    const handleTitleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        }
    };

    const handleLockIconClick = () => {
        setIsDialogOpen(!isDialogOpen);
    };

    const handleUserIconClick = () => {
        setIsUserDialogOpen(!isUserDialogOpen);
    };

    const handleEllipsisClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleVisibilityChange = async (status) => {
        if (!isBoardLeader) {
            toast.error('Seul le Board Leader peut changer le statut de visibilité.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        try {
            const response = await axios.put(`/projects/${project.id}/update-visibility`, { status });
            toast.success('Le statut de visibilité du projet a été mis à jour avec succès.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setProject(prevProject => ({ ...prevProject, status: response.data.project.status }));
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de visibilité du projet :', error);
            if (error.response) {
                console.error('Erreur de réponse API :', error.response.data);
            }
            toast.error('Erreur lors de la mise à jour du statut de visibilité du projet.', {
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

    const handleNotificationIconClick = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const handleCloseNotification = () => {
        setIsNotificationOpen(false);
    };

    const handleMarkAsRead = (id) => {
        setReadNotifications([...readNotifications, id]);
    };

    const handleDeleteNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    return (
        <div className="relative">
            <motion.div
                className="flex justify-between items-center p-3 bg-gray-500/20 shadow-md"
                animate={{ marginRight: isSidebarOpen ? '16rem' : '0rem' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center space-x-4">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={newTitle}
                            onChange={handleTitleChange}
                            onBlur={handleTitleBlur}
                            onKeyPress={handleTitleKeyPress}
                            className="text-white text-xl font-semibold ml-2 bg-transparent border-b-2 border-white focus:outline-none"
                            autoFocus
                        />
                    ) : (
                        <h2
                            className="text-white p-2 hover:bg-white/30 duration-200 text-xl font-semibold ml-2 cursor-pointer rounded"
                            onClick={handleTitleClick}
                        >
                            {newTitle}
                        </h2>
                    )}
                    <div
                        className="p-2 rounded hover:bg-white/30 duration-200 cursor-pointer"
                        onClick={handleLockIconClick}
                    >
                        {project.status === 'Public' ? (
                            <FaLockOpen className="text-white" />
                        ) : (
                            <FaLock className="text-white" />
                        )}
                    </div>
                    <div
                        className="p-2 rounded hover:bg-white/30 duration-200 cursor-pointer"
                        onClick={handleUserIconClick}
                    >
                        <FaUsers className="text-white text-xl" />
                    </div>
                    <div
                        className="p-2 rounded hover:bg-white/30 duration-200 cursor-pointer"
                        onClick={handleNotificationIconClick}
                    >
                        <FaBell className="text-white text-lg" />
                    </div>
                </div>
                <div className="flex items-center space-x-4 mr-2">
                    <div
                        style={{
                            background: gradient,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                        }}
                    >
                        {currentUser.name.charAt(0)}
                    </div>
                    <button
                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                        onClick={handleShare}
                    >
                        Partager
                    </button>
                    {isBoardLeader && (
                        <Tooltip text="Vous êtes le Board Leader du projet">
                            <div className="p-2 rounded hover:bg-white/30 duration-200 cursor-pointer">
                                <FaCrown className="text-yellow-500" />
                            </div>
                        </Tooltip>
                    )}
                    <div
                        className="p-2 rounded hover:bg-white/30 duration-200 cursor-pointer"
                        onClick={handleEllipsisClick}
                    >
                        <FaEllipsisH className="text-white cursor-pointer" />
                    </div>
                </div>
            </motion.div>

            {/* Fenêtre contextuelle des notifications */}
            <AnimatePresence>
                {isNotificationOpen && (
                    <motion.div
                        ref={notificationRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 left-24 bg-white shadow-lg rounded p-4 z-50 w-72"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <button onClick={handleCloseNotification} className="text-red-500 hover:text-red-700 duration-150">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="text-gray-800 text-center">Aucune notification</div>
                            ) : (
                                notifications.map((notification) => (
                                    <div key={notification.id} className="p-2 bg-gray-200 rounded shadow flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            {!readNotifications.includes(notification.id) && (
                                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            )}
                                            <span onClick={() => handleMarkAsRead(notification.id)} className="cursor-pointer">
                                                {notification.message}
                                            </span>
                                        </div>
                                        <button onClick={() => handleDeleteNotification(notification.id)} className="text-red-500 hover:text-red-700 text-xs">
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fenêtres contextuelles existantes */}
            <AnimatePresence>
                {isDialogOpen && (
                    <VisibilityDialog
                        project={project}
                        onClose={() => setIsDialogOpen(false)}
                        onVisibilityChange={handleVisibilityChange}
                        isBoardLeader={isBoardLeader}
                    />
                )}
                {isUserDialogOpen && (
                    <motion.div
                        ref={userDialogRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 left-56 bg-white shadow-lg rounded p-4 z-50"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            Utilisateurs connectés : {onlineUsers.length}
                        </h3>
                        <ul>
                            {onlineUsers.map((user) => (
                                <li key={user.id} className="text-gray-800">
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
            <RightBar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isBoardLeader={isBoardLeader}
                projectId={projectId}
                currentUser={currentUser}
            />
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default MiniNav;