import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskDetails = ({
    task,
    availableTasks,
    selectedDependencyId,
    setSelectedDependencyId,
    lists
}) => {
    const [startDate, setStartDate] = useState(task.start_date || '');
    const [endDate, setEndDate] = useState(task.end_date || '');
    const [status, setStatus] = useState(task.status || 'Non commencer');

    useEffect(() => {
        setStatus(task.status || 'Non commencer');
        setStartDate(task.start_date || '');
        setEndDate(task.end_date || '');
    }, [task]);


    useEffect(() => {
        console.log('TaskDetails : availableTasks mis à jour:', availableTasks);
        console.log('TaskDetails : task.dependencies mis à jour:', task.dependencies);
    }, [availableTasks, task.dependencies]);

    const handleDependencyChange = (event) => {
        setSelectedDependencyId(event.target.value);
    };

    const handleAddDependency = async () => {
        if (selectedDependencyId) {
            try {
                await axios.post(`/projects/${task.project_id}/tasks/${task.id}/add-dependency`, {
                    dependencies: selectedDependencyId
                });
                setSelectedDependencyId('');
                toast.success('Dépendance mise à jour avec succès !');
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la dépendance:', error);
                toast.error('Échec de l\'ajout de la dépendance.');
            }
        }
    };

    const handleRemoveDependency = async () => {
        try {
            await axios.delete(`/projects/${task.project_id}/tasks/${task.id}/remove-dependency`, {
                data: { dependencies: '' }
            });
            setSelectedDependencyId('');
            toast.success('Dépendance retirée avec succès !');
        } catch (error) {
            console.error('Erreur lors de la suppression de la dépendance:', error);
            toast.error('Échec de la suppression de la dépendance.');
        }
    };

    const handleDateChange = async (field, value) => {
        const today = new Date();
        const selectedDate = new Date(value);

        const formattedToday = today.toISOString().split('T')[0];

        if (selectedDate < today.setHours(0, 0, 0, 0)) {
            toast.error(`La date ${field === 'start_date' ? 'de début' : 'de fin'} ne peut pas être antérieure à aujourd'hui.`);
            return;
        }

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
            }
            toast.success('Date mise à jour avec succès !');
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de ${field}:`, error);
            toast.error(`Échec de la mise à jour de ${field}.`);
        }
    };

    const cycleStatus = () => {
        const statuses = ['Non commencer', 'En cours', 'Fini'];
        const currentIndex = statuses.indexOf(status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const nextStatus = statuses[nextIndex];

        setStatus(nextStatus);
        toast.success(`Statut mis à jour en "${nextStatus}" !`);

        axios.put(`/projects/${task.project_id}/tasks/${task.id}/update-status`, {
            status: nextStatus
        })
            .catch(error => {
                console.error('Erreur lors de la mise à jour du statut:', error);
                toast.error('Échec de la mise à jour du statut.');
            });
    };

    const currentTaskCreatedAt = new Date(task.created_at);
    const filteredTasks = availableTasks.filter(t => {
        if (t.id === task.id) return false;
        const taskCreatedAt = new Date(t.created_at);
        return taskCreatedAt >= currentTaskCreatedAt;
    });

    const getDependencyName = (depId) => {
        const depTask = availableTasks.find(t => String(t.id) === String(depId));
        return depTask ? depTask.name : 'Tâche inconnue';
    };

    const todayDate = new Date().toISOString().split('T')[0];
    const getStatusButtonColor = () => {
        switch (status) {
            case 'Non commencer':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'En cours':
                return 'bg-red-500 hover:bg-red-600';
            case 'Fini':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    return (
        <div className='bg-white p-6 rounded shadow-md w-1/4 max-w-lg flex flex-col space-y-4 h-2/3'>
            <h1 className='text-2xl font-semibold text-gray-800'>Détails de la tâche</h1>
            <div className='space-y-2'>
                <div className='flex items-center space-x-4 mb-4'>
                    <p className='text-gray-600'>Status :</p>
                    <button
                        onClick={cycleStatus}
                        className={`${getStatusButtonColor()} text-white text-xs font-medium px-4 py-2 rounded-full`}
                    >
                        {status}
                    </button>
                </div>
                <div>
                    <label className='block text-gray-600'>Date de début :</label>
                    <input
                        type="date"
                        value={startDate}
                        min={todayDate}
                        onChange={(e) => handleDateChange('start_date', e.target.value)}
                        className="border rounded-lg p-2 w-full mt-1"
                    />
                </div>
                <div>
                    <label className='block text-gray-600'>Date de fin :</label>
                    <input
                        type="date"
                        value={endDate}
                        min={todayDate}
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
    setSelectedDependencyId: PropTypes.func.isRequired,
    lists: PropTypes.array.isRequired
};

export default TaskDetails;