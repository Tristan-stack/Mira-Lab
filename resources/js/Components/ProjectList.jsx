import React from 'react';
import { FaRegEye, FaTrash } from 'react-icons/fa';
import { IoIosAdd } from 'react-icons/io';

export default function ProjectList({
    projects,
    user,
    onViewProject,
    // onCreateProject,
    setIsCreatingProject,
}) {
    return (
        <div className="p-4 w-full bg-white shadow rounded-lg mb-6">
            <div className='flex justify-between items-center'>
                <h2 className="text-2xl font-semibold">Tableaux</h2>
                <button
                    className='bg-green-400 px-2 py-2 rounded-2xl hover:bg-white duration-300'
                    onClick={() => setIsCreatingProject(true)} // Afficher le formulaire de création de projet
                >
                    <IoIosAdd className='font-extrabold text-white hover:text-green-400 duration-300' />
                </button>
            </div>
            <hr className='mb-4 mt-3' />
            <ul className='space-y-4'>
                {projects
                    .filter(project => Array.isArray(project.users) && project.users.some(u => u.id === user.id))
                    .map((project) => (
                        <li key={project.id} className="flex justify-between items-center mb-2">
                            <div className='mr-32'>
                                <p className="text-base font-semibold uppercase">{project.name}</p>
                                <p className='text-gray-500 font-light text-sm'>{project.status}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300"
                                    onClick={() => onViewProject(project.id)}
                                >
                                    <FaRegEye />
                                </button>
                                {project.pivot?.role === 'admin' && (
                                    <button
                                        className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-300"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}