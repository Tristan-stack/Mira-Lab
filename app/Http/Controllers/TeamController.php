<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Project;


class TeamController extends Controller
{
    /**
     * Display a listing of the teams.
     */
    public function index()
    {
        $teams = Team::with('users')->get(); // Charger les équipes avec leurs utilisateurs
        return inertia('Teams/Index', compact('teams'));
    }

    /**
     * Show the form for creating a new team.
     */
    public function create()
    {
        $currentUser = Auth::user(); // Récupérer l'utilisateur connecté
        $users = User::where('id', '!=', $currentUser->id)->get(); // Exclure l'utilisateur connecté

        return inertia('Teams/Create', [
            'users' => $users,
            'currentUser' => $currentUser,
        ]);
    }

    /**
     * Store a newly created team in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Team::create(['name' => $validated['name']]);

        return redirect()->route('teams.index')->with('success', 'Équipe créée avec succès.');
    }

    /**
     * Store a newly created team with selected users in storage.
     */
    public function storeWithUsers(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'users' => 'array',
            'users.*' => 'exists:users,id',
        ]);

        // Créer une nouvelle équipe
        $team = Team::create(['name' => $validated['name']]);

        // Récupérer l'utilisateur connecté
        $currentUserId = Auth::id();

        // Attacher l'utilisateur connecté à l'équipe en tant qu'admin
        $team->users()->attach($currentUserId, ['role' => 'admin']);

        // Filtrer les utilisateurs pour exclure l'utilisateur connecté
        $selectedUsers = array_filter($validated['users'], function ($userId) use ($currentUserId) {
            return $userId != $currentUserId; // Exclure l'utilisateur connecté
        });

        // Attacher les autres utilisateurs à l'équipe en tant que membre
        if (!empty($selectedUsers)) {
            $team->users()->attach($selectedUsers, ['role' => 'member']);
        }

        return redirect('/profile')->with('success', 'Équipe créée avec succès.');

    }


    /**
     * Display the specified team.
     */
    public function show($id)
    {
        $team = Team::with(['users' => function ($query) {
            $query->withPivot('role'); // Charger le rôle depuis la table pivot
        }, 'projects']) // Ajoutez la relation 'projects'
        ->findOrFail($id);

        $removeUserUrl = route('teams.removeUser', ['id' => $id]); // Génère l'URL de suppression de l'utilisateur
        $currentUser = Auth::user(); // Récupérer l'utilisateur connecté

        return inertia('Teams/Show', compact('team', 'removeUserUrl', 'currentUser'));
    }



    /**
     * Update the specified team in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'users' => 'array',
            'users.*' => 'exists:users,id',
        ]);

        $team = Team::findOrFail($id);
        $team->update(['name' => $validated['name']]); // Mettre à jour le nom de l'équipe

        // Récupérer l'utilisateur connecté
        $currentUserId = Auth::id();

        // Filtrer les utilisateurs pour exclure l'utilisateur connecté
        $selectedUsers = array_filter($validated['users'], function ($userId) use ($currentUserId) {
            return $userId != $currentUserId; // Exclure l'utilisateur connecté
        });

        // Synchroniser les utilisateurs de l'équipe
        $team->users()->sync($selectedUsers); // Cela met à jour les utilisateurs associés à l'équipe

        return redirect()->route('teams.index')->with('success', 'Équipe mise à jour avec succès.');
    }

    public function edit($id)
    {
        // Charger l'équipe avec ses utilisateurs et leurs rôles depuis la table pivot
        $team = Team::with(['users' => function ($query) {
            $query->withPivot('role'); // Charger le rôle depuis la table pivot
        }])->findOrFail($id); // Charger l'équipe

        $currentUser = Auth::user(); // Récupérer l'utilisateur connecté
        // Récupérer tous les utilisateurs sauf l'utilisateur connecté
        $users = User::where('id', '!=', $currentUser->id)->get();

        return Inertia::render('Teams/Edit', [
            'team' => $team,
            'users' => $users, // Passer tous les utilisateurs à la vue
            'currentUser' => $currentUser, // Passer l'utilisateur connecté à la vue
        ]);
    }

    /**
     * Update the users of the specified team.
     */
    public function updateUsers(Request $request, $id)
    {
        $validated = $request->validate([
            'users' => 'array',
            'users.*' => 'exists:users,id',
        ]);

        $team = Team::findOrFail($id);

        // Synchroniser les utilisateurs de l'équipe
        $team->users()->sync($validated['users']);

        return redirect()->route('teams.show', $team->id)->with('success', 'Membres de l\'équipe mis à jour avec succès.');
    }
    
    public function removeUser($teamId, Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $team = Team::findOrFail($teamId);
        $userId = $validated['user_id'];

        // Retirer l'utilisateur de l'équipe
        $team->users()->detach($userId);

        // Récupérer les projets associés à l'équipe
        $projects = Project::where('team_id', $team->id)->get();

        // Retirer l'utilisateur des projets associés
        foreach ($projects as $project) {
            $project->users()->detach($userId);
        }

        // Retourne une redirection Inertia vers la vue de l'équipe
        return Inertia::location(route('teams.show', $teamId));
    }
    public function withdraw(Request $request, $id)
    {
        // Valider la requête pour s'assurer que l'utilisateur ID est fourni
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id', // Vérifie que l'utilisateur existe
        ]);

        // Récupérer l'équipe par son ID
        $team = Team::findOrFail($id);
        $userId = $validated['user_id'];

        // Vérifier si l'utilisateur authentifié fait partie de l'équipe
        if ($team->users()->where('user_id', $userId)->exists()) {
            // Retirer l'utilisateur de l'équipe
            $team->users()->detach($userId);

            // Récupérer les projets associés à l'équipe
            $projects = Project::where('team_id', $team->id)->get();

            // Retirer l'utilisateur des projets privés
            $privateProjects = $projects->where('status', 'Privé');
            foreach ($privateProjects as $project) {
                $project->users()->detach($userId);
            }

            return response()->json(['message' => 'Vous vous êtes retiré de l\'équipe et des projets privés associés.']);
        }

        return response()->json(['message' => 'L\'utilisateur ne fait pas partie de cette équipe.'], 400);
    }



    public function getTeamProjects($id)
    {
        // Récupérer l'équipe par son ID
        $team = Team::findOrFail($id);

        // Récupérer les projets associés à l'équipe
        $projects = Project::where('team_id', $team->id)->with('users')->get();

        return response()->json($projects);
    }


    /**
     * Remove the specified team from storage.
     */

    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->users()->detach(); // Détache tous les utilisateurs de l'équipe
        $team->delete(); // Supprime l'équipe

        return response()->json(['message' => 'Équipe supprimée avec succès.'], 200); // Retourne une réponse JSON
    }


}