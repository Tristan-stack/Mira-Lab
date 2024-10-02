import React from 'react';
import { Head } from '@inertiajs/react';

export default function Profile({ user, teams, projects }) {
    return (
        <>
            <Head title="Mon Profil" />
            <div className="container mx-auto">
                {/* Bloc Informations Personnelles */}
                <div className="p-6 bg-white shadow rounded-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Informations personnelles</h2>
                    <div className="flex items-center">
                        <img src={user.img_profil || '/default-avatar.png'} alt="Profile" className="w-16 h-16 rounded-full mr-4" />
                        <div>
                            <p className="text-xl font-bold">{user.name}</p>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Bloc Équipes */}
                <div className="p-6 bg-white shadow rounded-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Équipes</h2>
                    <ul>
                        {teams.map((team) => (
                            <li key={team.id} className="mb-2">
                                <p className="text-lg font-bold">{team.name}</p>
                                <p className="text-gray-500">Rôle : {team.pivot.role}</p> {/* Affichage du rôle */}
                            </li>
                        ))}
                    </ul>
                    {teams.length === 0 && <p>Aucune équipe pour le moment.</p>}
                </div>

                {/* Bloc Projets */}
                <div className="p-6 bg-white shadow rounded-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Projets</h2>
                    <ul>
                        {projects.map((project) => (
                            <li key={project.id} className="mb-2">
                                <p className="text-lg font-bold">{project.name}</p>
                                <p className="text-gray-500">Rôle : {project.pivot.role}</p> {/* Affichage du rôle */}
                            </li>
                        ))}
                    </ul>
                    {projects.length === 0 && <p>Aucun projet pour le moment.</p>}
                </div>
            </div>
        </>
    );
}
