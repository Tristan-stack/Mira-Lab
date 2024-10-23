import React, { useState } from 'react';
import Navbar from '../Components/NavBar'; // Chemin vers votre composant Navbar
import Sidebar from '../Components/SidebarProject';
import TeamMembersModal from '../Components/TeamMemberModal'; // Assurez-vous que le chemin est correct
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importer les styles de react-toastify
import { GradientProvider } from '../contexts/GradientContext.jsx'; // Importer le GradientProvider

export default function Layout({ children, user, teamUsers }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer la visibilité du pop-up

    return (
        <GradientProvider>
            <div className="flex h-screen overflow-hidden"> {/* Empêche le défilement global */}
                <Sidebar user={user} onOpenModal={() => setIsModalOpen(true)} /> {/* Passez la fonction pour ouvrir le modal */}
                <div className="flex-1 flex flex-col relative">
                    <Navbar />
                    <main className="flex-1 bg-gradient-to-r from-fuchsia-700 to-indigo-900 overflow-auto custom-scrollbar"> {/* Permet le défilement dans la zone des enfants */}
                        {children}
                    </main>
                    <TeamMembersModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)} // Fermer le pop-up
                        teamUsers={teamUsers}
                    />
                </div>
                <ToastContainer />
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px; /* Largeur de la barre de défilement */
                    }

                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1; /* Couleur de la piste */
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #888; /* Couleur de la barre de défilement */
                        border-radius: 10px; /* Arrondir les coins */
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #555; /* Couleur de la barre de défilement au survol */
                    }
                `}</style>
            </div>
        </GradientProvider>
    );
}