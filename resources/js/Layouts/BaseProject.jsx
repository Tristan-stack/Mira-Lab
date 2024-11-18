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
                <div className="flex flex-col flex-1">
                    <Navbar />
                    <main className="flex-1 overflow-auto w-full bg-blue-900">
                        <div className="h-full ">
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
            </div>
        </GradientProvider>
    );
}