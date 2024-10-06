import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import Base from '../../Layouts/Base';

const Show = ({ team, removeUserUrl, currentUser }) => {
    const handleRemoveUser = (userId) => {
        Inertia.delete(removeUserUrl, { data: { user_id: userId } });
    };

    const handleDeleteTeam = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette équipe ? Cela dissociera tous les membres.")) {
            Inertia.delete(`/teams/${team.id}`);
        }
    };

    const currentUserRoleInTeam = team?.users?.find(user => user.id === currentUser.id)?.pivot?.role;

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
                        <button className="invite-btn bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Inviter un membre dans l'espace de travail</button>
                    </div>
                </div>
            </div>

            <div className="team-members mt-6">
                {team?.users?.length > 0 ? (
                    team.users.map((user) => (
                        <div key={user.id} className="team-member-card border p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
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
                <h3 className="text-lg font-semibold">Projets de l'équipe</h3>
                {team?.projects?.length > 0 ? (
                    team.projects.map((project) => (
                        <div key={project.id} className="project-card border p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
                            <div>
                                <h4 className="text-md font-medium">{project.name}</h4>
                                <p className="text-gray-600">{project.description}</p>
                                <p className="text-gray-500">Statut : {project.status}</p>
                                <p className="text-gray-500">Dates : {project.start_date} - {project.end_date}</p>
                            </div>
                            <button
                                className="view-project-btn bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition"
                                onClick={() => Inertia.visit(`/project/${project.id}`)} // Redirection vers la vue du projet
                            >
                                Voir le projet
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Aucun projet associé à cette équipe.</p>
                )}
            </div>
        </Base>
    );
};

export default Show;
