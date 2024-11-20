// SidebarProject.jsx
import React, { useState } from 'react';
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiMessageCircle,
  FiBell,
  FiLogOut,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { createPortal } from 'react-dom';
import { useGradient } from '../contexts/GradientContext.jsx';
import ProjectMemberModal from './ProjectMemberModal';
import CalendarView from './CalendarView.jsx';
import { Inertia } from '@inertiajs/inertia';

export default function SidebarProject({ user, projectUsers, currentUser, setProjectUsers, onOpenModal, tasks }) {
    const gradient = useGradient(); 
    const [openTab, setOpenTab] = useState(null); 
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false); 
    const [showCalendar, setShowCalendar] = useState(false); 

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            Inertia.visit('/'); 
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleUserClick = () => {
        Inertia.visit('/profile'); 
    };

    const handleOpenMemberModal = () => {
        setIsMemberModalOpen(true);
    };

    const handleCloseMemberModal = () => {
        setIsMemberModalOpen(false);
    };

    const toggleTab = (tab) => {
        setOpenTab(openTab === tab ? null : tab);
    };

    const handleCalendarClick = () => {
        setShowCalendar(true);
    };

    const handleCloseCalendar = () => {
        setShowCalendar(false);
    };

    return (
        <div className="bg-white h-screen p-4 shadow-md w-64 flex flex-col flex-shrink-0">
            <div className="text-2xl font-bold text-purple-600 mb-8">Board View</div>
            <nav className="space-y-4 w-full flex-grow overflow-y-auto">
                <div
                    className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                    onClick={handleCalendarClick}
                >
                    <FiCalendar className="mr-3 text-gray-600" />
                    <span>Calendrier</span>
                </div>
                <div>
                    <div
                        className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                        onClick={() => toggleTab('teams')}
                    >
                        <FiUsers className="mr-3 text-gray-600" />
                        <span>Teams</span>
                        {openTab === 'teams' ? <FiChevronDown className="ml-auto text-gray-600" /> : <FiChevronRight className="ml-auto text-gray-600" />}
                    </div>
                    <motion.div
                        initial={false}
                        animate={openTab === 'teams' ? "open" : "closed"}
                        variants={{
                            open: { height: "auto", opacity: 1 },
                            closed: { height: 0, opacity: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="ml-8 space-y-2">
                            <div
                                className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                                onClick={onOpenModal}
                            >
                                <span>Membres</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div>
                    <div
                        className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                        onClick={() => toggleTab('project')}
                    >
                        <FiGrid className="mr-3 text-gray-600" />
                        <span>Projet</span>
                        {openTab === 'project' ? <FiChevronDown className="ml-auto text-gray-600" /> : <FiChevronRight className="ml-auto text-gray-600" />}
                    </div>
                    <motion.div
                        initial={false}
                        animate={openTab === 'project' ? "open" : "closed"}
                        variants={{
                            open: { height: "auto", opacity: 1 },
                            closed: { height: 0, opacity: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="ml-8 space-y-2">
                            <div
                                className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
                                onClick={handleOpenMemberModal}
                            >
                                <span>Membres</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer">
                    <FiMessageCircle className="mr-3 text-gray-600" />
                    <span>Chat</span>
                </div>
            </nav>
            
            <div className="border-t border-gray-200 mt-8 pt-8">
                <div className="flex items-center mb-4 cursor-pointer" onClick={handleUserClick}>
                    <div style={{ background: gradient, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1rem', marginRight: '1rem' }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="ml-4">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                >
                    <FiLogOut className="mr-3" />
                    Log out
                </button>
            </div>

            {/* Modal pour les membres du projet */}
            <ProjectMemberModal
                isOpen={isMemberModalOpen}
                onClose={handleCloseMemberModal}
                projectUsers={projectUsers}
                currentUser={currentUser}
                setProjectUsers={setProjectUsers}
            />

            {/* Affichage du calendrier */}
            {showCalendar && createPortal(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl relative">
                        <button
                            onClick={handleCloseCalendar}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button>
                        <CalendarView tasks={tasks} />
                    </div>
                </div>,
                document.body
            )}
        </div>

    );
}