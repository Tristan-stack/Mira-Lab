import React, { useState, useEffect } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { FaRegEye, FaTrash } from 'react-icons/fa';
import Layout from '../../Layouts/Base';
import UserProfile from '../../Components/UserProfile';
import CreateProjectForm from '../../Pages/ProjectCreate';
import ProjectList from '../../Components/ProjectList';
import TeamCreate from '../../Pages/TeamCreate';
import TeamList from '../../Components/TeamList';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import JoinTeamModal from '../../Components/JoinTeamPopUp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import StatisticsChart from '../../Components/StatisticsChart';
import { Inertia } from '@inertiajs/inertia'; 

export default function Show({ user, teams, projects, users }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);
    const [isJoiningTeam, setIsJoiningTeam] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [teamsState, setTeamsState] = useState(Array.isArray(teams) ? teams : []);
    const [projectsState, setProjectsState] = useState(Array.isArray(projects) ? projects : []);

    const [showStatistics, setShowStatistics] = useState(false);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [errorMessage]);

    useEffect(() => {
        const teamChannel = window.Echo.channel('teams');

        teamChannel.listen('.team.created', (e) => {
            if (e.creatorId === user.id) {
                return;
            }
            setTeamsState((prevTeams) => {
                if (!prevTeams.some(team => team.id === e.team.id)) {
                    return [...prevTeams, e.team];
                }
                return prevTeams;
            });
        });

        teamChannel.listen('.team.deleted', (e) => {
            setTeamsState((prevTeams) => {
                return prevTeams.filter(team => team.id !== e.teamId);
            });
        });

        return () => {
            teamChannel.stopListening('.team.created');
            teamChannel.stopListening('.team.deleted');
        };
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddTeam = (newTeam) => {
        setTeamsState((prevTeams) => [...prevTeams, newTeam]);
        setIsCreatingTeam(false);
    };

    const handleAddProject = (newProject) => {
        setProjectsState((prevProjects) => [...prevProjects, newProject]);
        setIsCreatingProject(false);
        toast.success('Projet créé avec succès.');
    };

    const handleCancelTeam = () => {
        setIsCreatingTeam(false);
    };

    const handleCancelProject = () => {
        setIsCreatingProject(false);
    };

    const handleViewTeam = (teamId) => {
        Inertia.visit(`/teams/${teamId}`); 
    };

    const handleViewProject = (projectId) => {
        Inertia.visit(`/projects/${projectId}`); 
    };

    const handleRemoveTeam = async (teamId) => {
        try {
            await axios.delete(`/teams/${teamId}`);
            setTeamsState((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
            setProjectsState((prevProjects) =>
                prevProjects.filter((project) => project.team_id !== teamId)
            );
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'équipe:', error.response?.data?.message || error.message);
            setErrorMessage('Une erreur est survenue lors de la suppression de l\'équipe.');
        }
    };

    const handleWithdraw = async (teamId) => {
        const associatedProjects = projectsState.filter(project => project.team_id === teamId && Array.isArray(project.users) && project.users.some(u => u.id === user.id));

        for (const project of associatedProjects) {
            if (!project.users || !Array.isArray(project.users)) {
                continue;
            }

            const boardLeaders = project.users.filter(user => user.pivot && user.pivot.role === 'Board Leader');
            const isCurrentUserBoardLeader = boardLeaders.some(u => u.id === user.id);

            if (isCurrentUserBoardLeader && boardLeaders.length <= 1) {
                toast.error(`Vous devez ajouter un autre Board Leader au projet "${project.name}" avant de quitter l'équipe.`, {
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
        }

        try {
            const response = await axios.post(`/teams/${teamId}/withdraw`, { user_id: user.id });

            if (response.status === 200) {
                setTeamsState((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
                setProjectsState((prevProjects) => prevProjects.filter((project) => project.team_id !== teamId));
            } else {
                throw new Error('Erreur lors du retrait de l\'équipe.');
            }
        } catch (error) {
            console.error('Erreur lors du retrait de l\'équipe:', error);
            setErrorMessage('Une erreur est survenue lors du retrait de l\'équipe.');
        }
    };

    const handleJoinTeam = async (teamCode) => {
        try {
            await axios.post('/teams/join', { team_code: teamCode, user_id: user.id });
            const response = await axios.get('/teams');
            const updatedTeams = Array.isArray(response.data) ? response.data : [];
            setTeamsState(updatedTeams);
            setIsJoiningTeam(false);
            Inertia.reload(); 
        } catch (error) {
            console.error('Erreur lors de la tentative de rejoindre l\'équipe:', error);
            setErrorMessage('Une erreur est survenue lors de la tentative de rejoindre l\'équipe.');
        }
    };

    return (
        <Layout user={user}>
            <ToastContainer />
            <div className=" h-full flex flex-col justify-center items-center  z-10">
                {errorMessage && (
                    <div className="w-full text-red-500 bg-red-100 p-4 rounded-lg mb-4">
                        {errorMessage}
                    </div>
                )}

                {/* Vérifier si on est en mode création d'équipe ou de projet */}
                {isCreatingTeam ? (
                    <AnimatePresence>
                        <motion.div
                            key="create-team"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className='w-full max-w-lg'
                        >
                            <TeamCreate user={user} onAddTeam={handleAddTeam} users={users} onCancel={handleCancelTeam} />
                        </motion.div>
                    </AnimatePresence>
                ) : isCreatingProject ? (
                    <AnimatePresence>
                        <motion.div
                            key="create-project"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className='w-full max-w-lg'
                        >
                            <CreateProjectForm onCreate={handleAddProject} onCancel={handleCancelProject} />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    // Affichage normal avec le profil utilisateur et le contenu principal
                    <div className="w-full flex flex-col md:flex-row justify-around items-start space-y-10 md:space-y-0">
                        <UserProfile user={user} />

                        <div className='flex flex-col w-full md:w-1/2 '>
                            {/* Bouton pour basculer entre les statistiques et le contenu */}
                            <button
                                className="mb-4 flex items-center text-blue-500 hover:text-blue-700 transition"
                                onClick={() => setShowStatistics(!showStatistics)}
                            >
                                <span>{showStatistics ? 'Voir les équipes et projets' : 'Voir les statistiques'}</span>
                                <svg
                                    className={`w-4 h-4 ml-2 transform transition-transform ${showStatistics ? 'rotate-180' : 'rotate-0'
                                        }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <AnimatePresence mode='wait'>
                                {showStatistics ? (
                                    <motion.div
                                        key="statistics"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full"
                                    >
                                        <StatisticsChart projects={projectsState} user={user} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full space-y-8"
                                    >
                                        <TeamList
                                            teams={teamsState}
                                            user={user}
                                            onViewTeam={handleViewTeam}
                                            onRemoveTeam={handleRemoveTeam}
                                            onWithdraw={handleWithdraw}
                                            setIsJoiningTeam={setIsJoiningTeam}
                                            setIsCreatingTeam={setIsCreatingTeam}
                                        />

                                        <ProjectList
                                            projects={projectsState}
                                            user={user}
                                            onViewProject={handleViewProject}
                                            onCreateProject={handleAddProject}
                                            setIsCreatingProject={setIsCreatingProject}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {isJoiningTeam && (
                    <JoinTeamModal
                        onClose={() => setIsJoiningTeam(false)}
                        onJoinTeam={handleJoinTeam}
                    />
                )}
            </div>
        </Layout>

    );
}