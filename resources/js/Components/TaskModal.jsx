import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import axios from 'axios'; // Assurez-vous d'avoir axios installé
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskModal = ({
    isOpen,
    onClose,
    task,
    updatedTask,
    handleTaskChange,
    handleSaveTask,
    availableTasks = [] // Nouvelle prop pour les tâches disponibles avec valeur par défaut
}) => {
    const containerRef = useRef(null); // Conteneur global pour les deux parties de la modal
    const quillRef = useRef(null);
    const [selectedDependencyId, setSelectedDependencyId] = useState(''); // État local pour stocker l'ID de la dépendance sélectionnée
    const [currentDependency, setCurrentDependency] = useState(task.dependencies || ''); // État local pour stocker la dépendance actuelle

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && quillRef.current && !quillRef.current.__quill) {
            const quill = new Quill(quillRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link']
                    ]
                }
            });

            quillRef.current.__quill = quill;

            quill.on('text-change', () => {
                handleTaskChange({
                    target: {
                        name: 'description',
                        value: quill.root.innerHTML
                    }
                });
            });

            quill.root.innerHTML = updatedTask.description || '';
        }
    }, [isOpen, updatedTask.description, handleTaskChange]);

    if (!isOpen) return null;

    const handleSaveAndClose = async (taskId) => {
        await handleSaveTask(taskId);
        onClose(); // Fermer la modal après la sauvegarde
    };

    const handleDependencyChange = (event) => {
        setSelectedDependencyId(event.target.value); // Mettre à jour l'état local
    };

    const handleAddDependency = async () => {
        if (selectedDependencyId) {
            try {
                await axios.post(`/projects/${task.project_id}/tasks/${task.id}/add-dependency`, {
                    dependencies: selectedDependencyId
                });
                setCurrentDependency(selectedDependencyId);
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
                dependencies: ''
            });
            setCurrentDependency('');
            toast.success('Dependency removed successfully!');
        } catch (error) {
            console.error('Error removing dependency:', error);
            toast.error('Failed to remove dependency.');
        }
    };

    // Filtrer les tâches disponibles pour exclure celle que vous éditez actuellement
    const filteredTasks = availableTasks.filter(t => t.id !== task.id);

    const getDependencyName = (depId) => {
        const depTask = availableTasks.find(t => t.id === depId);
        return depTask ? depTask.name : 'Tâche inconnue';
    };

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div ref={containerRef} className="flex justify-center items-center gap-4 w-full h-full">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg mx-4 relative flex flex-col justify-between h-2/4">
                    <div>
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-3xl"
                        >
                            &times;
                        </button>

                        <h2 className="text-xl font-bold mb-4">Modifier la tâche</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Nom de la tâche
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={updatedTask.name}
                                onChange={handleTaskChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>

                        <div className="mb-4 flex-grow">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                Description de la tâche
                            </label>
                            <div ref={quillRef} className="border rounded p-2 w-full h-40 max-h-40 overflow-y-auto quill-editor" />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="mr-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => handleSaveAndClose(task.id)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
                <div className='bg-white p-6 rounded shadow-lg w-1/5 max-w-lg relative flex flex-col h-2/4'>
                    <h1>second part</h1>
                    <p>Status : {task.status}</p>
                    <p>Date de début : {task.start_date}</p>
                    <p>Date de fin : {task.end_date}</p>
                    <p>Dépendance :</p>
                    <select
                        name="dependencies"
                        value={selectedDependencyId}
                        onChange={handleDependencyChange}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">Aucune</option>
                        {filteredTasks.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    {selectedDependencyId && (
                        <button
                            onClick={handleAddDependency}
                            className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Ajouter
                        </button>
                    )}
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Dépendance actuelle :</h3>
                        {currentDependency ? (
                            <div className="flex justify-between items-center">
                                <span>{getDependencyName(currentDependency)}</span>
                                <button
                                    onClick={handleRemoveDependency}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    &times;
                                </button>
                            </div>
                        ) : (
                            <p>Aucune dépendance</p>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default TaskModal;
