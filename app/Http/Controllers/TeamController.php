<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        // Filtrer les utilisateurs pour exclure l'utilisateur connecté
        $selectedUsers = array_filter($validated['users'], function ($userId) use ($currentUserId) {
            return $userId != $currentUserId; // Exclure l'utilisateur connecté
        });

        // Attacher les utilisateurs à l'équipe
        if (!empty($selectedUsers)) {
            $team->users()->attach($selectedUsers);
        }

        // Attacher l'utilisateur connecté à l'équipe
        $team->users()->attach($currentUserId);

        return redirect()->route('teams.index')->with('success', 'Équipe créée avec succès.');
    }

    /**
     * Display the specified team.
     */
    public function show($id)
    {
        $team = Team::with('users')->findOrFail($id);
        $removeUserUrl = route('teams.removeUser', ['id' => $id]); // Génère l'URL de suppression de l'utilisateur

        return inertia('Teams/Show', compact('team', 'removeUserUrl'));
    }


    /**
     * Update the specified team in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $team = Team::findOrFail($id);
        $team->update(['name' => $validated['name']]);

        return redirect()->route('teams.index')->with('success', 'Équipe mise à jour avec succès.');
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
        $team->users()->detach($validated['user_id']);

        return response()->json(['message' => 'Utilisateur dissocié avec succès']);
    }



    /**
     * Remove the specified team from storage.
     */
    public function destroy($id)
    {
        $team = Team::findOrFail($id);
        $team->delete();

        return redirect()->route('teams.index')->with('success', 'Équipe supprimée avec succès.');
    }
}