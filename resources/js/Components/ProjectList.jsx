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
    const [projectTasks, setProjectTasks] = useState({});

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
            const walk = (x - startX) * 1.2;
            el.scrollLeft = scrollLeft - walk;
        };

        el.addEventListener('mousedown', mouseDownHandler);
        el.addEventListener('mouseleave', mouseLeaveHandler);
        el.addEventListener('mouseup', mouseUpHandler);
        el.addEventListener('mousemove', mouseMoveHandler);

        const wheelHandler = (e) => {
            e.preventDefault();
            el.scrollLeft += e.deltaY * 0.5;
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

    useEffect(() => {
        const fetchTasksForProjects = async () => {
            const tasksMap = {};

            const projectIdsToFetch = projects
                .filter((project) => !projectTasks.hasOwnProperty(project.id))
                .map((project) => project.id);

            if (projectIdsToFetch.length === 0) return;

            try {
                const promises = projectIdsToFetch.map((projectId) =>
                    axios.get(`/project/${projectId}/tasks`)
                );

                const responses = await Promise.all(promises);

                responses.forEach((response, index) => {
                    const projectId = projectIdsToFetch[index];
                    tasksMap[projectId] = Array.isArray(response.data.tasks) ? response.data.tasks : [];
                });

                setProjectTasks((prevTasks) => ({ ...prevTasks, ...tasksMap }));
            } catch (error) {
                console.error('Erreur lors de la récupération des tâches:', error);
            }
        };

        fetchTasksForProjects();
    }, [projects]);

    useEffect(() => {
        projects.forEach((project) => {
            const taskUpdatedChannel = window.Echo.private(`project.${project.id}`);
            taskUpdatedChannel.listen('.task.updated', (event) => {

                setProjectTasks((prevTasks) => ({
                    ...prevTasks,
                    [project.id]: prevTasks[project.id]?.map((task) =>
                        task.id === event.task.id ? event.task : task
                    ) || [event.task],
                }));
            });
        });

        return () => {
            projects.forEach((project) => {
                window.Echo.private(`project.${project.id}`).stopListening('.task.updated');
            });
        };
    }, [projects]);

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

        const maxScore = tasks.length;
        return Math.round((totalScore / maxScore) * 100);
    };

    const filteredProjects = projects.filter(
        (project) =>
            Array.isArray(project.users) &&
            project.users.some((u) => u.id === user.id) &&
            project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 w-full bg-white shadow rounded-lg mb-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Tableaux</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Rechercher un tableau..."
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
                            <div className="mt-2">
                                <div className="w-full bg-gray-300 rounded-full h-1">
                                    <motion.div
                                        className={`h-full rounded-full ${calculateProgress(projectTasks[project.id] || []) === 100
                                                ? 'bg-green-600'
                                                : calculateProgress(projectTasks[project.id] || []) >= 50
                                                    ? 'bg-yellow-400'
                                                    : 'bg-red-600'
                                            }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${calculateProgress(projectTasks[project.id] || [])}%` }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    ></motion.div>
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
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e0;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: #a0aec0;
                }
                .bg-green-600 {
                    box-shadow: 0 0 10px rgba(74, 222, 128, 0.7);
                }
                .bg-yellow-400 {
                    box-shadow: 0 0 10px rgba(234, 179, 8, 0.7);
                }
                .bg-red-600 {
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
                }
                `}
            </style>
        </div>
    );
}

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    onViewProject: PropTypes.func.isRequired,
    setIsCreatingProject: PropTypes.func.isRequired,
};