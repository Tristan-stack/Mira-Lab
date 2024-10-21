import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Base from '../../Layouts/Base';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importer les styles de react-toastify
import JoinProjectModal from '../../Components/JoinProjectPopUp'; // Assurez-vous que le chemin est correct
import { FaLock } from 'react-icons/fa'; // Importer l'icône de cadenas
import axios from 'axios'; // Importer axios

const Show = ({ team, removeUserUrl, currentUser }) => {
    const [isJoiningProject, setIsJoiningProject] = useState(false); // État pour le pop-up de rejoindre un projet
    const [selectedProject, setSelectedProject] = useState(null); // État pour le projet sélectionné
    const [projects, setProjects] = useState(team.projects); // État local pour les projets
    const [searchTerm, setSearchTerm] = useState(''); // État pour la recherche

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

    const handleJoinProject = async (projectCode) => {
        try {
            await axios.post('/projects/join', { project_code: projectCode, user_id: currentUser.id });
            toast.success('Vous avez rejoint le projet privé avec succès.', {
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
                        users: [...project.users, currentUser]
                    };
                }
                return project;
            }));

            setIsJoiningProject(false); // Fermer le pop-up
        } catch (error) {
            toast.error('Erreur lors de la tentative de rejoindre le projet privé.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error('Erreur lors de la tentative de rejoindre le projet privé :', error);
        }
    };

    const currentUserRoleInTeam = team?.users?.find(user => user.id === currentUser.id)?.pivot?.role;

    // Filtrer les projets en fonction de la valeur de la recherche
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Base user={currentUser}>
            <div className="team-view">
                <div className="flex flex-col items-center space-y-4">
                    <div className='flex items-center'>
                        <div className="team-icon" style={{ background: 'linear-gradient(to right, #6a11cb, #2575fc)', width: '50px', height: '50px', borderRadius: '8px', marginRight: '16px' }}></div>
                        <h2 className="text-xl font-semibold">{team?.name}</h2>
                    </div>
                    <h3 className="text-lg text-gray-600">Votre espace membre !</h3>
                    <p className="text-gray-500 text-center">
                        Les membres d'espaces de travail peuvent consulter et rejoindre tous les tableaux visibles par les membres d'un espace de travail et peuvent créer de nouveaux tableaux au sein de l'espace de travail.
                    </p>
                    <div className='space-x-2'>
                        {currentUserRoleInTeam === 'admin' && (
                            <button
                                className="delete-team-btn bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition mt-4"
                                onClick={handleDeleteTeam}
                            >
                                Supprimer l'équipe
                            </button>
                        )}
                        <button className="invite-btn bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition" onClick={handleCopyInviteCode}>Copier le code d'invitation</button>
                        <button className='invite-btn bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition' onClick={() => {
                            setSelectedProject(null); // Réinitialiser le projet sélectionné
                            setIsJoiningProject(true);
                        }}>Rejoindre un projet privé</button>
                    </div>
                </div>
            </div>

            <div className="team-members mt-6">
                {team?.users?.length > 0 ? (
                    team.users.map((user) => (
                        <div key={user.id} className="bg-white team-member-card border p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
                            <div className="member-info">
                                <h4 className="text-lg font-medium">{user.name}</h4>
                                <p className="text-gray-600">{user.pivot.role}</p>
                                <p className="text-gray-500">Dernière activité : {user.created_at}</p>
                            </div>
                            {currentUserRoleInTeam === 'admin' && user.pivot.role !== 'admin' && (
                                <button className="remove-btn bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition" onClick={() => handleRemoveUser(user.id)}>Retirer</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Aucun membre dans l'équipe pour le moment.</p>
                )}
            </div>

            {/* Affichage des projets de l'équipe */}
            <div className="team-projects mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Projets de l'équipe</h3>
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-lg"
                    />
                </div>
                {filteredProjects?.length > 0 ? (
                    filteredProjects.map((project) => {
                        const isUserInProject = project.users.some(user => user.id === currentUser.id);
                        return (
                            <div key={project.id} className="bg-white project-card border p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
                                <div>
                                    <h4 className="text-md font-medium">{project.name}</h4>
                                    <p className="text-gray-600">{project.description}</p>
                                    <p className="text-gray-500">Statut : {project.status}</p>
                                    <p className="text-gray-500">Dates : {project.start_date} - {project.end_date}</p>
                                </div>
                                <div className='space-x-2'>
                                    {project.status === 'Privé' && !isUserInProject && (
                                        <>
                                            <FaLock className="text-gray-500" />
                                            <button
                                                className="join-project-btn bg-green-600 text-white py-1 px-2 rounded hover:bg-green-700 transition"
                                                onClick={() => {
                                                    setSelectedProject(project);
                                                    setIsJoiningProject(true);
                                                }}
                                            >
                                                Rejoindre le projet
                                            </button>
                                        </>
                                    )}
                                    {isUserInProject && (
                                        <button
                                            className="view-project-btn bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition"
                                            onClick={() => Inertia.visit(`/project/${project.id}`)} // Redirection vers la vue du projet
                                        >
                                            Voir le projet
                                        </button>
                                    )}
                                    {/* Bouton pour supprimer un projet */}
                                    {currentUserRoleInTeam === 'admin' && (
                                        <button
                                            className="delete-project-btn bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition"
                                            onClick={() => Inertia.delete(`/projects/${project.id}`)}
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Aucun projet associé à cette équipe.</p>
                )}
            </div>

            {isJoiningProject && (
                <JoinProjectModal
                    onClose={() => setIsJoiningProject(false)}
                    onJoinProject={handleJoinProject}
                    projectCode={selectedProject ? selectedProject.project_code : ''} // Passer le code du projet au modal si sélectionné
                />
            )}

            <ToastContainer />
        </Base>
    );
};

export default Show;