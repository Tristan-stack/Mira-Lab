import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskDetails from './TaskModalSecondPart';

const TaskModal = ({
    isOpen,
    onClose,
    task,
    updatedTask,
    handleTaskChange,
    handleSaveTask,
    availableTasks = []
}) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const [selectedDependencyId, setSelectedDependencyId] = useState('');
    const [currentDependency, setCurrentDependency] = useState(task.dependencies || '');

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
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div ref={containerRef} className="flex justify-center items-center gap-4 w-full h-full">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg mx-4 relative flex flex-col justify-between h-2/3">
                    <div>
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-3xl duration-200"
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
                            className="mr-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => handleSaveAndClose(task.id)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-200"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
                <TaskDetails
                    task={task}
                    availableTasks={availableTasks}
                    selectedDependencyId={selectedDependencyId}
                    setSelectedDependencyId={setSelectedDependencyId}
                    currentDependency={currentDependency}
                    setCurrentDependency={setCurrentDependency}
                />
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default TaskModal;