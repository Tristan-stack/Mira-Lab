import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
    projectId,
    availableTasks // Passer availableTasks ici
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

        handleTaskMove(draggableId, source.droppableId, destination.droppableId, destination.index);
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
            <div className="flex space-x-3 ml-2 mt-3 ">
                <AnimatePresence>
                    {lists.map((list) => (
                        <motion.div
                            key={list.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-64 p-4 bg-gray-100 rounded shadow-md relative flex-shrink-0"
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
                                        className="mt-4"
                                    >
                                        {tasks.filter(task => task.lists_id === list.id).length > 0 ? (
                                            tasks.filter(task => task.lists_id === list.id).map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className=''
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
                                                                availableTasks={availableTasks} // Passer availableTasks ici
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : null}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <div className="mt-4">
                                <AnimatePresence>
                                    {showAddTaskInput[list.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mb-2"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Nom de la tâche"
                                                value={newTaskNames[list.id] || ''}
                                                onChange={(e) => handleTaskNameChange(list.id, e.target.value)}
                                                className="border-none drop-shadow  rounded p-2 w-full mb-2"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </DragDropContext>
    );
};

export default ListDisplay;