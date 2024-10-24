import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Base from '../../Layouts/BaseProject';
import MiniNav from '../../Components/MiniNav'; // Importer MiniNav

const ShowProject = ({ project, currentUser, team, teamUsers, projectId }) => {
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
        <Base user={currentUser} teamUsers={teamUsers} projectUsers={projectUsers} currentUser={currentUser} setProjectUsers={setProjectUsers}>
            <MiniNav project={project} currentUser={currentUser} isBoardLeader={isBoardLeader} projectId={projectId} />
            
        </Base>
    );
};

export default ShowProject;