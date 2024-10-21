// VisibilityDialog.jsx

import React from 'react';
import { FaCheck } from 'react-icons/fa'; // Importer l'icône nécessaire

const VisibilityDialog = ({ project, onClose, onVisibilityChange, isBoardLeader }) => {
    return (
        <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg p-4 z-50">
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
        </div>
    );
};

export default VisibilityDialog;