import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import Task from './TaskList';

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
    projectId
}) => {
    const [newTaskNames, setNewTaskNames] = useState({});
    const [newTaskDescriptions, setNewTaskDescriptions] = useState({});
    const inputRef = useRef(null);

    const handleAddTask = (listId) => {
        handleCreateTask(listId, newTaskNames[listId] || '', newTaskDescriptions[listId] || '');
        setNewTaskNames((prev) => ({ ...prev, [listId]: '' }));
        setNewTaskDescriptions((prev) => ({ ...prev, [listId]: '' }));
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

        handleTaskMove(draggableId, source.droppableId, destination.droppableId, destination.index);
    };

    const handleTaskMove = (taskId, sourceListId, destinationListId, destinationIndex) => {
        // Mettre à jour l'état local pour refléter le changement immédiatement
        const updatedTasks = tasks.map(task => {
            if (task.id.toString() === taskId) {
                return { ...task, lists_id: parseInt(destinationListId) };
            }
            return task;
        });

        // Log pour vérifier les données envoyées
        console.log(`Updating task ${taskId} from list ${sourceListId} to list ${destinationListId}`);

        // Envoyer une requête au serveur pour mettre à jour le lists_id de la tâche
        axios.put(`/projects/${projectId}/tasks/${taskId}`, { lists_id: destinationListId })

            .then(response => {
                console.log('Task updated successfully');
            })
            .catch(error => {
                console.error('Error updating task:', error.response ? error.response.data : error.message);
            });

        // Mettre à jour l'état local
        setTasks(updatedTasks);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 ml-2 overflow-x-auto custom-scrollbar">
                {lists.map((list) => (
                    <div key={list.id} className="w-64 p-4 bg-gray-100 rounded shadow-md relative flex-shrink-0">
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
                                    className="font-bold cursor-pointer"
                                    onClick={() => handleListNameClick(list)}
                                >
                                    {list.name}
                                </span>
                                <button
                                    onClick={() => handleDeleteList(list.id)}
                                    className="text-red-500 hover:text-red-700"
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
                                    className="mt-4"
                                >
                                    {tasks.filter(task => task.lists_id === list.id).map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
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
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Nom de la tâche"
                                value={newTaskNames[list.id] || ''}
                                onChange={(e) => handleTaskNameChange(list.id, e.target.value)}
                                className="border rounded p-1 w-full"
                            />
                            <button
                                onClick={() => handleAddTask(list.id)}
                                className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                            >
                                Ajouter une tâche
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default ListDisplay;