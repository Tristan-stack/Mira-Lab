import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Base from '../../Layouts/BaseProject';
import MiniNav from '../../Components/MiniNav'; // Importer MiniNav
import ProjectMemberModal from '../../Components/ProjectMemberModal'; // Importer ProjectMemberModal
import RightBar from '../../Components/RightBar'; // Importer RightBar

const ShowProject = ({ project, currentUser, team, teamUsers, projectId }) => {
    const [isProjectMemberModalOpen, setIsProjectMemberModalOpen] = useState(false);
    const [isRightBarOpen, setIsRightBarOpen] = useState(false); // Assurez-vous que la RightBar est fermée par défaut
    const [projectUsers, setProjectUsers] = useState(project.users);

    useEffect(() => {
        setProjectUsers(project.users);
    }, [project.users]);

    const handleDeleteProject = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            Inertia.delete(`/project/${project.id}`, {
                onSuccess: () => {
                    Inertia.visit('/profile'); // Rediriger vers la page de profil après la suppression
                }
            });
        }
    };

    // Vérifiez si l'utilisateur est dans la table pivot et quel est son rôle
    const currentUserInProject = projectUsers?.find(user => user.id === currentUser.id);
    const isBoardLeader = currentUserInProject?.pivot.role === 'Board Leader';

    //log de tout les users du projet 
    console.log('projectUsers:', projectUsers);


    return (
        <Base user={currentUser} teamUsers={teamUsers}>
            <MiniNav project={project} currentUser={currentUser} isBoardLeader={isBoardLeader} projectId={projectId} />
            <div className={`text-white project-view relative flex-1 mt-4 transition-all duration-300 ${isRightBarOpen ? 'mr-64' : ''}`}>
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
                        <button
                            onClick={() => setIsProjectMemberModalOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md"
                        >
                            Voir les membres
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal pour les membres du projet */}
            <ProjectMemberModal
                isOpen={isProjectMemberModalOpen}
                onClose={() => setIsProjectMemberModalOpen(false)}
                projectUsers={projectUsers}
                currentUser={currentUser} // Passer currentUser au modal
                setProjectUsers={setProjectUsers} // Passer la fonction de mise à jour des utilisateurs
            />

            {/* Passer les props nécessaires à la RightBar */}
            <RightBar
                isOpen={isRightBarOpen}
                onClose={() => setIsRightBarOpen(false)}
                isBoardLeader={isBoardLeader}
                projectId={projectId}
                currentUser={currentUser}
                projectUsers={projectUsers}
                onOpenProjectMemberModal={() => setIsProjectMemberModalOpen(true)}
            />
        </Base>
    );
};

export default ShowProject;