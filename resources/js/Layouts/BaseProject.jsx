// BaseProject.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/NavBar';
import SidebarProject from '../Components/SidebarProject';
import TeamMembersModal from '../Components/TeamMemberModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GradientProvider } from '../contexts/GradientContext.jsx';

export default function Layout({ children, user, teamUsers, projectUsers, currentUser, setProjectUsers, projectId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`/project/${projectId}/tasks`);
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
            <div className="flex h-screen overflow-y-hidden">
                <SidebarProject
                    user={user}
                    projectUsers={projectUsers}
                    currentUser={currentUser}
                    setProjectUsers={setProjectUsers}
                    onOpenModal={() => setIsModalOpen(true)}
                    tasks={tasks}
                />
                <div className="flex-1 flex flex-col relative">
                    <Navbar />
                    <main className="flex-1 bg-gradient-to-r from-fuchsia-700 to-indigo-900 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            {children}
                        </div>
                    </main>
                    <TeamMembersModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        teamUsers={teamUsers}
                    />
                </div>
                <ToastContainer />
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 10px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                `}</style>
            </div>
        </GradientProvider>
    );
}