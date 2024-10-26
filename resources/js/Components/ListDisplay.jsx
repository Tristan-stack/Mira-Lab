import React from 'react';

const ListDisplay = ({ lists, tasks, startEditingTask, handleDeleteTask }) => {
    return (
        <div className="mt-6">
            {lists.map((list) => (
                <div key={list.id} className="p-4 bg-white rounded shadow-md mb-4">
                    <h3 className="text-lg font-bold">{list.name}</h3>
                    <ul className="list-disc ml-5">
                        {tasks.filter(task => task.lists_id === list.id).map(task => (
                            <li key={task.id} className="flex justify-between items-center">
                                <span>{task.name}</span>
                                <div>
                                    <button onClick={() => startEditingTask(task)} className="text-blue-500">Modifier</button>
                                    <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 ml-2">Supprimer</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ListDisplay;
