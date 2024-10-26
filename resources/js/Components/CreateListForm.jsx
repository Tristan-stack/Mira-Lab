import React, { useState } from 'react';
import axios from 'axios';

const CreateListForm = ({ projectId, onListCreated }) => {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    console.log(projectId);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`/project/${projectId}/lists`, {
            name,
            status: 'en cours',
            project_id: projectId,
        })

            .then(response => {
                setName('');
                setErrors({});
                onListCreated(response.data.list);
            })
            .catch(error => {
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input
                    type="text"
                    placeholder="Nom de la liste"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name[0]}</div>}
            </div>
            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 duration-100">Créer Liste</button>
        </form>
    );
};

export default CreateListForm;