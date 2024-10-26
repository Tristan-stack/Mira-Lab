import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Base from '../../Layouts/BaseProject';
import MiniNav from '../../Components/MiniNav';
import CreateTaskForm from '../../Components/CreateTaskForm';
import CreateListForm from '../../Components/CreateListForm';
import TaskList from '../../Components/TaskList';

const ShowProject = ({ project, currentUser, team, teamUsers, projectId }) => {
    const [projectUsers, setProjectUsers] = useState(project.users);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // États pour le formulaire de tâche
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [tasks, setTasks] = useState(project.tasks);
    const [lists, setLists] = useState([]);
    const [errors, setErrors] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isListFormVisible, setIsListFormVisible] = useState(false);

    // États pour la modification en ligne
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [updatedTask, setUpdatedTask] = useState({ name: '', description: '' });

    useEffect(() => {
        setProjectUsers(project.users);
    }, [project.users]);

    useEffect(() => {
        const taskCreationChannel = window.Echo.private(`project.${projectId}`);
        taskCreationChannel.listen('.task.created', (event) => {
            console.log('Task created:', event.task);
            setTasks((prevTasks) => [...prevTasks, event.task]);
        });

        const listCreationChannel = window.Echo.private(`project.${projectId}`);
        listCreationChannel.listen('.list.created', (event) => {
            console.log('List created:', event.list);
            setLists((prevLists) => [...prevLists, event.list]);
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

        const listDeletedChannel = window.Echo.private(`project.${projectId}`);
        listDeletedChannel.listen('.list.deleted', (event) => {
            console.log('List deleted:', event.list);
            setLists((prevLists) => prevLists.filter(list => list.id !== event.list.id));
        });

        const presenceChannel = window.Echo.join(`project.${projectId}`)
            .here((users) => {
                setOnlineUsers(users);
            })
            .joining((user) => {
                setOnlineUsers((prevUsers) => [...prevUsers, user]);
            })
            .leaving((user) => {
                setOnlineUsers((prevUsers) => prevUsers.filter(u => u.id !== user.id));
            });

        return () => {
            taskCreationChannel.stopListening('.task.created');
            listCreationChannel.stopListening('.list.created');
            taskUpdatedChannel.stopListening('.task.updated');
            taskDeletedChannel.stopListening('.task.deleted');
            listDeletedChannel.stopListening('.list.deleted');
            presenceChannel.leave();
        };
    }, [projectId]);

    useEffect(() => {
        // Charger les listes du projet lors du montage du composant
        axios.get(`/project/${projectId}/lists`)
            .then(response => {
                setLists(response.data.lists);
            })
            .catch(error => {
                console.error('Error loading lists:', error);
            });
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

    const handleListCreated = (newList) => {
        setLists((prevLists) => {
            // Vérifiez si la liste existe déjà pour éviter les doublons
            if (!prevLists.some(list => list.id === newList.id)) {
                return [...prevLists, newList];
            }
            return prevLists;
        });
    };

    const handleDeleteList = (listId) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette liste ?")) {
            axios.delete(`/project/${projectId}/lists/${listId}`)
                .then(() => {
                    setLists(lists.filter(list => list.id !== listId));
                })
                .catch(error => {
                    console.error('Error deleting list:', error);
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

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const toggleListFormVisibility = () => setIsListFormVisible(!isListFormVisible);

    const currentUserInProject = projectUsers?.find(user => user.id === currentUser.id);
    const isBoardLeader = currentUserInProject?.pivot.role === 'Board Leader';

    return (
        <Base user={currentUser} teamUsers={teamUsers} projectUsers={projectUsers} currentUser={currentUser} setProjectUsers={setProjectUsers}>
            <MiniNav project={project} currentUser={currentUser} isBoardLeader={isBoardLeader} projectId={projectId} onlineUsers={onlineUsers} />
            <button
                onClick={toggleFormVisibility}
                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-100"
            >
                {isFormVisible ? 'Annuler' : 'Ajouter une tâche'}
            </button>

            <button onClick={toggleListFormVisibility} className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 duration-100">
                {isListFormVisible ? 'Annuler' : 'Ajouter une liste'}
            </button>

            <AnimatePresence>
                {isFormVisible && (
                    <div className="p-6 bg-gray-100 rounded-lg shadow-md w-1/2 mx-auto">
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4"
                        >
                            <CreateTaskForm projectId={projectId} onTaskCreated={handleCreateTask} setErrors={setErrors} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isListFormVisible && (
                    <div className="p-6 bg-gray-100 rounded-lg shadow-md w-1/2 mx-auto">
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4"
                        >
                            <CreateListForm projectId={projectId} onListCreated={handleListCreated} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Listes</h2>
                {lists.length > 0 ? (
                    <ul>
                        {lists.map((list) => (
                            <li key={list.id} className="mb-2 mx-auto w-1/2 p-2 border bg-white rounded flex justify-between items-center">
                                <span>{list.name} - {list.status}</span>
                                <button
                                    onClick={() => handleDeleteList(list.id)}
                                    className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 duration-100"
                                >
                                    Supprimer
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune liste disponible.</p>
                )}
            </div>

            <TaskList
                tasks={tasks}
                editingTaskId={editingTaskId}
                updatedTask={updatedTask}
                startEditingTask={startEditingTask}
                handleTaskChange={handleTaskChange}
                handleSaveTask={handleSaveTask}
                handleDeleteTask={handleDeleteTask}
            />
        </Base>
    );
};

export default ShowProject;