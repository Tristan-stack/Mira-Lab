import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Base from '../../Layouts/Base';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importer les styles de react-toastify
import JoinProjectModal from '../../Components/JoinProjectPopUp'; // Assurez-vous que le chemin est correct
import { FaLock, FaPen, FaCrown, FaArrowLeft, FaArrowRight  } from 'react-icons/fa'; // Importer l'icône de cadenas, de stylo et de couronne
import axios from 'axios'; // Importer axios
import TeamOverview from './TeamOverview';
import { motion } from 'framer-motion';

const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

const Show = ({ team, removeUserUrl, currentUser }) => {
    const [isJoiningProject, setIsJoiningProject] = useState(false); // État pour le pop-up de rejoindre un projet
    const [selectedProject, setSelectedProject] = useState(null); // État pour le projet sélectionné
    const [projects, setProjects] = useState(team.projects); // État local pour les projets
    const [searchTerm, setSearchTerm] = useState(''); // État pour la recherche
    const [isEditingTitle, setIsEditingTitle] = useState(false); // État pour l'édition du titre de l'équipe
    const [teamTitle, setTeamTitle] = useState(team.name); // État pour le titre de l'équipe

    const [currentTab, setCurrentTab] = useState(0);
    const usersPerPage = 4;
    const userChunks = chunkArray(team?.users || [], usersPerPage);

    const handleRemoveUser = (userId) => {
        Inertia.delete(removeUserUrl, { data: { user_id: userId } });
    };

    const handleDeleteTeam = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette équipe ? Cela dissociera tous les membres.")) {
            Inertia.delete(`/teams/${team.id}`);
        }
    };

    const handleCopyInviteCode = () => {
        navigator.clipboard.writeText(team.team_code)
            .then(() => {
                toast.success('Code d\'invitation copié !', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.log('Code d\'invitation copié !');
            })
            .catch(err => {
                toast.error('Erreur lors de la copie du code d\'invitation.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.error('Erreur lors de la copie du code d\'invitation :', err);
            });
    };

    const handleJoinProject = async (project) => {
        if (project.status === 'Public') {
            try {
                await axios.post('/projects/join', { project_code: project.project_code, user_id: currentUser.id });
                toast.success('Vous avez rejoint le projet avec succès.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                // Mettre à jour l'état local des projets
                setProjects(prevProjects => prevProjects.map(p => {
                    if (p.project_code === project.project_code) {
                        return {
                            ...p,
                            users: [...p.users, { ...currentUser, pivot: { role: 'Member' } }] // Assurez-vous d'ajouter le rôle
                        };
                    }
                    return p;
                }));
            } catch (error) {
                toast.error('Erreur lors de la tentative de rejoindre le projet.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.error('Erreur lors de la tentative de rejoindre le projet :', error);
            }
        } else {
            setSelectedProject(project);
            setIsJoiningProject(true);
        }
    };

    const handleJoinPrivateProject = async (projectCode) => {
        try {
            await axios.post('/projects/join', { project_code: projectCode, user_id: currentUser.id });
            toast.success('Vous avez rejoint le projet avec succès.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Mettre à jour l'état local des projets
            setProjects(prevProjects => prevProjects.map(project => {
                if (project.project_code === projectCode) {
                    return {
                        ...project,
                        users: [...project.users, { ...currentUser, pivot: { role: 'Member' } }] // Assurez-vous d'ajouter le rôle
                    };
                }
                return project;
            }));

            setIsJoiningProject(false); // Fermer le pop-up
        } catch (error) {
            if (error.response && error.response.status === 400) {
                throw new Error('Le code fourni ne correspond à aucun projet privé.');
            } else {
                throw new Error('Erreur lors de la tentative de rejoindre le projet.');
            }
        }
    };

    const handleLeaveProject = async (projectId) => {
        const project = projects.find(p => p.id === projectId);
        const boardLeaders = project.users.filter(user => user.pivot.role === 'Board Leader');

        if (boardLeaders.length <= 1 && boardLeaders.some(user => user.id === currentUser.id)) {
            toast.error('Veuiller nommer un second Board Leader afin de pouvoir quitter le projet.', {
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

            // Mettre à jour l'état local des projets
            setProjects(prevProjects => prevProjects.map(project => {
                if (project.id === projectId) {
                    return {
                        ...project,
                        users: project.users.filter(user => user.id !== currentUser.id)
                    };
                }
                return project;
            }));
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
            console.error('Erreur lors de la tentative de quitter le projet :', error);
        }
    };
    const handleDeleteProject = async (projectId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            try {
                await axios.delete(`/projects/${projectId}`);
                toast.success('Projet supprimé avec succès.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                // Mettre à jour l'état local des projets
                setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
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
                console.error('Erreur lors de la tentative de suppression du projet :', error);
            }
        }
    };

    const handleUpdateTeamTitle = async () => {
        try {
            await axios.put(`/teams/${team.id}`, { name: teamTitle });
            toast.success('Le titre de l\'équipe a été mis à jour avec succès.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsEditingTitle(false);
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du titre de l\'équipe.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error('Erreur lors de la mise à jour du titre de l\'équipe :', error);
        }
    };

    const currentUserRoleInTeam = team?.users?.find(user => user.id === currentUser.id)?.pivot?.role;

    // Filtrer les projets en fonction de la valeur de la recherche
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNextTab = () => {
        setCurrentTab((prevTab) => (prevTab + 1) % userChunks.length);
    };

    const handlePrevTab = () => {
        setCurrentTab((prevTab) => (prevTab - 1 + userChunks.length) % userChunks.length);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const projectVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <Base user={currentUser}>
            <TeamOverview
                team={team}
                currentUser={currentUser}
                handleDeleteTeam={handleDeleteTeam}
                handleCopyInviteCode={handleCopyInviteCode}
                handleRemoveUser={handleRemoveUser}
                handleUpdateTeamTitle={handleUpdateTeamTitle}
                handleJoinPrivateProject={handleJoinPrivateProject} // Aligné avec TeamOverview.jsx
            />

            {/* Affichage des projets de l'équipe */}
            <motion.div
                className="mt-8 p-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Projets de l'équipe</h3>
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border focus:border-purple-500 rounded-lg"
                    />
                </div>
                {filteredProjects?.length > 0 ? (
                    filteredProjects.map((project) => {
                        const isUserInProject = project.users.some(user => user.id === currentUser.id);
                        const currentUserInProject = project.users.find(user => user.id === currentUser.id);
                        const isBoardLeader = currentUserInProject?.pivot?.role === 'Board Leader';

                        return (
                            <motion.div
                                key={project.id}
                                className="bg-white project-card border p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center"
                                variants={projectVariants}
                                whileHover={{ scale: 1.007 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className='space-y-2 w-2/3'>
                                    <h4 className="text-md flex items-center font-semibold">
                                        {project.name}
                                        {isBoardLeader && <FaCrown className="ml-2 text-yellow-500" />}
                                    </h4>
                                    <p className="text-gray-600 ">{project.description}</p>
                                    <p className="text-gray-500">Statut : <strong>{project.status}</strong> </p>
                                    <p className="text-gray-500">Du {project.start_date} au {project.end_date}</p>
                                </div>
                                <div className='w-1/4 flex justify-end'>
                                    {project.status === 'Privé' && !isUserInProject && (
                                        <FaLock className="text-gray-400 text-xl" />
                                    )}
                                    {project.status === 'Public' && !isUserInProject && (
                                        <button
                                            className="join-project-btn bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                                            onClick={() => handleJoinProject(project)}
                                        >
                                            Rejoindre le projet
                                        </button>
                                    )}
                                    {isUserInProject && (
                                        <div className='flex justify-end items-center space-x-4'>
                                            <button
                                                className="view-project-btn bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                                                onClick={() => Inertia.visit(`/project/${project.id}`)}
                                            >
                                                Voir le projet
                                            </button>
                                            <button
                                                className="leave-project-btn bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                                                onClick={() => handleLeaveProject(project.id)}
                                            >
                                                Se retirer du projet
                                            </button>
                                            {isBoardLeader && (
                                                <button
                                                    className="delete-project-btn bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                                                    onClick={() => handleDeleteProject(project.id)}
                                                >
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <motion.p
                        className="text-center text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Aucun projet associé à cette équipe.
                    </motion.p>
                )}
            </motion.div>

            {isJoiningProject && (
                <JoinProjectModal
                    onClose={() => setIsJoiningProject(false)}
                    onJoinProject={handleJoinPrivateProject}
                    projectCode={selectedProject ? selectedProject.project_code : ''} // Passer le code du projet au modal si sélectionné
                />
            )}

            <ToastContainer />
        </Base>
    );
};

export default Show;