import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskModal from './TaskModal';
import ConfirmationModal from '../Components/ConfirmationModal'; 

const Task = ({
    task,
    editingTaskId,
    updatedTask,
    startEditingTask,
    handleTaskChange,
    handleSaveTask,
    setEditingTaskId,
    handleDeleteTask,
    availableTasks,
    lists
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const openModal = () => {
        startEditingTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTaskId(null);
    };

    const deleteTask = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTask = () => {
        if (!taskToDelete) return;

        setIsVisible(false);
        setTimeout(() => handleDeleteTask(taskToDelete), 300); 

        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
    };

    const cancelDeleteTask = () => {
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
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
                        className=" p-2 bg-white rounded shadow relative cursor-pointer"
                        style={{ border: '1px solid transparent', transition: 'border-color 0.05s ease-in-out' }}
                        whileHover={{ borderColor: '#3b82f6' }}
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
                                        setTaskToDelete(task.id);
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
                    availableTasks={availableTasks}
                    lists={lists}
                />
            )}

            {/* Modal de Confirmation */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible."
                onConfirm={confirmDeleteTask}
                onCancel={cancelDeleteTask}
            />
        </>
    );
};

export default Task;