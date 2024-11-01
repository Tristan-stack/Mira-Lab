import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/NavBar'; // Chemin vers votre composant Navbar
import SidebarProject from '../Components/SidebarProject';
import TeamMembersModal from '../Components/TeamMemberModal'; // Assurez-vous que le chemin est correct
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importer les styles de react-toastify
import { GradientProvider } from '../contexts/GradientContext.jsx'; // Importer le GradientProvider

export default function Layout({ children, user, teamUsers, projectUsers, currentUser, setProjectUsers, projectId }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer la visibilité du pop-up
    const [tasks, setTasks] = useState([]); // État pour stocker les tâches

    useEffect(() => {
        // Fonction pour récupérer les tâches d'un projet spécifique
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`/project/${projectId}/tasks`); // Utilisez projectId pour récupérer les tâches du projet spécifique
                console.log("Projet ID :", projectId); // Affichez l'ID du projet
                console.log("Tâches récupérées :", response.data.tasks); // Affichez les tâches récupérées
                setTasks(response.data.tasks);
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };

        if (projectId) {
            fetchTasks();
        }
    }, [projectId]);

    return (
        <GradientProvider>
            <div className="flex h-screen overflow-hidden"> {/* Empêche le défilement global */}
                <SidebarProject
                    user={user}
                    projectUsers={projectUsers}
                    currentUser={currentUser}
                    setProjectUsers={setProjectUsers}
                    onOpenModal={() => setIsModalOpen(true)} // Passez la fonction pour ouvrir le modal
                    tasks={tasks} // Passez les tâches à SidebarProject
                />
                <div className="flex-1 flex flex-col relative">
                    <Navbar />
                    <main className="flex-1 bg-gradient-to-r from-fuchsia-700 to-indigo-900 custom-scrollbar"> {/* Permet le défilement dans la zone des enfants */}
                        <div className="custom-scrollbar h-full ">
                            {children}
                        </div>
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
                        height: 8px; /* Hauteur de la barre de défilement */
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