import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import Base from '../../Layouts/BaseProject';
import MiniNav from '../../Components/MiniNav';

const ShowProject = ({ project, currentUser, team, teamUsers, projectId }) => {
    const [projectUsers, setProjectUsers] = useState(project.users);
    const [counter, setCounter] = useState(0);

    // États pour le formulaire de tâche
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [tasks, setTasks] = useState(project.tasks);
    const [errors, setErrors] = useState({});

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

        const taskCreationChannel = window.Echo.channel(`project.${projectId}`);
        taskCreationChannel.listen('.task.created', (event) => {
            console.log('Task created:', event.task);
            setTasks((prevTasks) => [...prevTasks, event.task]);
        });

        return () => {
            channel.stopListening('.test-event');
            Counterchannel.stopListening('.counter-event');
            taskCreationChannel.stopListening('.task.created');
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

    const handleCreateTask = (e) => {
        e.preventDefault();

        console.log('Creating task with data:', {
            name: taskName,
            description: taskDescription,
            project_id: projectId,
        });

        axios.post(`/project/${projectId}/tasks`, {
            name: taskName,
            description: taskDescription,
            project_id: projectId,
        })
            .then(response => {
                console.log('Task created successfully:', response.data);
                const newTask = response.data.task;
                setTasks([...tasks, newTask]);
                setTaskName('');
                setTaskDescription('');
                setErrors({});
            })
            .catch(error => {
                console.error('Error creating task:', error);
                if (error.response && error.response.status === 422) {
                    console.log('Validation errors:', error.response.data.errors);
                    setErrors(error.response.data.errors);
                }
            });
    };

    const handleDeleteTask = (taskId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            axios.delete(`/project/${projectId}/tasks/${taskId}`)
                .then(response => {
                    console.log('Task deleted successfully:', response.data);
                    setTasks(tasks.filter(task => task.id !== taskId));
                })
                .catch(error => {
                    console.error('Error deleting task:', error);
                });
        }
    };

    const increaseCounter = () => {
        setCounter(counter + 1);
        axios.post('/update-counter', { counter: counter + 1 })
            .then(response => {
                console.log('Counter increased:', response.data);
            })
            .catch(error => {
                console.error('Error increasing counter:', error);
            });
    };

    const decreaseCounter = () => {
        setCounter(counter - 1);
        axios.post('/update-counter', { counter: counter - 1 })
            .then(response => {
                console.log('Counter decreased:', response.data);
            })
            .catch(error => {
                console.error('Error decreasing counter:', error);
            });
    };

    const handleTriggerEvent = () => {
        axios.post('/trigger-event')
            .then(response => {
                console.log('Event triggered:', response.data);
            })
            .catch(error => {
                console.error('Error triggering event:', error);
            });
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
                    {tasks.map(task => (
                        <li key={task.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                            <div>
                                <strong className="block text-lg">{task.name}</strong>
                                <span className="block text-gray-700">{task.description}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 duration-100"
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8">
                <button onClick={handleTriggerEvent} className="p-3 bg-white rounded hover:bg-slate-300 duration-100">Trigger Test Event</button>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Compteur : {counter}</h3>
                <div className="space-x-4">
                    <button onClick={increaseCounter} className="p-3 bg-green-500 text-white rounded hover:bg-green-600 duration-100">Augmenter</button>
                    <button onClick={decreaseCounter} className="p-3 bg-red-500 text-white rounded hover:bg-red-600 duration-100">Diminuer</button>
                </div>
            </div>
        </Base>
    );
};

export default ShowProject;