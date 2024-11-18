import React from 'react';
import Navbar from '../Components/NavBar'; 
import Sidebar from '../Components/Sidebar'; 

export default function Layout({ children, user }) {
    return (
        <div className="w-screen h-screen flex overflow-hidden">
            <Sidebar user={user} className="flex-shrink-0 w-64" />
            <div className="flex flex-col flex-grow overflow-hidden">
                <Navbar user={user} />
                <main className="flex-grow bg-gray-100 overflow-auto"> 
                    {children}
                </main>
            </div>
        </div>
    );
}