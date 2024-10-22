import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import Base from '../../Layouts/BaseProject';

import TeamMembersModal from '../../Components/TeamMemberModal'; // Assurez-vous que le chemin est correct
import MiniNav from '../../Components/MiniNav'; // Importer MiniNav

const ShowProject = ({ project, currentUser, team, teamUsers, projectId }) => {
    const handleDeleteProject = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            Inertia.delete(`/project/${project.id}`, {
                onSuccess: () => {
                    Inertia.visit('/profile'); // Rediriger vers la page de profil après la suppression
                }
            });
        }
    };

    console.log("Project:", project);
    console.log("Current User:", currentUser);
    console.log("Team:", team);
    console.log("Team Users:", teamUsers);

    project.users.forEach(user => {
        console.log(`User ID: ${user.id}, Role: ${user.pivot.role}`);
    });

    // Vérifiez si l'utilisateur est dans la table pivot et quel est son rôle
    const currentUserInProject = project.users?.find(user => user.id === currentUser.id);
    const isBoardLeader = currentUserInProject?.pivot.role === 'Board Leader';

    console.log("isBoardLeader:", isBoardLeader);

    return (
        <Base user={currentUser} teamUsers={teamUsers}>
            <MiniNav project={project} currentUser={currentUser} isBoardLeader={isBoardLeader} projectId={projectId} />
            <div className="text-white project-view relative flex-1 mt-4">
                <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl font-semibold">{project.name}</h2>

                    <p>Appartient à la team : {team.name}</p>
                    <p className="">{project.description}</p>
                    <p className="">Statut : {project.status}</p>
                    <p className="">Dates : {project.start_date} - {project.end_date}</p>

                    <div className="project-actions space-x-2 mt-4">
                        <button
                            className="back-btn bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                            onClick={() => Inertia.visit('/profile')} // Retourner à la page de profil
                        >
                            Retour
                        </button>
                        {isBoardLeader && (
                            <button
                                onClick={handleDeleteProject}
                                className="px-4 py-2 bg-red-600 text-white rounded-md"
                            >
                                Supprimer le projet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Base>
    );
};

export default ShowProject;