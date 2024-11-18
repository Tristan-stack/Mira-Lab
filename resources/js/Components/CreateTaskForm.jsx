import React, { useState } from 'react';
import axios from 'axios';

const CreateTaskForm = ({ projectId, onTaskCreated, setErrors }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    const handleCreateTask = (e) => {
        e.preventDefault();

        axios.post(`/project/${projectId}/tasks`, {
            name: taskName,
            description: taskDescription,
            project_id: projectId,
        })
            .then(response => {
                onTaskCreated(response.data); 
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

    return (
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
            </div>
            <div>
                <textarea
                    placeholder="Description de la tâche"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                {setErrors.description && <div className="text-red-500 text-sm mt-1">{setErrors.description[0]}</div>}
            </div>
            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 duration-100">Créer Tâche</button>
        </form>
    );
};

export default CreateTaskForm;
