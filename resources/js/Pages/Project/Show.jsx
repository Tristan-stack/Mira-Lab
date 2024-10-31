import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import Base from '../../Layouts/BaseProject';
import MiniNav from '../../Components/MiniNav';
import ListDisplay from '../../Components/ListDisplay';
import ModelSelection from '../../Components/ModelSelection';

const ShowProject = ({ project, currentUser, team, teamUsers, projectId }) => {
    const [projectUsers, setProjectUsers] = useState(project.users);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [tasks, setTasks] = useState(project.tasks);
    const [lists, setLists] = useState([]);
    const [errors, setErrors] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [availableTasks, setAvailableTasks] = useState([]); // Nouvel état pour les tâches disponibles

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [updatedTask, setUpdatedTask] = useState({ name: '', description: '' });
    const [editingListId, setEditingListId] = useState(null);
    const [updatedListName, setUpdatedListName] = useState('');

    useEffect(() => {
        setProjectUsers(project.users);
    }, [project.users]);

    useEffect(() => {
        const taskCreationChannel = window.Echo.private(`project.${projectId}`);
        taskCreationChannel.listen('.task.created', (event) => {
            setTasks((prevTasks) => {
                if (!prevTasks.some(task => task.id === event.task.id)) {
                    return [...prevTasks, event.task];
                }
                return prevTasks;
            });
        });

        const listCreationChannel = window.Echo.private(`project.${projectId}`);
        listCreationChannel.listen('.list.created', (event) => {
            setLists((prevLists) => {
                if (!prevLists.some(list => list.id === event.list.id)) {
                    return [...prevLists, event.list];
                }
                return prevLists;
            });
        });

        const taskUpdatedChannel = window.Echo.private(`project.${projectId}`);
        taskUpdatedChannel.listen('.task.updated', (event) => {
            setTasks((prevTasks) => prevTasks.map(task => task.id === event.task.id ? event.task : task));
        });

        const listUpdatedChannel = window.Echo.private(`project.${projectId}`);
        listUpdatedChannel.listen('.list.updated', (event) => {
            setLists((prevLists) => prevLists.map(list => list.id === event.list.id ? event.list : list));
        });

        const taskDeletedChannel = window.Echo.private(`project.${projectId}`);
        taskDeletedChannel.listen('.task.deleted', (event) => {
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== event.task.id));
        });

        const listDeletedChannel = window.Echo.private(`project.${projectId}`);
        listDeletedChannel.listen('.list.deleted', (event) => {
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
            listUpdatedChannel.stopListening('.list.updated');
            taskDeletedChannel.stopListening('.task.deleted');
            listDeletedChannel.stopListening('.list.deleted');
            presenceChannel.leave();
        };
    }, [projectId]);

    useEffect(() => {
        axios.get(`/project/${projectId}/lists`)
            .then(response => {
                setLists(response.data.lists);
            })
            .catch(error => {
                console.error('Error loading lists:', error);
            });
    }, [projectId]);

    useEffect(() => {
        axios.get(`/project/${projectId}/tasks`)
            .then(response => {
                console.log("Tâches récupérées :", response.data.tasks); // Ajoutez ce log pour vérifier la réponse
                setAvailableTasks(response.data.tasks);
            })
            .catch(error => {
                console.error('Error loading tasks:', error);
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

    const handleUpdateList = (listId) => {
        axios.put(`/project/${projectId}/lists/${listId}`, { name: updatedListName })
            .then(response => {
                const updatedList = response.data.list;
                setLists(prevLists => prevLists.map(list => list.id === updatedList.id ? updatedList : list));
                setEditingListId(null);
                setUpdatedListName('');
            })
            .catch(error => {
                console.error('Error updating list:', error);
            });
    };

    const handleCreateTask = (listId, name, description) => {
        axios.post(`/project/${projectId}/tasks`, {
            name,
            description,
            project_id: projectId,
            lists_id: listId,
        })
            .then(response => {
                const newTask = response.data.task;
                setTasks((prevTasks) => {
                    if (!prevTasks.some(task => task.id === newTask.id)) {
                        return [...prevTasks, newTask];
                    }
                    return prevTasks;
                });
            })
            .catch(error => {
                console.error('Error creating task:', error);
            });
    };

    const handleDeleteTask = (taskId) => {
        axios.delete(`/project/${projectId}/tasks/${taskId}`)
            .then(() => {
                setTasks(tasks.filter(task => task.id !== taskId));
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    };

    const handleCreateList = (name) => {
        axios.post(`/project/${projectId}/lists`, {
            name,
            status: 'en cours',
            project_id: projectId,
        })
            .then(response => {
                const newList = response.data.list;
                setLists((prevLists) => {
                    if (!prevLists.some(list => list.id === newList.id)) {
                        return [...prevLists, newList];
                    }
                    return prevLists;
                });
            })
            .catch(error => {
                console.error('Error creating list:', error);
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

    const startEditingList = (list) => {
        setEditingListId(list.id);
        setUpdatedListName(list.name);
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

    const currentUserInProject = projectUsers?.find(user => user.id === currentUser.id);
    const isBoardLeader = currentUserInProject?.pivot.role === 'Board Leader';

    const handleSelectModel = (model) => {
        const todoLists = ['A faire', 'En cours', 'Fini', 'Abandonné'];
        const agileLists = ['Fait', 'Sprint en cours', 'En attentes', 'A venir', 'Validé', 'Terminé'];

        const listsToCreate = model === 'todo' ? todoLists : agileLists;

        listsToCreate.forEach(name => handleCreateList(name));
    };

    // afficher la list des taches
    console.log("taches disponible", availableTasks)

    return (
        <Base user={currentUser} teamUsers={teamUsers} projectUsers={projectUsers} currentUser={currentUser} setProjectUsers={setProjectUsers}>
            <MiniNav project={project} currentUser={currentUser} isBoardLeader={isBoardLeader} projectId={projectId} onlineUsers={onlineUsers} />

            <div className="space-x-3 flex justify-start items-start mt-4">
                {lists.length > 0 ? (
                    <>
                        <ListDisplay
                            lists={lists}
                            tasks={tasks}
                            setTasks={setTasks}
                            projectId={projectId}
                            editingListId={editingListId}
                            updatedListName={updatedListName}
                            startEditingList={startEditingList}
                            handleUpdateList={handleUpdateList}
                            setEditingListId={setEditingListId}
                            setUpdatedListName={setUpdatedListName}
                            handleDeleteList={handleDeleteList}
                            handleCreateTask={handleCreateTask}
                            startEditingTask={startEditingTask}
                            editingTaskId={editingTaskId}
                            updatedTask={updatedTask}
                            handleTaskChange={handleTaskChange}
                            handleSaveTask={handleSaveTask}
                            handleDeleteTask={handleDeleteTask}
                            setEditingTaskId={setEditingTaskId}
                            availableTasks={availableTasks} // Passer les tâches disponibles
                        />
                        <button onClick={() => handleCreateList(`liste${lists.length + 1}`)} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 duration-300">
                            Ajouter une liste
                        </button>
                    </>
                ) : (
                    <ModelSelection onSelectModel={handleSelectModel} />
                )}
            </div>
        </Base>
    );
};

export default ShowProject;