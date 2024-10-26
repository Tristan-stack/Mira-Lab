import React from 'react';

const TaskList = ({ tasks, editingTaskId, updatedTask, startEditingTask, handleTaskChange, handleSaveTask, handleDeleteTask }) => {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Tâches du projet</h3>
            <ul className="space-y-2 w-1/2 mx-auto">
                {tasks.map(task => (
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
                        <div>
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
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;