import React, { useState } from 'react';
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

    const openModal = () => {
        startEditingTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTaskId(null);
    };

    return (
        <div className="mb-2 p-2 bg-white rounded shadow relative hover:border border-blue-500 cursor-pointer">
            <div className="flex items-center justify-between" onClick={openModal}>
                <div>
                    <span className="font-bold">{task.name}</span>
                    {/* <p>{task.description}</p> */}
                </div>
                <div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={closeModal}
                task={task}
                updatedTask={updatedTask}
                handleTaskChange={handleTaskChange}
                handleSaveTask={handleSaveTask}
            />
        </div>
    );
};

export default Task;