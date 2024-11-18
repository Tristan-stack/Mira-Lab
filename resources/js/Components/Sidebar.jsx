import React, { useEffect, useState } from 'react';
import {
  FiGrid,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiLogOut
} from 'react-icons/fi';
import axios from 'axios';
import NotificationMenu from './NotificationMenu'; 

// Fonction pour générer un gradient aléatoire
const getRandomGradient = () => {
  const colors = [
    '#FF5733', // Rouge
    '#33FF57', // Vert
    '#3357FF', // Bleu
    '#FF33A6', // Rose
    '#FFEB33', // Jaune
    '#33FFF6', // Cyan
    '#8A33FF', // Violet
  ];
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  let color2 = colors[Math.floor(Math.random() * colors.length)];
  while (color1 === color2) {
    color2 = colors[Math.floor(Math.random() * colors.length)];
  }
  return `linear-gradient(135deg, ${color1}, ${color2})`;
};

export default function Sidebar({ user }) {
  const [gradientStyle, setGradientStyle] = useState({});
  const [teams, setTeams] = useState([]);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [errorTeams, setErrorTeams] = useState(null);

  useEffect(() => {
    setGradientStyle({
      background: getRandomGradient(),
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1rem',
      marginRight: '1rem',
    });

  
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const response = await axios.get('/user/teams', {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, 
        });
        setTeams(response.data);
        setLoadingTeams(false);
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error);
        setErrorTeams('Impossible de charger les équipes.');
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDashboardClick = () => {
    window.location.href = '/profile';
  };

  const handleUserClick = () => {
    window.location.href = '/profile';
  };

  const toggleTeams = () => {
    setIsTeamsOpen(!isTeamsOpen);
  };

  return (
    <div className="bg-white h-screen p-4 shadow-md w-64 flex flex-col justify-between flex-shrink-0">
      <div>
        <div className="text-2xl font-bold text-purple-600 mb-8">Mira Labs</div>
        <nav className="space-y-4 w-full">
          <div
            className="w-full flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
            onClick={handleDashboardClick}
          >
            <FiGrid className="mr-3 text-gray-600" />
            <span>Dashboard</span>
          </div>
          
          {/* Section Teams avec sous-menu */}
          <div className="w-full">
            <div
              className="flex items-center p-2 hover:bg-gray-100 duration-300 rounded-md cursor-pointer"
              onClick={toggleTeams}
            >
              <FiUsers className="mr-3 text-gray-600" />
              <span className="flex-1">Teams</span>
              {isTeamsOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {isTeamsOpen && (
              <div className="ml-6 mt-2 space-y-2">
                {loadingTeams ? (
                  <div className="text-gray-500 p-2">Chargement...</div>
                ) : errorTeams ? (
                  <div className="text-red-500 p-2">{errorTeams}</div>
                ) : teams.length > 0 ? (
                  teams.map(team => (
                    <div
                      key={team.id}
                      className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer"
                      onClick={() => window.location.href = `/teams/${team.id}`}
                    >
                      {team.name}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 p-2">Vous n'appartenez à aucune équipe.</div>
                )}
              </div>
            )}
          </div>

          {/* Intégration du menu des notifications */}
          <div className="relative">
            <NotificationMenu currentUser={user} variant="sidebar" />
          </div>
        </nav>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center mb-4 cursor-pointer" onClick={handleUserClick}>
          <div style={gradientStyle}>
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <p className="font-bold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full duration-300 flex items-center text-gray-600 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
        >
          <FiLogOut className="mr-3" />
          Log out
        </button>
      </div>
    </div>
  );
}