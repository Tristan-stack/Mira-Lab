<?php

// ProfileController.php
// ProfileController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Requests\ProfileUpdateRequest;

class ProfileController extends Controller
{
    // Méthode pour lister tous les utilisateurs (inchangée)
    public function index(Request $request)
    {
        $users = User::where('id', '!=', Auth::id())
                 ->select('id', 'name', 'img_profile', 'created_at')
                 ->get();

        return response()->json($users);
    }

    // Nouvelle méthode pour afficher le profil utilisateur avec équipes et projets
    // ProfileController.php

    public function show(Request $request)
    {
        // Récupérer l'utilisateur connecté
        $user = Auth::user();

        // Récupérer les équipes et projets de l'utilisateur
        $teams = $user->teams; // Récupérer les équipes liées à l'utilisateur
        $projects = $user->projects; // Récupérer les projets liés à l'utilisateur

        // Retourner la vue avec les données
        return Inertia::render('Profile/Show', [
            'user' => $user,
            'teams' => $teams,
            'projects' => $projects,
        ]);
    }


    // Méthode existante pour éditer le profil (inchangée)
    public function edit(Request $request): \Inertia\Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    // Méthode existante pour mettre à jour le profil (inchangée)
    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Valider les données du formulaire
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        // Mettre à jour les informations de l'utilisateur
        $user->fill($validatedData);
        $user->save();

        // Retourner une réponse JSON
        return response()->json(['message' => 'Profil mis à jour avec succès.']);
    }



    // Méthode existante pour supprimer le compte utilisateur (inchangée)
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
