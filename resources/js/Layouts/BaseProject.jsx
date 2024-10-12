import React, { useState } from 'react';
import Navbar from '../Components/NavBar'; // Chemin vers votre composant Navbar
import Sidebar from '../Components/SidebarProject';
import TeamMembersModal from '../Components/TeamMemberModal'; // Assurez-vous que le chemin est correct

export default function Layout({ children, user, teamUsers }) {
    const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer la visibilité du pop-up

    return (
        <div className="flex h-screen">
            <Sidebar user={user} onOpenModal={() => setIsModalOpen(true)} /> {/* Passez la fonction pour ouvrir le modal */}
            <div className="flex-1 flex flex-col relative">
                <Navbar />
                <main className="p-4 flex-1 bg-gray-100">{children}</main>
                <TeamMembersModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)} // Fermer le pop-up
                    teamUsers={teamUsers}
                />
            </div>
        </div>
    );
}