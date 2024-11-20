// UserProfile.jsx
import React, { useState } from 'react';
import axios from 'axios'; 
import { toast } from 'react-toastify';
import { BackgroundGradientAnimation } from "../Components/ui/background-gradient-animation.jsx";

export default function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await axios.put('/profile', formData);
            setIsEditing(false);
            toast.success('Profil mis à jour avec succès');
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du profil");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg space-y-2 max-w-md">
            <div className='w-80 h-44 rounded-lg mb-4 overflow-hidden relative'>
                <div className="absolute inset-0 flex items-center justify-center">
                    <BackgroundGradientAnimation />
                </div>
            </div>
            <div className="w-full space-y-4 mb-4">
                <h3 className='font-bold text-2xl'>Mon profil</h3>
                <p className='text-gray-400 font-light text-xs text-right'>
                    Membre depuis : {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p className='text-gray-400 font-light text-xs text-right'>
                    Dernière modification : {new Date(user.updated_at).toLocaleDateString()}
                </p>
                <hr />
            </div>
            <div className='space-y-4 flex flex-col items-center'>
                <div className='w-full'>
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="text-purple-600 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    ) : (
                        <p className="text-gray-400">{formData.name}</p> 
                    )}
                </div>
                <div className='w-full'>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-purple-600 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    ) : (
                        <p className="text-gray-400">{formData.email}</p>
                    )}
                </div>
            </div>
            <div className='w-full flex justify-center mt-4'>
                {isEditing ? (
                    <button
                        onClick={handleSaveClick}
                        className='py-2 px-6 text-white rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition duration-300'
                    >
                        Enregistrer
                    </button>
                ) : (
                    <button
                        onClick={handleEditClick}
                        className='py-2 px-6 text-white rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition duration-300'
                    >
                        Modifier
                    </button>
                )}
            </div>
            <style>
                {`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e0;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: #a0aec0;
                }

                /* Ensure fixed height for text paragraphs to prevent resizing */
                .text-gray-400 {
                    min-height: 2rem; /* Adjust based on your design */
                }
                `}
            </style>
        </div>
    );
}