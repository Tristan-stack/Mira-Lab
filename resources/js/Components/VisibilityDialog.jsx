import React, { useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa'; // Importer l'icône nécessaire
import { motion } from 'framer-motion'; // Importer Framer Motion

const VisibilityDialog = ({ project, onClose, onVisibilityChange, isBoardLeader }) => {
    const modalRef = useRef(null);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute rounded top-15 left-40 bg-white shadow-lg p-4 z-50"
            ref={modalRef}
        >
            <h3 className="text-lg font-semibold mb-2">Mode de visibilité</h3>
            <div
                className={`flex items-center space-x-2 cursor-pointer ${!isBoardLeader && 'cursor-not-allowed opacity-50'}`}
                onClick={() => isBoardLeader && onVisibilityChange('Privé')}
            >
                <span>Privé</span>
                {project.status === 'Privé' && <FaCheck className="text-green-500" />}
            </div>
            <div
                className={`flex items-center space-x-2 cursor-pointer mt-2 ${!isBoardLeader && 'cursor-not-allowed opacity-50'}`}
                onClick={() => isBoardLeader && onVisibilityChange('Public')}
            >
                <span>Public</span>
                {project.status === 'Public' && <FaCheck className="text-green-500" />}
            </div>
        </motion.div>
    );
};

export default VisibilityDialog;