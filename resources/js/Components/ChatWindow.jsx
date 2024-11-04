import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi'; // Importer l'icône d'envoi
import { motion, AnimatePresence } from 'framer-motion'; // Importer Framer Motion

const ChatWindow = ({ projectId, currentUser, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        axios.get(`/project/${projectId}/messages`)
            .then(response => {
                setMessages(response.data.messages);
                scrollToBottom();
            })
            .catch(error => {
                console.error('Error loading messages:', error);
            });
    }, [projectId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const channel = window.Echo.private(`project.${projectId}`);
        channel.listen('.message.sent', (event) => {
            setMessages((prevMessages) => [...prevMessages, event.message]);
            scrollToBottom();
        });

        return () => {
            channel.stopListening('.message.sent');
        };
    }, [projectId]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        axios.post(`/project/${projectId}/messages`, { message: newMessage })
            .then(response => {
                const newMsg = response.data.message;
                newMsg.user = { name: currentUser.name }; // Ajouter les informations de l'utilisateur
                setMessages([...messages, newMsg]);
                setNewMessage('');
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(e);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-16 right-4 bg-white border border-gray-300 rounded-xl shadow-lg w-80"
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-300 mb-1">
                    <h2 className="text-lg font-semibold">Team Chat</h2>
                    <button onClick={onClose} className="text-2xl text-red-600 hover:text-red-800 duration-150">&times;</button>
                </div>
                <div className="p-4 h-64 overflow-y-auto custom-scrollbar">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-2 p-2 rounded-full max-w-max ${message.user_id === currentUser.id ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-200 text-black self-start mr-auto'}`}>
                            <strong>{message.user ? message.user.name : 'Utilisateur inconnu'}:</strong> {message.message}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Message"
                        className="flex-grow p-2 border border-gray-300 rounded-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-800 duration-150">
                        <FiSend size={20} />
                    </button>
                </form>
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                `}</style>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatWindow;