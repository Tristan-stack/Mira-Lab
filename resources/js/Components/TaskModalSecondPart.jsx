// TaskModalSecondPart.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskDetails = ({
    task,
    availableTasks,
    selectedDependencyId,
    setSelectedDependencyId
}) => {
    const [startDate, setStartDate] = useState(task.start_date || '');
    const [endDate, setEndDate] = useState(task.end_date || '');
    const [status, setStatus] = useState(task.status || 'pending');

    useEffect(() => {
        checkAndUpdateStatus();
    }, [endDate]);

    useEffect(() => {
        console.log('TaskDetails : availableTasks mis à jour:', availableTasks);
        console.log('TaskDetails : task.dependencies mis à jour:', task.dependencies);
    }, [availableTasks, task.dependencies]);

    const checkAndUpdateStatus = async () => {
        if (endDate && new Date(endDate) < new Date()) {
            if (status !== 'Fini') {
                try {
                    await axios.post(`/projects/${task.project_id}/tasks/${task.id}/add-dependency`, {
                        status: 'Fini'
                    });
                    setStatus('Fini');
                    toast.success('Status updated to Fini!');
                } catch (error) {
                    console.error('Error updating status:', error);
                    toast.error('Failed to update status.');
                }
            }
        } else {
            setStatus('pending');
        }
    };

    const handleDependencyChange = (event) => {
        setSelectedDependencyId(event.target.value);
    };

    const handleAddDependency = async () => {
        if (selectedDependencyId) {
            try {
                await axios.post(`/projects/${task.project_id}/tasks/${task.id}/add-dependency`, {
                    dependencies: selectedDependencyId
                });
                // Supprimer l'appel à setCurrentDependency
                // setCurrentDependency(selectedDependencyId);
                setSelectedDependencyId('');
                toast.success('Dependency added successfully!');
            } catch (error) {
                console.error('Error adding dependency:', error);
                toast.error('Failed to add dependency.');
            }
        }
    };

    const handleRemoveDependency = async () => {
        try {
            await axios.delete(`/projects/${task.project_id}/tasks/${task.id}/remove-dependency`, {
                data: { dependencies: '' } // Correction : Utilisation de 'data' pour axios delete
            });
            // Supprimer l'appel à setCurrentDependency
            // setCurrentDependency('');
            setSelectedDependencyId(''); // Ajouté pour réinitialiser la dépendance sélectionnée
            toast.success('Dependency removed successfully!');
        } catch (error) {
            console.error('Error removing dependency:', error);
            toast.error('Failed to remove dependency.');
        }
    };

    const handleDateChange = async (field, value) => {
        if ((field === 'start_date' && value === startDate) || (field === 'end_date' && value === endDate)) {
            return;
        }

        try {
            await axios.post(`/projects/${task.project_id}/tasks/${task.id}/add-dependency`, {
                [field]: value
            });
            if (field === 'start_date') {
                setStartDate(value);
            } else if (field === 'end_date') {
                setEndDate(value);
                checkAndUpdateStatus();
            }
            toast.success('Date updated successfully!');
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            toast.error(`Failed to update ${field}.`);
        }
    };

    const filteredTasks = availableTasks.filter(t => t.id !== task.id);

    const getDependencyName = (depId) => {
        const depTask = availableTasks.find(t => String(t.id) === String(depId));
        return depTask ? depTask.name : 'Tâche inconnue';
    };

    return (
        <div className='bg-white p-6 rounded shadow-md w-1/4 max-w-lg flex flex-col space-y-4 h-2/3'>
            <h1 className='text-2xl font-semibold text-gray-800'>Détails de la tâche</h1>
            <div className='space-y-2'>
                <p className='text-gray-600'>Status : <span className='font-medium'>{status}</span></p>
                <div>
                    <label className='block text-gray-600'>Date de début :</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleDateChange('start_date', e.target.value)}
                        className="border rounded-lg p-2 w-full mt-1"
                    />
                </div>
                <div>
                    <label className='block text-gray-600'>Date de fin :</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleDateChange('end_date', e.target.value)}
                        className="border rounded-lg p-2 w-full mt-1"
                    />
                </div>
                <div>
                    <label className='block text-gray-600'>Dépendance :</label>
                    <select
                        name="dependencies"
                        value={selectedDependencyId}
                        onChange={handleDependencyChange}
                        className="border rounded-lg p-2 w-full mt-1"
                    >
                        <option value="">Aucune</option>
                        {filteredTasks.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    {selectedDependencyId && (
                        <button
                            onClick={handleAddDependency}
                            className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 duration-200"
                        >
                            Ajouter
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800">Dépendance actuelle :</h3>
                {task.dependencies ? (
                    <div className="flex justify-between items-center mt-2">
                        <span className='text-gray-700'>{getDependencyName(task.dependencies)}</span>
                        <button
                            onClick={handleRemoveDependency}
                            className="text-red-500 hover:text-red-700 text-xl"
                        >
                            &times;
                        </button>
                    </div>
                ) : (
                    <p className='text-gray-600'>Aucune dépendance</p>
                )}
            </div>
        </div>
    );
};

TaskDetails.propTypes = {
    task: PropTypes.object.isRequired,
    availableTasks: PropTypes.array.isRequired,
    selectedDependencyId: PropTypes.string.isRequired,
    setSelectedDependencyId: PropTypes.func.isRequired
};

export default TaskDetails;