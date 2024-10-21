import React, { useState, useEffect } from 'react';
import { FaUser, FaEllipsisH } from 'react-icons/fa'; // Importer les icônes nécessaires
import { toast } from 'react-toastify';
import { useGradient } from '../contexts/GradientContext.jsx'; // Importer le hook useGradient
import axios from 'axios'; // Importer axios pour les requêtes API
import VisibilityDialog from './VisibilityDialog'; // Importer le composant VisibilityDialog

const MiniNav = ({ project: initialProject, currentUser, isBoardLeader }) => {
    const gradient = useGradient(); // Utiliser le hook pour obtenir le dégradé
    const [project, setProject] = useState(initialProject); // État pour gérer le projet
    const [isEditingTitle, setIsEditingTitle] = useState(false); // État pour gérer le mode d'édition du titre
    const [newTitle, setNewTitle] = useState(project.name); // État pour le nouveau titre
    const [isDialogOpen, setIsDialogOpen] = useState(false); // État pour gérer la visibilité de la boîte de dialogue

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
                // Mettre à jour le titre du projet dans l'état local
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

    const handleUserIconClick = () => {
        setIsDialogOpen(!isDialogOpen);
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
            // Mettre à jour la visibilité du projet dans l'état local
            setProject(prevProject => ({ ...prevProject, status: response.data.project.status }));
            setIsDialogOpen(false);
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du statut de visibilité du projet.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error('Erreur lors de la mise à jour du statut de visibilité du projet :', error);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center p-3 bg-gray-500/20 shadow-md">
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
                            className="text-white text-xl font-semibold ml-2 cursor-pointer"
                            onClick={handleTitleClick}
                        >
                            {newTitle}
                        </h2>
                    )}
                    <div className='p-2 rounded hover:bg-white/30 duration-200 cursor-pointer' onClick={handleUserIconClick}>
                        <FaUser className="text-white" />
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
                    <div className='p-2 rounded hover:bg-white/30 duration-200 cursor-pointer'>
                        <FaEllipsisH className="text-white cursor-pointer" />
                    </div>
                </div>
            </div>
            {isDialogOpen && (
                <VisibilityDialog
                    project={project}
                    onClose={() => setIsDialogOpen(false)}
                    onVisibilityChange={handleVisibilityChange}
                />
            )}
        </div>
    );
};

export default MiniNav;