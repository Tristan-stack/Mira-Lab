import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Assurez-vous d'importer ces composants

export default function TeamCreate({ user, onAddTeam, users }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        users: [],
    });
    const [availableUsers, setAvailableUsers] = useState(users || []); // Utilisez cet état pour les utilisateurs disponibles
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Met à jour les données du formulaire avec les membres de l'équipe sélectionnés
        setData('users', teamMembers.map(member => member.id));
    }, [teamMembers]);

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === 'available-users' && destination.droppableId === 'team-members') {
            const user = availableUsers[source.index];
            setTeamMembers(prev => [...prev, user]);
            setAvailableUsers(prev => prev.filter((_, index) => index !== source.index));
        } else if (source.droppableId === 'team-members' && destination.droppableId === 'available-users') {
            const member = teamMembers[source.index];
            setAvailableUsers(prev => [...prev, member]);
            setTeamMembers(prev => prev.filter((_, index) => index !== source.index));
        }
    };

    const handleRemoveMember = (member) => {
        setTeamMembers(prev => prev.filter(m => m.id !== member.id));
        setAvailableUsers(prev => [...prev, member]);
    };

    const handleDoubleClickAddUser = (user) => {
        setTeamMembers(prev => [...prev, user]);
        setAvailableUsers(prev => prev.filter(u => u.id !== user.id));
    };

    const filteredUsers = Array.isArray(availableUsers) ? availableUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/teams-with-users', {
            ...data,
            onSuccess: (newTeam) => {
                toast.success('Équipe créée avec succès !'); // Notification de succès
                setData({ name: '', users: [] }); // Réinitialisation des données du formulaire
                setTeamMembers([]); // Réinitialisation des membres de l'équipe
                if (onAddTeam) {
                    onAddTeam(newTeam);
                }
            },
            onError: () => {
                toast.error('Erreur lors de la création de l\'équipe.'); // Notification d'erreur
            },
        });
    };

    return (
        <div className="mx-auto bg-white rounded-lg max-w-md w-full p-8"
            style={{ boxShadow: '0px 0px 41px 13px rgba(0,0,0,0.1)' }}>
            <h1 className="gradient-title text-center mb-6">Créer ta team</h1>
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
                                >
                                    <h2 className="font-semibold">Utilisateurs disponibles</h2>
                                    <div className="overflow-y-auto max-h-40 min-h-20">
                                        {filteredUsers.map((user, index) => (
                                            <Draggable key={user.id} draggableId={user.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`p-2 border-b cursor-pointer ${snapshot.isDragging ? 'dragging' : ''}`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onDoubleClick={() => handleDoubleClickAddUser(user)}
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
                                >
                                    <h2 className="font-semibold">Membres de l'équipe</h2>
                                    {teamMembers.map((member, index) => (
                                        <Draggable key={member.id} draggableId={member.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`p-2 border-b flex items-center justify-between ${snapshot.isDragging ? 'dragging' : ''}`}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
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
        </div>
    );
}
