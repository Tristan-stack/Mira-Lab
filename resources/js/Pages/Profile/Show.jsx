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
import JoinTeamModal from '../../Components/JoinTeamPopUp'; // Assurez-vous que le chemin est correct
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function Show({ user, teams, projects, users }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    console.log({ user, teams, projects, users });

    const [isCreatingProject, setIsCreatingProject] = useState(false); // État pour le formulaire de projet
    const [isCreatingTeam, setIsCreatingTeam] = useState(false); // État pour le formulaire d'équipe
    const [isJoiningTeam, setIsJoiningTeam] = useState(false); // État pour le pop-up de rejoindre une équipe
    const [errorMessage, setErrorMessage] = useState(''); // État pour les messages d'erreur
    const [teamsState, setTeamsState] = useState(Array.isArray(teams) ? teams : []); // Initialiser avec un tableau vide si teams n'est pas un tableau
    const [projectsState, setProjectsState] = useState(Array.isArray(projects) ? projects : []); // Initialiser avec un tableau vide si projects n'est pas un tableau

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
        setIsCreatingTeam(false); // Masquer le formulaire de création d'équipe après la création
    };

    const handleAddProject = (newProject) => {
        setProjectsState((prevProjects) => [...prevProjects, newProject]);
        setIsCreatingProject(false);
        toast.success('Projet créé avec succès.')
    };

    const handleCancelTeam = () => {
        setIsCreatingTeam(false); // Masquer le formulaire de création d'équipe
    };

    const handleCancelProject = () => {
        setIsCreatingProject(false); // Masquer le formulaire de création de projet
    };

    const handleViewTeam = (teamId) => {
        window.location.href = `/teams/${teamId}`;
    };

    const handleViewProject = (projectId) => {
        window.location.href = `/projects/${projectId}`; // Redirige vers la page du projet
    };

    const handleRemoveTeam = async (teamId) => {
        try {
            // Suppression de l'équipe via l'API
            await axios.delete(`/teams/${teamId}`);

            // Mise à jour de l'état des équipes
            setTeamsState((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
            console.log('Équipe supprimée avec succès.');

            // Suppression des projets associés à l'équipe
            setProjectsState((prevProjects) =>
                prevProjects.filter((project) => project.team_id !== teamId)
            );

            console.log('Équipe et projets associés supprimés avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'équipe:', error.response?.data?.message || error.message);
            setErrorMessage('Une erreur est survenue lors de la suppression de l\'équipe.'); // Gestion d'erreur
        }
    };

    const handleWithdraw = async (teamId) => {
        const associatedProjects = projectsState.filter(project => project.team_id === teamId && Array.isArray(project.users) && project.users.some(u => u.id === user.id));

        console.log('Projets associés à l\'équipe:', associatedProjects);

        // Vérification des projets pour s'assurer qu'il reste au moins un autre "Board Leader"
        for (const project of associatedProjects) {
            if (!project.users || !Array.isArray(project.users)) {
                console.error(`Le projet "${project.name}" n'a pas de propriété 'users' ou 'users' n'est pas un tableau.`);
                continue; // Passer au projet suivant
            }

            console.log(`Utilisateurs du projet "${project.name}":`, project.users);

            const boardLeaders = project.users.filter(user => user.pivot && user.pivot.role === 'Board Leader');
            const isCurrentUserBoardLeader = boardLeaders.some(u => u.id === user.id);

            if (isCurrentUserBoardLeader && boardLeaders.length <= 1) {
                console.error(`Vous êtes le seul Board Leader du projet "${project.name}".`);
                console.log('Affichage du toast');
                toast.error(`Vous devez ajouter un autre Board Leader au projet "${project.name}" avant de quitter l'équipe.`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return; // Empêche l'utilisateur de quitter l'équipe
            }
        }

        try {
            // API pour retirer l'utilisateur de l'équipe
            const response = await axios.post(`/teams/${teamId}/withdraw`, { user_id: user.id });

            if (response.status === 200) {
                // Mise à jour de l'état des équipes en retirant l'équipe concernée
                setTeamsState((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
                // Mise à jour de l'état des projets en retirant les projets associés à l'équipe
                setProjectsState((prevProjects) => prevProjects.filter((project) => project.team_id !== teamId));
                console.log('Vous vous êtes retiré de l\'équipe et les projets associés ont été mis à jour.');
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
            // API pour rejoindre l'équipe avec le code
            await axios.post('/teams/join', { team_code: teamCode, user_id: user.id });

            // Mise à jour de l'état des équipes après avoir rejoint l'équipe
            const response = await axios.get('/teams');
            const updatedTeams = Array.isArray(response.data) ? response.data : [];
            setTeamsState(updatedTeams);

            console.log('Vous avez rejoint l\'équipe avec succès.');
            setIsJoiningTeam(false);
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la tentative de rejoindre l\'équipe:', error);
            setErrorMessage('Une erreur est survenue lors de la tentative de rejoindre l\'équipe.');
        }
    };

    return (
        <Layout user={user}>
            <Head title="Mon Profil" />
            <ToastContainer />
            <div className="flex flex-col justify-center items-center mx-auto p-6 space-x-10">
                {errorMessage && (
                    <div className="w-full text-red-500 bg-red-100 p-4 rounded-lg mb-4">
                        {errorMessage}
                    </div>
                )}
                <AnimatePresence>
                    {!isCreatingTeam && !isCreatingProject ? (
                        <div className='w-full flex justify-around items-center '>
                            <UserProfile user={user} />

                            <div className='flex flex-col w-1/2'>

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

                            </div>
                        </div>
                    ) : isCreatingTeam ? (
                        <div
                            className='w-full'
                        >
                            <TeamCreate user={user} onAddTeam={handleAddTeam} users={users} onCancel={handleCancelTeam} />
                        </div>
                    ) : (
                        <div
                            className='w-full'
                        >
                            <CreateProjectForm onCreate={handleAddProject} onCancel={handleCancelProject} />
                        </div>
                    )}
                </AnimatePresence>

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