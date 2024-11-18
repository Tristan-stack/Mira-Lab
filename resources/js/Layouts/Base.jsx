import React from 'react';
import Navbar from '../Components/NavBar'; // Chemin vers votre composant Navbar
import Sidebar from '../Components/Sidebar'; 

export default function Layout({ children, user }) {
    return (
        <div className="w-screen h-screen flex overflow-hidden"> {/* Empêche le défilement global */}
            <Sidebar user={user} className="flex-shrink-0 w-64" /> {/* Largeur fixe pour la barre latérale */}
            <div className="flex flex-col flex-grow overflow-hidden"> {/* Empêche le débordement horizontal */}
                <Navbar user={user} />
                <main className="flex-grow bg-gray-100 overflow-auto"> {/* Permet le défilement vertical dans la zone des enfants */}
                    {children}
                </main>
            </div>
        </div>
    );
}