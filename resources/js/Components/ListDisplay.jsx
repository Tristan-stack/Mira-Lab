import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import Task from './TaskList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListDisplay = ({
    lists,
    tasks,
    setTasks,
    editingListId,
    updatedListName,
    startEditingList,
    handleUpdateList,
    setEditingListId,
    setUpdatedListName,
    handleDeleteList,
    handleCreateTask,
    startEditingTask,
    editingTaskId,
    updatedTask,
    handleTaskChange,
    handleSaveTask,
    handleDeleteTask,
    setEditingTaskId,
    projectId,
    availableTasks 
}) => {
    const [newTaskNames, setNewTaskNames] = useState({});
    const [newTaskDescriptions, setNewTaskDescriptions] = useState({});
    const [showAddTaskInput, setShowAddTaskInput] = useState({});
    const inputRef = useRef(null);

    const handleAddTask = (listId) => {
        handleCreateTask(listId, newTaskNames[listId] || '', newTaskDescriptions[listId] || '');
        setNewTaskNames((prev) => ({ ...prev, [listId]: '' }));
        setNewTaskDescriptions((prev) => ({ ...prev, [listId]: '' }));
        setShowAddTaskInput((prev) => ({ ...prev, [listId]: false }));
    };

    const handleTaskNameChange = (listId, value) => {
        setNewTaskNames((prev) => ({ ...prev, [listId]: value }));
    };

    const handleListNameClick = (list) => {
        setEditingListId(list.id);
        setUpdatedListName(list.name);
    };

    const handleListNameBlur = (listId) => {
        handleUpdateList(listId);
        setEditingListId(null);
    };

    const handleListNameKeyPress = (e, listId) => {
        if (e.key === 'Enter') {
            handleUpdateList(listId);
            setEditingListId(null);
        }
    };

    useEffect(() => {
        if (editingListId !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingListId]);

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        if (!isMoveAllowed(draggableId, destination.droppableId)) {
            console.log('Move not allowed');
            toast.warning('Impossible de déplacer cette tâche ici, faites avancer la dépendance.', {
                autoClose: 5000,
                theme: "light",
                closeOnClick: true,
                pauseOnHover: true,
            });  
            return;
        }

        handleTaskMove(draggableId, source.droppableId, destination.droppableId, destination.index);
    };

    const isMoveAllowed = (taskId, destinationListId) => {
        const task = tasks.find(t => t.id.toString() === taskId);
        console.log('Task:', task);
        if (!task || !task.dependencies) {
            return true;
        }

        const dependencyTask = tasks.find(t => t.id.toString() === task.dependencies.toString());
        console.log('Dependency Task:', dependencyTask);
        if (!dependencyTask) {
            return true;
        }

        const sourceListIndex = lists.findIndex(list => list.id && list.id.toString() === task.lists_id.toString());
        const destinationListIndex = lists.findIndex(list => list.id && list.id.toString() === destinationListId.toString());
        const dependencyListIndex = lists.findIndex(list => list.id && list.id.toString() === dependencyTask.lists_id.toString());

        console.log('Source List Index:', sourceListIndex);
        console.log('Destination List Index:', destinationListIndex);
        console.log('Dependency List Index:', dependencyListIndex);

        // Permettre de déplacer dans une liste de niveau inférieur
        return destinationListIndex < dependencyListIndex;
    };

    const handleTaskMove = (taskId, sourceListId, destinationListId, destinationIndex) => {
        const updatedTasks = tasks.map(task => {
            if (task.id.toString() === taskId) {
                return { ...task, lists_id: parseInt(destinationListId) };
            }
            return task;
        });

        axios.put(`/projects/${projectId}/tasks/${taskId}`, { lists_id: destinationListId })
            .then(response => {
                console.log('Task updated successfully');
            })
            .catch(error => {
                console.error('Error updating task:', error.response ? error.response.data : error.message);
            });

        setTasks(updatedTasks);
    };

    const toggleAddTaskInput = (listId) => {
        setShowAddTaskInput((prev) => ({ ...prev, [listId]: !prev[listId] }));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-3 ml-3">
                {lists.map((list) => {
                    const listTasks = tasks.filter(task => task.lists_id === list.id);
                    const shouldScroll = listTasks.length > 3;

                    return (
                        <div
                            key={list.id}
                            className="min-w-64 p-4 bg-gray-100 rounded shadow-md flex-shrink-0"
                        >
                            {editingListId === list.id ? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={updatedListName}
                                    onChange={(e) => setUpdatedListName(e.target.value)}
                                    onBlur={() => handleListNameBlur(list.id)}
                                    onKeyPress={(e) => handleListNameKeyPress(e, list.id)}
                                    className="border rounded p-1 w-full"
                                />
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span
                                        className="font-bold cursor-pointer hover:bg-gray-200 pr-6 pl-2 py-2 rounded duration-300"
                                        onClick={() => handleListNameClick(list)}
                                    >
                                        {list.name}
                                    </span>
                                    {/* Bouton de suppression */}
                                    <button
                                        onClick={() => handleDeleteList(list.id)}
                                        className="text-red-500 hover:text-red-700 text-3xl"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                            <Droppable droppableId={list.id.toString()}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`mt-4 ${shouldScroll ? 'max-h-80 overflow-y-auto custom-scrollbar' : ''}`}
                                    >
                                        {listTasks.length > 0 ? (
                                            listTasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={` bg-transparent p-1 ${
                                                                snapshot.isDragging ? 'bg-blue-100' : ''
                                                            }`}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                position: snapshot.isDragging ? 'fixed' : 'relative',
                                                                top: snapshot.isDragging ? provided.draggableProps.style.top : 'auto',
                                                                left: snapshot.isDragging ? provided.draggableProps.style.left : 'auto',
                                                                zIndex: snapshot.isDragging ? 50 : 'auto',
                                                            }}
                                                        >
                                                            <Task
                                                                task={task}
                                                                editingTaskId={editingTaskId}
                                                                updatedTask={updatedTask}
                                                                startEditingTask={startEditingTask}
                                                                handleTaskChange={handleTaskChange}
                                                                handleSaveTask={handleSaveTask}
                                                                setEditingTaskId={setEditingTaskId}
                                                                handleDeleteTask={handleDeleteTask}
                                                                availableTasks={availableTasks}
                                                                lists={lists}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Aucune tâche</p>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <div className="mt-4">
                                {showAddTaskInput[list.id] && (
                                    <div className="mb-2">
                                        <input
                                            type="text"
                                            placeholder="Nom de la tâche"
                                            value={newTaskNames[list.id] || ''}
                                            onChange={(e) => handleTaskNameChange(list.id, e.target.value)}
                                            className="border-none drop-shadow rounded p-2 w-full mb-2"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => {
                                            if (showAddTaskInput[list.id]) {
                                                handleAddTask(list.id);
                                            } else {
                                                toggleAddTaskInput(list.id);
                                            }
                                        }}
                                        className={`p-2 bg-green-500 text-white rounded hover:bg-green-600 duration-300 ${showAddTaskInput[list.id] ? 'w-1/2' : 'w-full'}`}
                                    >
                                        {showAddTaskInput[list.id] ? 'Ajouter' : 'Ajouter une tâche'}
                                    </button>
                                    {showAddTaskInput[list.id] && (
                                        <button
                                            onClick={() => toggleAddTaskInput(list.id)}
                                            className="text-red-500 hover:text-red-700 ml-2 text-2xl"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <style>
                    {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px; /* Largeur de la barre de défilement verticale */
                    }

                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent; /* Couleur du fond de la piste de défilement */
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background-color: #a0aec0; /* Couleur du pouce de défilement (Tailwind gray-400) */
                        border-radius: 3px; /* Coins arrondis */
                        border: 2px solid transparent; /* Espace autour du pouce */
                        background-clip: padding-box; /* Assure que le bord ne déborde pas */
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background-color: #718096; /* Couleur du pouce au survol (Tailwind gray-500) */
                    }

                    .custom-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #a0aec0 transparent;
                    }
                    `}

                </style>
            </div>
        </DragDropContext>
    );

};

export default ListDisplay;