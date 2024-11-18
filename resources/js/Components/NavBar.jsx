// Navbar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function Navbar({ user }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Utilisateur connecté:', user);
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/user/projects', {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    withCredentials: true,
                });

                const userProjects = Array.isArray(response.data) ? response.data : [];

                console.log('Projets de l\'utilisateur:', userProjects);

                setProjects(userProjects);
                setLoading(false);
            } catch (err) {
                console.error('Erreur lors du chargement des données:', err);
                setError('Impossible de charger les données.');
                setLoading(false);
            }
        };

        fetchProjects();
    }, [user]);

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleViewProject = (projectId) => {
        window.location.href = `/projects/${projectId}`;
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <nav className="flex items-center justify-between p-3 bg-white relative shadow-md">
            <div className="flex-1 max-w-xl mx-4 relative">
                <input
                    type="text"
                    placeholder="Rechercher un projet"
                    value={searchQuery}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    aria-label="Recherche de projet"
                />
                {searchQuery && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Chargement...</div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-500">{error}</div>
                        ) : (
                            <>
                                {filteredProjects.length > 0 ? (
                                    <div className="p-2">
                                        <h4 className="text-gray-700 font-semibold mb-2">Projets :</h4>
                                        {filteredProjects.map(project => (
                                            <div
                                                key={project.id}
                                                className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                                onClick={() => handleViewProject(project.id)}
                                            >
                                                {project.name}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-2 text-gray-500">
                                        Aucun résultat trouvé.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="flex space-x-4 items-center">
                <button className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Espaces de travail</button>
                <button className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Récent</button>
                <button className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Favoris</button>
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        // Ajoutez d'autres propriétés utilisateur si nécessaire
    }).isRequired,
};