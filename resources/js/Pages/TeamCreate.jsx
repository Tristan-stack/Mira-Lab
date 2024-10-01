import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

export default function TeamCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        users: [],
    });

    const [users, setUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Il y a eu un problème avec l\'appel à l\'API :', error);
            });
    }, []);

    useEffect(() => {
        // Mettre à jour le champ `users` chaque fois que `teamMembers` change
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/teams-with-users', data);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Créer une nouvelle équipe</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom de l'équipe
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex mb-4">
                        <Droppable droppableId="available-users">
                            {(provided) => (
                                <div
                                    className="flex-1 border rounded-md p-2 mr-2"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className="font-semibold">Utilisateurs disponibles</h2>
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-2 mb-2 border rounded-md"
                                    />
                                    <div className="max-h-24 overflow-y-auto">
                                        {filteredUsers.map((user, index) => (
                                            <Draggable key={user.id} draggableId={user.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div
                                                        className="p-2 border-b cursor-pointer"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {user.name}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        <Droppable droppableId="team-members">
                            {(provided) => (
                                <div
                                    className="flex-1 border rounded-md p-2"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className="font-semibold">Membres de l'équipe</h2>
                                    {teamMembers.map((member, index) => (
                                        <Draggable key={member.id} draggableId={member.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="p-2 border-b"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {member.name}
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Créer l'équipe
                    </button>
                </div>
            </form>
        </div>
    );
}
