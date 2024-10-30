import React from 'react';

const ModelSelection = ({ onSelectModel }) => {
    return (
        <div className="flex flex-col items-center w-full h-dvh text-white mx-auto">
            <h2 className="text-2xl">Bienvenu sur le Board</h2>
            <p>Commencer à partir d'un modèle prédéfini</p>
            <div className="mt-4 space-x-4">
                <button
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-300"
                    onClick={() => onSelectModel('todo')}
                >
                    Modèle TO DO
                </button>
                <button
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-300"
                    onClick={() => onSelectModel('agile')}
                >
                    Modèle Agile
                </button>
            </div>
        </div>
    );
};

export default ModelSelection;