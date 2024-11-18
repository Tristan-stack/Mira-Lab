// JoinProjectPopUp.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JoinProjectPopUp = ({ onClose, onJoinProject, projectCode }) => {
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setInputCode(projectCode); 
    }, [projectCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onJoinProject(inputCode);
            setError(''); 
            onClose(); 
        } catch (err) {
            setError(err.message); 
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className="absolute inset-0 -left-16 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
                <motion.div
                    className="relative bg-white p-6 rounded-md shadow-lg z-10 max-w-md w-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Rejoindre un projet privé</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="projectCode" className="block text-gray-700">Code du projet</label>
                            <input
                                type="text"
                                id="projectCode"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 mb-4 bg-red-400/20 p-2 rounded">{error}</p>}
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                onClick={onClose}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                            >
                                Rejoindre
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default JoinProjectPopUp;