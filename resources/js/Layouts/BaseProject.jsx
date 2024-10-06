import React from 'react';
import Navbar from '../Components/NavBar'; // Chemin vers votre composant Navbar
import Sidebar from '../Components/SidebarProject';

export default function Layout({ children, user }) {
    return (
        <div className="flex h-screen">
            <Sidebar user={user} />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-4 flex-1 bg-gray-100">{children}</main>
            </div>
        </div>
    );
}
