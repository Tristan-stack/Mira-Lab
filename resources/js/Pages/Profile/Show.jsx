import React, { useState, useEffect } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { FaRegEye, FaTrash } from 'react-icons/fa';
import Layout from '../../Layouts/Base';
import CreateProjectForm from '../../Pages/ProjectCreate';
import TeamCreate from '../../Pages/TeamCreate';
import { ToastContainer, toast } from 'react-toastify'; // Importer ToastContainer et toast
import 'react-toastify/dist/ReactToastify.css';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Show({ user, teams, projects }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const [isCreatingProject, setIsCreatingProject] = useState(false); // État pour le formulaire de projet
    const [isCreatingTeam, setIsCreatingTeam] = useState(false); // État pour le formulaire d'équipe
    const [errorMessage, setErrorMessage] = useState('');
    const [teamsState, setTeamsState] = useState(teams);

    // useEffect(() => {
    //     // Vérifiez si le toast doit être affiché après le rechargement
    //     const successMessage = localStorage.getItem('teamCreated');
    //     if (successMessage) {
    //         toast.success('Équipe créée avec succès.');
    //         localStorage.removeItem('teamCreated'); // Supprimez l'état du stockage local
    //     }
    // }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Logique pour sauvegarder les informations
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddTeam = (newTeam) => {
        setTeamsState((prevTeams) => [...prevTeams, newTeam]);
        // localStorage.setItem('teamCreated', 'true');
    };

    const handleViewTeam = (teamId) => {
        window.location.href = `/teams/${teamId}`;
    };

    const handleViewProject = (projectId) => {
        window.location.href = `/projects/${projectId}`; // Redirige vers la page du projet
    };

    const handleEditTeam = (teamId) => {
        // Implémentez la logique pour modifier l'équipe en fonction de son ID
        console.log(`Modifier l'équipe ${teamId}`);
    };

    const handleRemoveTeam = async (teamId) => {
        try {
            await axios.delete(`/teams/${teamId}`);
            setTeamsState((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
            console.log('Équipe supprimée avec succès.');

            // Afficher le toast pour la suppression d'équipe par un admin
            toast.success('Équipe supprimée avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'équipe:', error.response?.data?.message || error.message);
            setErrorMessage('Une erreur est survenue lors de la suppression de l\'équipe.'); // Gestion d'erreur
        }
    };


    const handleWithdraw = async (teamId) => {
        try {
            const response = await axios.post(`/teams/${teamId}/withdraw`, {
                user_id: user.id,
            });
            if (response.status === 200) {
                console.log('Vous vous êtes retiré de l\'équipe avec succès.');
                setTeamsState((prevTeams) => prevTeams.filter((team) => team.id !== teamId));

                // Afficher le toast pour le retrait d'équipe par un membre
                toast.info('Vous vous êtes retiré de l\'équipe.');
            }
        } catch (error) {
            setErrorMessage('Une erreur est survenue lors du retrait de l\'équipe.');
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
                <div className='w-full flex justify-around'>

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

                    <div className='flex flex-col'>
                        <div className="p-4 w-full bg-white shadow rounded-lg mb-6">
                            <div className='flex justify-between items-center'>
                                <h2 className="text-2xl font-semibold">Équipes</h2>
                                <button
                                    className='bg-green-400 px-2 py-2 rounded-2xl hover:bg-white duration-300'
                                    onClick={() => setIsCreatingTeam(!isCreatingTeam)} // Toggle du formulaire d'équipe
                                >
                                    <IoIosAdd className='font-extrabold text-white hover:text-green-400 duration-300' />
                                </button>
                            </div>
                            <hr className='mb-4 mt-3' />
                            <ul className='space-y-4'>
                                {teamsState.map((team) => (
                                    <li key={team.id} className="flex justify-between items-center mb-2">
                                        <div className='mr-32'>
                                            <p className="text-base font-semibold uppercase">{team.name}</p>
                                            <p className='text-gray-500 font-light text-sm'>Rôle : {team.pivot.role}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300"
                                                onClick={() => handleViewTeam(team.id)}
                                            >
                                                <FaRegEye />
                                            </button>

                                            {team.pivot.role === 'admin' ? (
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
                                ))}
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
                                    {projects.map((project) => (
                                        <li key={project.id} className="flex justify-between items-center mb-2">
                                            <div className='mr-32'>
                                                <p className="text-base font-semibold uppercase">{project.name}</p>
                                                <p className='text-gray-500 font-light text-sm'>Description : {project.description}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300"
                                                    onClick={() => handleViewProject(project.id)}
                                                >
                                                    <FaRegEye />
                                                </button>

                                                {project.pivot.role === 'admin' && (
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
                        <TeamCreate onAddTeam={handleAddTeam} />
                    </div>
                )}
            </div>
        </Layout>
    );
}
