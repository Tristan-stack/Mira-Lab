import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskModal from './TaskModal';

const Task = ({
    task,
    editingTaskId,
    updatedTask,
    startEditingTask,
    handleTaskChange,
    handleSaveTask,
    setEditingTaskId,
    handleDeleteTask
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const openModal = () => {
        startEditingTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTaskId(null);
    };

    const deleteTask = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            setIsVisible(false);
            setTimeout(() => handleDeleteTask(task.id), 300); // Delay to allow animation to complete
        }
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-2 p-2 bg-white rounded shadow relative cursor-pointer"
                        style={{ border: '1px solid transparent', transition: 'border-color 0.05s ease-in-out' }} // Bordure transparente par défaut
                        whileHover={{ borderColor: '#3b82f6' }} // Changer uniquement la couleur de la bordure lors du survol
                    >
                        <div className="flex items-center justify-between" onClick={openModal}>
                            <div>
                                <span className="font-bold">{task.name}</span>
                                {/* <p>{task.description}</p> */}
                            </div>
                            <div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTask();
                                    }}
                                    className="text-red-500 hover:text-red-700 text-2xl"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    task={task}
                    updatedTask={updatedTask}
                    handleTaskChange={handleTaskChange}
                    handleSaveTask={handleSaveTask}
                />
            )}
        </>
    );
};

export default Task;