import React, { useEffect, useRef } from 'react';

const TaskModal = ({
    isOpen,
    onClose,
    task,
    updatedTask,
    handleTaskChange,
    handleSaveTask
}) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
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

    if (!isOpen) return null;

    const handleSaveAndClose = (taskId) => {
        handleSaveTask(taskId);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div ref={modalRef} className="bg-white p-6 rounded shadow-lg w-1/2 relative">
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description de la tâche
                    </label>
                    <textarea
                        name="description"
                        value={updatedTask.description}
                        onChange={handleTaskChange}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="flex justify-end">
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
        </div>
    );
};

export default TaskModal;