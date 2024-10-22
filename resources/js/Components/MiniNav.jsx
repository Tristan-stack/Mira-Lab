import React, { useState, useEffect } from 'react';
import { FaLock, FaLockOpen, FaEllipsisH, FaCrown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGradient } from '../contexts/GradientContext.jsx';
import axios from 'axios';
import VisibilityDialog from './VisibilityDialog';
import RightBar from './RightBar';
import { AnimatePresence, motion } from 'framer-motion';
import Tooltip from './Tooltip';

const MiniNav = ({ project: initialProject, currentUser, isBoardLeader, projectId }) => {
    const gradient = useGradient();
    const [project, setProject] = useState(initialProject);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(project.name);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setProject(initialProject);
    }, [initialProject]);

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
                    <div className='p-2 rounded hover:bg-white/30 duration-200 cursor-pointer' onClick={handleLockIconClick}>
                        {project.status === 'Public' ? (
                            <FaLockOpen className="text-white" />
                        ) : (
                            <FaLock className="text-white" />
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-4 mr-2">
                    <div style={{ background: gradient, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>
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
                            <div className='p-2 rounded hover:bg-white/30 duration-200 cursor-pointer'>
                                <FaCrown className="text-yellow-500" />
                            </div>
                        </Tooltip>
                    )}
                    <div className='p-2 rounded hover:bg-white/30 duration-200 cursor-pointer' onClick={handleEllipsisClick}>
                        <FaEllipsisH className="text-white cursor-pointer" />
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {isDialogOpen && (
                    <VisibilityDialog
                        project={project}
                        onClose={() => setIsDialogOpen(false)}
                        onVisibilityChange={handleVisibilityChange}
                        isBoardLeader={isBoardLeader}
                    />
                )}
            </AnimatePresence>
            <RightBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isBoardLeader={isBoardLeader} projectId={projectId} currentUser={currentUser} />
        </div>
    );
};

export default MiniNav;