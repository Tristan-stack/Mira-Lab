import React, { useState, useEffect } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { FaRegEye, FaTrash } from 'react-icons/fa';
import Layout from '../../Layouts/Base';
import CreateProjectForm from '../../Pages/ProjectCreate';
import TeamCreate from '../../Pages/TeamCreate';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import JoinTeamModal from '../../Components/JoinTeamPopUp'; // Assurez-vous que le chemin est correct
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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
        const associatedProjects = projectsState.filter(project => project.team_id === teamId && project.users.some(u => u.id === user.id));

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
                <div className='w-full flex justify-around items-center'>

                    <div className="p-6 bg-white shadow rounded-lg mb-6 relative">
                        <div className='w-80 h-60 bg-gray-300 rounded-lg mb-4'></div>
                        <div className="w-full space-y-2 mb-4">
                            <h3 className='font-black text-2xl'>Mon profil</h3>
                            <p className='text-gray-400 font-light text-xs text-right'>Membre depuis : {new Date(user.created_at).toLocaleDateString()}</p>
                            <p className='text-gray-400 font-light text-xs text-right'>Dernière modification : {new Date(user.updated_at).toLocaleDateString()}</p>
                        </div>
                        <div className='space-y-3'>
                            <div className='w-full flex justify-between'>
                                {isEditing ? (
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="text-purple-600 w-1/2 p-2 border-white rounded-none focus:outline-none"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-400">{formData.name}</p>
                                )}
                                <p className='text-gray-400 font-normal whitespace-nowrap'>
                                    Compte n°<span className='text-purple-800 font-bold'>{user.id}</span>
                                </p>
                            </div>
                            {isEditing ? (
                                <div className="relative w-full ">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="text-purple-600 border-white p-2 rounded-none w-full focus:outline-none"
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-400">{formData.email}</p>
                            )}
                        </div>
                        <div className='w-full flex justify-center mt-4'>
                            {isEditing ? (
                                <button onClick={handleSaveClick} className='py-1 px-4 text-white rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition duration-300'>Enregistrer</button>
                            ) : (
                                <button onClick={handleEditClick} className='py-1 px-4 text-white rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition duration-300'>Modifier</button>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col w-1/2'>
                        <div className="p-4 w-full bg-white shadow rounded-lg mb-6">
                            <div className='flex justify-between items-center'>
                                <h2 className="text-2xl font-semibold">Équipes</h2>
                                <div className='space-x-4 flex items-center'>
                                    <button
                                        className='bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 duration-300'
                                        onClick={() => setIsJoiningTeam(true)} // Ouvrir le pop-up pour rejoindre une équipe
                                    >
                                        Rejoindre une team
                                    </button>
                                    <button
                                        className='bg-green-400 px-2 py-2 rounded-2xl hover:bg-white duration-300'
                                        onClick={() => setIsCreatingTeam(!isCreatingTeam)} // Toggle du formulaire d'équipe
                                    >
                                        <IoIosAdd className='font-extrabold text-white hover:text-green-400 duration-300' />
                                    </button>
                                </div>
                            </div>
                            <hr className='mb-4 mt-3' />
                            <ul className='space-y-4'>
                                {Array.isArray(teamsState) && teamsState.map((team) => {
                                    const associatedProjects = projectsState.filter(project => project.team_id === team.id && project.users.some(u => u.id === user.id));
                                    const privateProjects = associatedProjects.filter(project => project.status === "Privé");

                                    return (
                                        <li key={team.id} className="flex justify-between items-center mb-2">
                                            <div className='mr-32'>
                                                <p className="text-base font-semibold uppercase">{team.name}</p>
                                                <p className='text-gray-500 font-light text-sm'>Rôle : {team.pivot?.role || 'N/A'}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300"
                                                    onClick={() => handleViewTeam(team.id)}
                                                >
                                                    <FaRegEye />
                                                </button>

                                                {team.pivot?.role === 'admin' ? (
                                                    <button
                                                        className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-300"
                                                        onClick={() => handleRemoveTeam(team.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-300"
                                                        onClick={() => handleWithdraw(team.id)}
                                                    >
                                                        Se retirer
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div>
                            <div className="p-4 w-full bg-white shadow rounded-lg mb-6">
                                <div className='flex justify-between items-center'>
                                    <h2 className="text-2xl font-semibold">Projets</h2>
                                    <button
                                        className='bg-green-400 px-2 py-2 rounded-2xl hover:bg-white duration-300'
                                        onClick={() => setIsCreatingProject(!isCreatingProject)} // Toggle du formulaire de projet
                                    >
                                        <IoIosAdd className='font-extrabold text-white hover:text-green-400 duration-300' />
                                    </button>
                                </div>
                                <hr className='mb-4 mt-3' />
                                <ul className='space-y-4'>
                                    {projectsState.filter(project => project.users.some(u => u.id === user.id)).map((project) => (
                                        <li key={project.id} className="flex justify-between items-center mb-2">
                                            <div className='mr-32'>
                                                <p className="text-base font-semibold uppercase">{project.name}</p>
                                                <p className='text-gray-500 font-light text-sm'>{project.status}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300"
                                                    onClick={() => handleViewProject(project.id)}
                                                >
                                                    <FaRegEye />
                                                </button>

                                                {project.pivot?.role === 'admin' && (
                                                    <button
                                                        className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-300"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                {isCreatingProject && (
                    <div className='w-full'>
                        <CreateProjectForm />
                    </div>
                )}

                {isCreatingTeam && (
                    <div className='w-full'>
                        <TeamCreate user={user} onAddTeam={handleAddTeam} users={users} />
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