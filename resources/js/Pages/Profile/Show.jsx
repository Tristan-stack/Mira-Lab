import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Layout from '../../Layouts/Base';
import axios from 'axios';
import '../custom-style/styles.css';

const getRandomGradient = () => {
    const colors = [
        '#FF5733', // Rouge
        '#33FF57', // Vert
        '#3357FF', // Bleu
        '#FF33A6', // Rose
        '#FFEB33', // Jaune
        '#33FFF6', // Cyan
        '#8A33FF', // Violet
    ];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    let color2 = colors[Math.floor(Math.random() * colors.length)];
    while (color1 === color2) {
        color2 = colors[Math.floor(Math.random() * colors.length)];
    }
    return `linear-gradient(135deg, ${color1}, ${color2})`;
};

export default function Profile({ user, teams, projects }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const [gradient, setGradient] = useState('');

    const { csrf_token } = usePage().props;

    // Utiliser useEffect pour définir le gradient au premier rendu
    useEffect(() => {
        setGradient(getRandomGradient());
    }, []); // Le tableau vide signifie que l'effet ne s'exécute qu'une seule fois

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        axios
            .put('/profile', formData)
            .then(response => {
                console.log('Data updated successfully:', response.data);
                setIsEditing(false);
            })
            .catch(error => {
                console.error('There was an error updating the data:', error);
            });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const gradientStyle = {
        background: gradient,
        width: '40px',
        height: '100%',
        borderRadius: '15px',
        padding: '0.3rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem',
        marginRight: '1rem',
    };

    return (
        <Layout user={user}>
            <Head title="Mon Profil" />
            <div className="flex justify-center items-center mx-auto p-6 space-x-10">
                <div className="p-6 bg-white shadow rounded-lg mb-6">
                    <div className='w-80 h-60 bg-green-500 rounded-lg mb-4'>
                        {/* profil bg */}
                    </div>
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
                                        className="text-purple-600 w-1/2  p-2 border-white rounded-none focus:outline-none"
                                    />
                                    <div className="absolute bottom-1 w-2/3 left-0 h-0.5  bg-purple-500 transition-all duration-300"></div>
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
                                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-purple-500 transition-all duration-300"></div>
                            </div>
                        ) : (
                            <p className="text-gray-400">{formData.email}</p>
                        )}
                    </div>
                    <div className='w-full flex justify-center mt-4'>
                        {isEditing ? (
                            <button onClick={handleSaveClick} style={gradientStyle}>Enregistrer</button>
                        ) : (
                            <button onClick={handleEditClick} style={gradientStyle}>Modifier</button>
                        )}
                    </div>
                </div>

                <div>
                    <div className="p-6 bg-white shadow rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Équipes</h2>
                        <ul>
                            {teams.map((team) => (
                                <li key={team.id} className="mb-2">
                                    <p className="text-lg font-bold">{team.name}</p>
                                    <p className="text-gray-500">Rôle : {team.pivot.role}</p>
                                </li>
                            ))}
                        </ul>
                        {teams.length === 0 && <p>Aucune équipe pour le moment.</p>}
                    </div>

                    <div className="p-6 bg-white shadow rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Projets</h2>
                        <ul>
                            {projects.map((project) => (
                                <li key={project.id} className="mb-2">
                                    <p className="text-lg font-bold">{project.name}</p>
                                    <p className="text-gray-500">Rôle : {project.pivot.role}</p>
                                </li>
                            ))}
                        </ul>
                        {projects.length === 0 && <p>Aucun projet pour le moment.</p>}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
