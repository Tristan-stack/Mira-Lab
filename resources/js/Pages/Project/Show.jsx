import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import Base from '../../Layouts/BaseProject';
import MiniNav from '../../Components/MiniNav';

const ShowProject = ({ project, currentUser, team, teamUsers, projectId }) => {
    const [projectUsers, setProjectUsers] = useState(project.users);

    // États pour le formulaire de tâche
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [tasks, setTasks] = useState(project.tasks);
    const [errors, setErrors] = useState({});

    // États pour la modification en ligne
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [updatedTask, setUpdatedTask] = useState({ name: '', description: '' });

    useEffect(() => {
        setProjectUsers(project.users);
    }, [project.users]);

    useEffect(() => {
        const channel = window.Echo.channel('test-channel');
        channel.listen('.test-event', (event) => {
            alert(event.message);
        });

        const Counterchannel = window.Echo.channel('counter-channel');
        Counterchannel.listen('.counter-event', (event) => {
            console.log('Counter updated:', event.counter);
            setCounter(event.counter);
        });

        const taskCreationChannel = window.Echo.private(`project.${projectId}`);
        taskCreationChannel.listen('.task.created', (event) => {
            console.log('Task created:', event.task);
            setTasks((prevTasks) => [...prevTasks, event.task]);
        });

        const taskUpdatedChannel = window.Echo.private(`project.${projectId}`);
        taskUpdatedChannel.listen('.task.updated', (event) => {
            console.log('Task updated:', event.task);
            setTasks((prevTasks) => prevTasks.map(task => task.id === event.task.id ? event.task : task));
        });

        const taskDeletedChannel = window.Echo.private(`project.${projectId}`);
        taskDeletedChannel.listen('.task.deleted', (event) => {
            console.log('Task deleted:', event.task);
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== event.task.id));
        });

        return () => {
            channel.stopListening('.test-event');
            Counterchannel.stopListening('.counter-event');
            taskCreationChannel.stopListening('.task.created');
            taskUpdatedChannel.stopListening('.task.updated');
            taskDeletedChannel.stopListening('.task.deleted');
        };
    }, [projectId]);

    const handleDeleteProject = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            Inertia.delete(`/project/${project.id}`, {
                onSuccess: () => {
                    Inertia.visit('/profile');
                }
            });
        }
    };

    const handleUpdateTask = (taskId, updatedData) => {
        axios.put(`/project/${projectId}/tasks/${taskId}`, updatedData)
            .then(response => {
                const updatedTask = response.data;
                setTasks((prevTasks) =>
                    prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
                );
                setEditingTaskId(null);
                setUpdatedTask({ name: '', description: '' });
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    };


    const handleCreateTask = (e) => {
        e.preventDefault();

        axios.post(`/project/${projectId}/tasks`, {
            name: taskName,
            description: taskDescription,
            project_id: projectId,
        })
            .then(response => {
                setTaskName('');
                setTaskDescription('');
                setErrors({});
            })
            .catch(error => {
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                }
            });
    };

    const handleDeleteTask = (taskId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            axios.delete(`/project/${projectId}/tasks/${taskId}`)
                .then(() => {
                    setTasks(tasks.filter(task => task.id !== taskId));
                })
                .catch(error => {
                    console.error('Error deleting task:', error);
                });
        }
    };

    const startEditingTask = (task) => {
        setEditingTaskId(task.id);
        setUpdatedTask({ name: task.name, description: task.description });
    };

    const handleTaskChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTask((prevTask) => ({ ...prevTask, [name]: value }));
    };

    const handleSaveTask = (taskId) => {
        handleUpdateTask(taskId, updatedTask);
    };

    const currentUserInProject = projectUsers?.find(user => user.id === currentUser.id);
    const isBoardLeader = currentUserInProject?.pivot.role === 'Board Leader';

    return (
        <Base user={currentUser} teamUsers={teamUsers} projectUsers={projectUsers} currentUser={currentUser} setProjectUsers={setProjectUsers}>
            <MiniNav project={project} currentUser={currentUser} isBoardLeader={isBoardLeader} projectId={projectId} />

            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Créer une tâche</h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Nom de la tâche"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name[0]}</div>}
                    </div>
                    <div>
                        <textarea
                            placeholder="Description de la tâche"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description[0]}</div>}
                    </div>
                    <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 duration-100">Créer Tâche</button>
                </form>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Tâches du projet</h3>
                <ul className="space-y-2">
                    {tasks.map(task =>{
                        // console.log('Task ID:', task.id)
                        return (
                            <li key={task.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                                {editingTaskId === task.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={updatedTask.name}
                                            onChange={handleTaskChange}
                                            className="block text-lg mb-2 p-2 border border-gray-300 rounded"
                                        />
                                        <textarea
                                            name="description"
                                            value={updatedTask.description}
                                            onChange={handleTaskChange}
                                            className="block text-gray-700 p-2 border border-gray-300 rounded"
                                        />
                                        <button
                                            onClick={() => handleSaveTask(task.id)}
                                            className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 duration-100"
                                        >
                                            Enregistrer
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <strong className="block text-lg">{task.name}</strong>
                                        <span className="block text-gray-700">{task.description}</span>
                                    </div>
                                )}
                                {editingTaskId !== task.id && (
                                    <button
                                        onClick={() => startEditingTask(task)}
                                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-100"
                                    >
                                        Modifier
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 duration-100 ml-2"
                                >
                                    Supprimer
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Base>
    );
};

export default ShowProject;