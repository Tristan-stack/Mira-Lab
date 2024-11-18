import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import Base from '../../Layouts/BaseProject';
import MiniNav from '../../Components/MiniNav';
import ListDisplay from '../../Components/ListDisplay';
import ModelSelection from '../../Components/ModelSelection';
import ChatWindow from '../../Components/ChatWindow';
import { FiMessageCircle } from 'react-icons/fi';
import ConfirmationModal from '../../Components/ConfirmationModal'; 


const ShowProject = ({ project, currentUser, team, teamUsers, projectId }) => {
    const [projectUsers, setProjectUsers] = useState(project.users);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [tasks, setTasks] = useState(project.tasks);
    const [lists, setLists] = useState([]);
    const [errors, setErrors] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [availableTasks, setAvailableTasks] = useState([]); 
    const [isChatOpen, setIsChatOpen] = useState(false); 

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [updatedTask, setUpdatedTask] = useState({ name: '', description: '' });
    const [editingListId, setEditingListId] = useState(null);
    const [updatedListName, setUpdatedListName] = useState('');

    const [isListDeleteModalOpen, setIsListDeleteModalOpen] = useState(false);
    const [listToDelete, setListToDelete] = useState(null);

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

            
            setAvailableTasks((prevAvailableTasks) => {
                if (!prevAvailableTasks.some(task => task.id === event.task.id)) {
                    return [...prevAvailableTasks, event.task];
                }
                return prevAvailableTasks;
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
            console.log('Événement .task.updated reçu:', event);
            setTasks((prevTasks) =>
                prevTasks.map(task => task.id === event.task.id ? event.task : task)
            );

        
            setAvailableTasks((prevAvailableTasks) => {
                const index = prevAvailableTasks.findIndex(t => t.id === event.task.id);
                if (index !== -1) {
                    const updatedAvailableTasks = [...prevAvailableTasks];
                    updatedAvailableTasks[index] = event.task;
                    console.log('availableTasks mis à jour avec la tâche:', event.task);
                    return updatedAvailableTasks;
                }
                console.log('Ajout de la tâche mise à jour à availableTasks:', event.task);
                return [...prevAvailableTasks, event.task];
            });
        });

        const listUpdatedChannel = window.Echo.private(`project.${projectId}`);
        listUpdatedChannel.listen('.list.updated', (event) => {
            setLists((prevLists) =>
                prevLists.map(list => list.id === event.list.id ? event.list : list)
            );
        });

        const taskDeletedChannel = window.Echo.private(`project.${projectId}`);
        taskDeletedChannel.listen('.task.deleted', (event) => {
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== event.task.id));
            setAvailableTasks((prevAvailableTasks) => prevAvailableTasks.filter(task => task.id !== event.task.id));
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
                console.log("Tâches récupérées :", response.data.tasks);
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
        axios.put(`/projects/${projectId}/tasks/${taskId}`, updatedData)
            .then(response => {
                const updatedTask = response.data;
                setTasks((prevTasks) =>
                    prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
                );
                setAvailableTasks((prevAvailableTasks) =>
                    prevAvailableTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
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
                setAvailableTasks((prevAvailableTasks) => {
                    if (!prevAvailableTasks.some(task => task.id === newTask.id)) {
                        return [...prevAvailableTasks, newTask];
                    }
                    return prevAvailableTasks;
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
                setAvailableTasks(availableTasks.filter(task => task.id !== taskId));
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

    const confirmDeleteList = () => {
        if (!listToDelete) return;

        axios.delete(`/project/${projectId}/lists/${listToDelete}`)
            .then(() => {
                setLists(lists.filter(list => list.id !== listToDelete));
                setIsListDeleteModalOpen(false);
                setListToDelete(null);
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la liste:', error);
                
                setIsListDeleteModalOpen(false);
                setListToDelete(null);
            });
    };

    const handleDeleteList = (listId) => {
        setListToDelete(listId);
        setIsListDeleteModalOpen(true);
    };

    const cancelDeleteList = () => {
        setIsListDeleteModalOpen(false);
        setListToDelete(null);
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

    console.log("Tâches disponibles", availableTasks);
    return (
        <Base
            user={currentUser}
            teamUsers={teamUsers}
            projectUsers={projectUsers}
            currentUser={currentUser}
            setProjectUsers={setProjectUsers}
            projectId={projectId}
            tasks={tasks}
        >
            <MiniNav
                project={project}
                currentUser={currentUser}
                isBoardLeader={isBoardLeader}
                projectId={projectId}
                onlineUsers={onlineUsers}
            />
    
            <div className=" ">
                <div className="flex mt-4 space-x-3 items-start">
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
                                availableTasks={availableTasks}
                            />
                            <button
                                onClick={() => handleCreateList(`liste${lists.length + 1}`)}
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 duration-300 min-w-[200px]"
                            >
                                Ajouter une liste
                            </button>
                        </>
                    ) : (
                        <ModelSelection onSelectModel={handleSelectModel} />
                    )}
                </div>
            </div>
    
            {/* Bouton de chat et autres composants */}
            <button
                className="fixed bottom-4 right-4 bg-purple-500 text-white p-4 rounded-full shadow-lg hover:bg-purple-600 focus:outline-none duration-200"
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                <FiMessageCircle size={24} />
            </button>
    
            {isChatOpen && (
                <ChatWindow
                    projectId={projectId}
                    currentUser={currentUser}
                    onClose={() => setIsChatOpen(false)}
                />
            )}
    
            <ConfirmationModal
                isOpen={isListDeleteModalOpen}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer cette liste ? Cette action est irréversible."
                onConfirm={confirmDeleteList}
                onCancel={cancelDeleteList}
            />
        </Base>
    );
}

export default ShowProject;