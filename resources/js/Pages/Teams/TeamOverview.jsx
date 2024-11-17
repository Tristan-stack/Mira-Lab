import React, { useState } from 'react';
import { FaPen, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const TeamOverview = ({
  team,
  currentUser,
  handleDeleteTeam,
  handleCopyInviteCode,
  handleRemoveUser,
  handleUpdateTeamTitle,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [teamTitle, setTeamTitle] = useState(team.name);
  const [currentTab, setCurrentTab] = useState(0);

  const usersPerPage = 4;
  const userChunks = chunkArray(team?.users || [], usersPerPage);

  const currentUserRoleInTeam = team?.users?.find(user => user.id === currentUser.id)?.pivot?.role;

  const handleNextTab = () => {
    setCurrentTab((prevTab) => (prevTab + 1) % userChunks.length);
  };

  const handlePrevTab = () => {
    setCurrentTab((prevTab) => (prevTab - 1 + userChunks.length) % userChunks.length);
  };

  // Tableau des dégradés
  const gradientColors = [
    "linear-gradient(to right, #2193b0, #6dd5ed)", // bleu
    "linear-gradient(to right, #ff758c, #ff7eb3)", // rose
    "linear-gradient(to right, #cc2b5e, #753a88)", // violet
    "linear-gradient(to right, #56ab2f, #a8e063)", // vert
    "linear-gradient(to right, #ff7e5f, #feb47b)", // orange
    "linear-gradient(to right, #f7971e, #ffd200)", // jaune
  ];

  return (
    <div className="flex justify-center space-x-6 p-6 h-2/3">
      {/* Carte de l'équipe */}
      <div className="team-view bg-white p-8 rounded-lg shadow-xl w-1/3">
        <div className="flex flex-col items-center space-y-8">
          {/* Icône et Titre de l'équipe */}
          <div className="flex items-center space-x-4">
            <div
              className="team-icon flex-shrink-0"
              style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                width: "60px",
                height: "60px",
                borderRadius: "12px",
              }}
            ></div>
            {isEditingTitle ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={teamTitle}
                  onChange={(e) => setTeamTitle(e.target.value)}
                  className="text-2xl font-semibold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition w-full max-w-xs"
                />
                <button
                  className="ml-3 px-3 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                  onClick={() => {
                    handleUpdateTeamTitle(teamTitle);
                    setIsEditingTitle(false);
                  }}
                >
                  Enregistrer
                </button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <span>{teamTitle}</span>
                {currentUserRoleInTeam === "admin" && (
                  <FaPen
                    className="text-gray-500 hover:text-green-500 cursor-pointer transition"
                    onClick={() => setIsEditingTitle(true)}
                  />
                )}
              </h2>
            )}
          </div>

          {/* Sous-titre et description */}
          <h3 className="text-lg text-gray-600 font-medium">
            Votre espace membre !
          </h3>
          <p className="text-gray-500 text-center leading-relaxed max-w-md">
            Les membres d'espaces de travail peuvent consulter et rejoindre tous les
            tableaux visibles par les membres d'un espace de travail et peuvent créer
            de nouveaux tableaux au sein de l'espace de travail.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col space-y-6 items-center">
            <div className="space-x-3">
              <button
                className="invite-btn bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
                onClick={handleCopyInviteCode}
              >
                Copier le code d'invitation
              </button>
              <button
                className="invite-btn bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition"
                onClick={() => {
                  // Logique pour rejoindre un projet privé
                }}
              >
                Rejoindre un projet privé
              </button>
            </div>
            {currentUserRoleInTeam === "admin" && (
              <button
                className="delete-team-btn bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition"
                onClick={handleDeleteTeam}
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grille des utilisateurs */}
      <div className="w-2/3 flex flex-col items-center">
        {/* Boutons de navigation */}
        <div className="flex justify-center mb-4 space-x-6">
          <button
            className="flex items-center justify-center bg-purple-600/10 border border-purple-600 text-purple-800 py-2 px-4 rounded-md hover:bg-purple-600 hover:text-white transition"
            onClick={handlePrevTab}
          >
            <FaArrowLeft />
          </button>
          <button
            className="flex items-center justify-center bg-purple-600/10 border border-purple-600 text-purple-800 py-2 px-4 rounded-md hover:bg-purple-600 hover:text-white transition"
            onClick={handleNextTab}
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Cartes des utilisateurs */}
        <div className="grid grid-cols-2 gap-6">
          {userChunks[currentTab]?.map((user) => {
            // Assigner un dégradé unique à chaque utilisateur
            const gradientIndex = user.id % gradientColors.length;
            const gradientStyle = gradientColors[gradientIndex];

            return (
              <div
                key={user.id}
                className="relative bg-white border p-6 rounded-md shadow-sm flex flex-col items-center space-y-4 w-48 h-48"
              >
                {/* Bouton pour supprimer (admin seulement) */}
                {currentUserRoleInTeam === "admin" && user.pivot.role !== "admin" && (
                  <button
                    className="absolute top-2 right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-700 transition text-sm"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    ×
                  </button>
                )}

                {/* Cercle avec initiale */}
                <div
                  className="w-14 h-14 text-white flex items-center justify-center rounded-full text-xl font-bold"
                  style={{ background: gradientStyle }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Informations utilisateur */}
                <div className="text-center">
                  <h4 className="text-md font-medium truncate">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.pivot.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;