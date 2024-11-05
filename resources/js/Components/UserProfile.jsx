import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Vous pouvez ajouter ici la logique pour enregistrer les modifications
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès');

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg mb-6 relative">
            <div className='w-80 h-60 bg-gray-300 rounded-lg mb-4'></div>
            <div className="w-full space-y-2 mb-4">
                <h3 className='font-black text-2xl'>Mon profil</h3>
                <p className='text-gray-400 font-light text-xs text-right'>Membre depuis : {new Date(user.created_at).toLocaleDateString()}</p>
                <p className='text-gray-400 font-light text-xs text-right'>Dernière modification : {new Date(user.updated_at).toLocaleDateString()}</p>
            </div>
            <div className='space-y-3'>
                <div className='w-full flex justify-between'>
                    {isEditing ? (
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-purple-600 w-1/2 p-2 border-white rounded-none focus:outline-none"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-400">{formData.name}</p>
                    )}
                    <p className='text-gray-400 font-normal whitespace-nowrap'>
                        Compte n°<span className='text-purple-800 font-bold'>{user.id}</span>
                    </p>
                </div>
                {isEditing ? (
                    <div className="relative w-full">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-purple-600 border-white p-2 rounded-none w-full focus:outline-none"
                        />
                    </div>
                ) : (
                    <p className="text-gray-400">{formData.email}</p>
                )}
            </div>
            <div className='w-full flex justify-center mt-4'>
                {isEditing ? (
                    <button
                        onClick={handleSaveClick}
                        className='py-1 px-4 text-white rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition duration-300'
                    >
                        Enregistrer
                    </button>
                ) : (
                    <button
                        onClick={handleEditClick}
                        className='py-1 px-4 text-white rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition duration-300'
                    >
                        Modifier
                    </button>
                )}
            </div>
        </div>
    );
}