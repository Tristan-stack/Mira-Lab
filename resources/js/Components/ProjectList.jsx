// ProjectList.jsx

import React, { useRef, useEffect, useState } from 'react';
import { FaRegEye, FaTrash } from 'react-icons/fa';
import { IoIosAdd } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function ProjectList({
    projects,
    user,
    onViewProject,
    setIsCreatingProject,
}) {
    const scrollContainerRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [projectTasks, setProjectTasks] = useState({}); // Stocke les tâches par projet

    

    useEffect(() => {
        const el = scrollContainerRef.current;
        let isDown = false;
        let startX;
        let scrollLeft;

        const mouseDownHandler = (e) => {
            isDown = true;
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        };

        const mouseLeaveHandler = () => {
            isDown = false;
        };

        const mouseUpHandler = () => {
            isDown = false;
        };

        const mouseMoveHandler = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 1.2; // Ajustez la vitesse de défilement ici
            el.scrollLeft = scrollLeft - walk;
        };

        el.addEventListener('mousedown', mouseDownHandler);
        el.addEventListener('mouseleave', mouseLeaveHandler);
        el.addEventListener('mouseup', mouseUpHandler);
        el.addEventListener('mousemove', mouseMoveHandler);

        const wheelHandler = (e) => {
            e.preventDefault();
            el.scrollLeft += e.deltaY * 0.5; // Rend le scroll plus smooth
        };

        el.addEventListener('wheel', wheelHandler);

        return () => {
            el.removeEventListener('mousedown', mouseDownHandler);
            el.removeEventListener('mouseleave', mouseLeaveHandler);
            el.removeEventListener('mouseup', mouseUpHandler);
            el.removeEventListener('mousemove', mouseMoveHandler);
            el.removeEventListener('wheel', wheelHandler);
        };
    }, []);

    // Filtrer les projets en fonction de l'utilisateur et du terme de recherche
    const filteredProjects = projects.filter(
        (project) =>
            Array.isArray(project.users) &&
            project.users.some((u) => u.id === user.id) &&
            project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fonction pour calculer la progression
    const calculateProgress = (tasks = []) => {
        if (!Array.isArray(tasks) || tasks.length === 0) return 0;

        const totalScore = tasks.reduce((acc, task) => {
            switch (task.status) {
                case 'Non commencer':
                    return acc + 0;
                case 'En cours':
                    return acc + 0.5;
                case 'Fini':
                    return acc + 1;
                default:
                    return acc + 0;
            }
        }, 0);

        const maxScore = tasks.length; // Chaque tâche contribue au maximum 1
        const progressPercentage = (totalScore / maxScore) * 100;

        return Math.round(progressPercentage);
    };

    // Récupérer les tâches pour chaque projet filtré
    useEffect(() => {
        const fetchTasksForProjects = async () => {
            const tasksMap = {};

            const projectIdsToFetch = filteredProjects
                .filter((project) => !projectTasks.hasOwnProperty(project.id)) // Récupérer seulement si non déjà fait
                .map((project) => project.id);

            if (projectIdsToFetch.length === 0) return;

            try {
                const promises = projectIdsToFetch.map((projectId) =>
                    axios.get(`/project/${projectId}/tasks`)
                );

                const responses = await Promise.all(promises);

                responses.forEach((response, index) => {
                    const projectId = projectIdsToFetch[index];
                    console.log(`Tasks for project ${projectId}:`, response.data);
                    // Extraire le tableau des tâches depuis response.data.tasks
                    tasksMap[projectId] = Array.isArray(response.data.tasks) ? response.data.tasks : [];
                });

                setProjectTasks((prevTasks) => ({ ...prevTasks, ...tasksMap }));
            } catch (error) {
                console.error('Erreur lors de la récupération des tâches:', error);
            }
        };

        fetchTasksForProjects();
    }, [filteredProjects]); // Supprimé projectTasks des dépendances

    return (
        <div className="p-4 w-full bg-white shadow rounded-lg mb-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Tableaux</h2>
                <div className="flex items-center space-x-2">
                    {/* Barre de recherche */}
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md outline-none text-blue-500 focus:border-blue-500 transition duration-150 hover:border-blue-500"
                    />
                    <button
                        className="bg-green-400 px-2 py-2 rounded-2xl hover:bg-white duration-300"
                        onClick={() => setIsCreatingProject(true)}
                    >
                        <IoIosAdd className="font-extrabold text-white hover:text-green-400 duration-300" />
                    </button>
                </div>
            </div>
            <hr className="mb-4 mt-3" />
            <motion.div
                className="flex space-x-4 overflow-x-auto custom-scrollbar cursor-grab"
                ref={scrollContainerRef}
            >
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            className="flex-shrink-0 w-64 p-4 mb-4 bg-gray-100 rounded-lg shadow-md"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <p
                                    className="text-base font-medium uppercase cursor-pointer"
                                    onClick={() => onViewProject(project.id)}
                                >
                                    {project.name}
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        className="text-sm px-2 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300"
                                        onClick={() => onViewProject(project.id)}
                                    >
                                        <FaRegEye />
                                    </button>
                                    {project.pivot?.role === 'admin' && (
                                        <button className="text-sm px-2 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-300">
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Barre de Progression */}
                            <div className="mt-2">
                                <div className="w-full bg-gray-300 rounded-full h-1">
                                    <div
                                        className={`h-full rounded-full ${
                                            calculateProgress(projectTasks[project.id] || []) === 100
                                                ? 'bg-green-500'
                                                : calculateProgress(projectTasks[project.id] || []) >= 50
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                        }`}
                                        style={{
                                            width: `${calculateProgress(projectTasks[project.id] || [])}%`,
                                        }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    Progression: {calculateProgress(projectTasks[project.id] || [])}%
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            <style>
                {`
                /* Style pour une scrollbar fine et esthétique */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e0; /* Couleur de la scrollbar */
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: #a0aec0; /* Couleur plus foncée au survol */
                }
                `}
            </style>
        </div>
    );
}