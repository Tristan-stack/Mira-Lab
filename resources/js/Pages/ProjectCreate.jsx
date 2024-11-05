import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IoMdClose } from 'react-icons/io'; // Importer l'icône de fermeture
import './custom-style/styles.css';

const CreateProjectForm = ({ onCreate, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: '',
        team_id: '',
    });

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('/user/teams'); // Remplacez par l'URL correcte de votre API
                setTeams(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des équipes:', error.response ? error.response.data : error.message);
            }
        };

        fetchTeams();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/projects', formData);
            console.log('Projet créé avec succès:', response.data);

            if (onCreate) {
                onCreate(response.data.project); // Passer le projet créé à la fonction onCreate
            }

            setFormData({
                name: '',
                description: '',
                start_date: '',
                end_date: '',
                status: '',
                team_id: '',
            });
        } catch (error) {
            console.error('Erreur lors de la création du projet:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto bg-white rounded-lg max-w-md w-full p-8"
            style={{ boxShadow: '0px 0px 41px 13px rgba(0,0,0,0.1)' }}
        >
            <button
                onClick={onCancel}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 duration-150"
            >
                <IoMdClose size={24} />
            </button>
            <h1 className="gradient-title text-center mb-6">Créer un projet</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom du projet
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                        Date de début
                    </label>
                    <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                        Date de fin
                    </label>
                    <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Statut
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Sélectionner un statut</option>
                        <option value="Public">Public</option>
                        <option value="Privé">Privé</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="team_id" className="block text-sm font-medium text-gray-700">
                        Équipe
                    </label>
                    <select
                        id="team_id"
                        name="team_id"
                        value={formData.team_id}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Sélectionner une équipe</option>
                        {Array.isArray(teams) && teams.length > 0 ? (
                            teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))
                        ) : (
                            <option value="">Aucune équipe disponible</option>
                        )}
                    </select>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md w-full"
                >
                    Créer le projet
                </button>
            </form>
        </motion.div>
    );
};

export default CreateProjectForm;