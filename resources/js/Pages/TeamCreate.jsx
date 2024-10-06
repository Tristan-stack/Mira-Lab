import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { motion } from 'framer-motion'; // Assurez-vous d'importer motion
import './custom-style/styles.css';

export default function TeamCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        users: [],
    });

    const [users, setUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        axios.get('/user')
            .then(response => {
                setUsername(response.data.name);
            })
            .catch(error => {
                console.error('Il y a eu un problème avec l\'appel à l\'API :', error);
            });

        axios.get('/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Il y a eu un problème avec l\'appel à l\'API :', error);
            });
    }, []);

    useEffect(() => {
        setData('users', teamMembers.map(member => member.id));
    }, [teamMembers]);

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === 'available-users' && destination.droppableId === 'team-members') {
            const user = users[source.index];
            setTeamMembers(prev => [...prev, user]);
            setUsers(prev => prev.filter((_, index) => index !== source.index));
        } else if (source.droppableId === 'team-members' && destination.droppableId === 'available-users') {
            const member = teamMembers[source.index];
            setUsers(prev => [...prev, member]);
            setTeamMembers(prev => prev.filter((_, index) => index !== source.index));
        }
    };

    const handleRemoveMember = (member) => {
        setTeamMembers(prev => prev.filter(m => m.id !== member.id));
        setUsers(prev => [...prev, member]);
    };

    const handleDoubleClickUser = (user) => {
        setTeamMembers(prev => [...prev, user]);
        setUsers(prev => prev.filter(u => u.id !== user.id));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }} // Opacité initiale
            animate={{ opacity: 1 }} // Opacité finale
            exit={{ opacity: 0 }} // Opacité lors de la sortie
            transition={{ duration: 0.5 }} // Durée de la transition
            className="mx-auto bg-white rounded-lg max-w-md w-full p-8"
            style={{ boxShadow: '0px 0px 41px 13px rgba(0,0,0,0.1)' }}
        >
            <h1 className="gradient-title text-center mb-6">Créer ta team</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                post('/teams-with-users', data);
            }}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom de l'équipe
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>

                <div className="mb-4">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        Rechercher un utilisateur
                    </label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Rechercher par nom"
                    />
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex mb-4">
                        <Droppable droppableId="available-users">
                            {(provided) => (
                                <div
                                    className="flex-1 border rounded-md p-2 mr-2 max-w-md"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{ overflow: 'visible' }}
                                >
                                    <h2 className="font-semibold">Utilisateurs disponibles</h2>
                                    <div className="overflow-y-auto max-h-40 min-h-20">
                                        {filteredUsers.map((user, index) => (
                                            <Draggable key={user.id} draggableId={user.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`p-2 border-b cursor-pointer ${snapshot.isDragging ? 'dragging' : ''
                                                            }`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onDoubleClick={() => handleDoubleClickUser(user)}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            position: snapshot.isDragging ? 'absolute' : 'relative',
                                                        }}
                                                    >
                                                        {user.name}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>

                        <Droppable droppableId="team-members">
                            {(provided) => (
                                <div
                                    className="flex-1 border rounded-md p-2 h-40 overflow-y-auto"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{ overflow: 'visible' }}
                                >
                                    <h2 className="font-semibold">Membres de l'équipe</h2>
                                    {teamMembers.map((member, index) => (
                                        <Draggable key={member.id} draggableId={member.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`p-2 border-b flex items-center justify-between ${snapshot.isDragging ? 'dragging' : ''
                                                        }`}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        position: snapshot.isDragging ? 'absolute' : 'relative',
                                                    }}
                                                >
                                                    {member.name}
                                                    <button
                                                        onClick={() => handleRemoveMember(member)}
                                                        className="text-red-500 ml-2"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md w-full"
                    >
                        Créer la team
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
