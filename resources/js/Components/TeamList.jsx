import React from 'react';
import { FaRegEye, FaTrash } from 'react-icons/fa';
import { IoIosAdd } from 'react-icons/io';

export default function TeamList({
    teams,
    user,
    onViewTeam,
    onRemoveTeam,
    onWithdraw,
    setIsJoiningTeam,
    setIsCreatingTeam,
}) {
    return (
        <div className="p-4 w-full bg-white shadow rounded-lg mb-6">
            <div className='flex justify-between items-center'>
                <h2 className="text-2xl font-semibold">Équipes</h2>
                <div className='space-x-4 flex items-center'>
                    <button
                        className='bg-blue-50 border border-blue-600 text-blue-600 px-2 py-2 rounded-md hover:bg-blue-600 hover:text-white duration-300'
                        onClick={() => setIsJoiningTeam(true)}
                    >
                        Rejoindre une équipe
                    </button>
                    <button
                        className='bg-green-400 px-2 py-2 rounded-2xl hover:bg-white duration-300'
                        onClick={() => setIsCreatingTeam(true)}
                    >
                        <IoIosAdd className='font-extrabold text-white hover:text-green-400 duration-300' />
                    </button>
                </div>
            </div>
            <hr className='mb-4 mt-3' />
            <ul className='space-y-4'>
                {Array.isArray(teams) && teams.map((team) => (
                    <li key={team.id} className="flex justify-between items-center mb-2">
                        <div className='mr-32'>
                            <p className="text-base font-medium uppercase">{team.name}</p>
                            <p className='text-gray-500 font-light text-sm'>Rôle : {team.pivot?.role || 'N/A'}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-300"
                                onClick={() => onViewTeam(team.id)}
                            >
                                <FaRegEye />
                            </button>

                            {team.pivot?.role === 'admin' ? (
                                <button
                                    className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-300"
                                    onClick={() => onRemoveTeam(team.id)}
                                >
                                    <FaTrash />
                                </button>
                            ) : (
                                <button
                                    className="ml-4 text-sm px-2 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 transition duration-300"
                                    onClick={() => onWithdraw(team.id)}
                                >
                                    Se retirer
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}