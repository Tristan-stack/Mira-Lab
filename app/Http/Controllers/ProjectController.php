<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    // Afficher la liste des projets
    public function index()
    {
        $projects = Project::with('tasks')->get();
        return response()->json($projects);
    }

    // Créer un nouveau projet
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|string|max:255',
            'team_id' => 'required|exists:teams,id',
        ]);

        // Créer le projet une seule fois
        $project = Project::create($validated);

        $teamsDisponibles = Auth::user()->teams->pluck('id')->toArray(); // Récupérer les IDs des équipes de l'utilisateur connecté

        // Ajouter l'utilisateur connecté à la table project_user avec le rôle "Board Leader"
        $userId = Auth::id(); // Récupère l'ID de l'utilisateur connecté
        $project->users()->attach($userId, ['role' => 'Board Leader']); // Ajoute l'utilisateur avec le rôle "Board Leader"

        // Ajouter les utilisateurs de l'équipe associée sans créer de doublons
        $teamUsers = $project->team->users; // Récupérer les utilisateurs de l'équipe
        $userIds = $teamUsers->pluck('id')->toArray(); // Récupérer les IDs des utilisateurs de l'équipe

        // Préparer les données pour l'attachement
        $projectUsers = array_map(function ($id) {
            return ['user_id' => $id, 'role' => 'Contributor']; // Attribuer le rôle "Contributor" aux autres utilisateurs
        }, $userIds);

        // Éviter d'attacher plusieurs fois les mêmes utilisateurs
        // On supprime l'utilisateur qui a créé le projet de la liste pour ne pas le ré-attacher
        $project->users()->syncWithoutDetaching($projectUsers);

        return response()->json(['message' => 'Projet créé avec succès', 'project' => $project], 201);
    }


    // Afficher un projet spécifique
    // Afficher un projet spécifique
    public function show($id)
    {
        $project = Project::with('tasks', 'users')->findOrFail($id);
        $currentUser = Auth::user(); // Récupérer l'utilisateur connecté

        return inertia('Project/Show', compact('project', 'currentUser')); // Renvoie la vue avec le projet et l'utilisateur actuel
    }

    // Mettre à jour un projet
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|string|max:255',
            'team_id' => 'required|exists:teams,id',
        ]);

        $project = Project::findOrFail($id);
        $project->update($validated);

        return response()->json(['message' => 'Projet mis à jour avec succès', 'project' => $project]);
    }

    // Supprimer un projet
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        // Redirige vers la page de profil avec un message flash
        return redirect()->route('profile')->with('message', 'Projet supprimé avec succès');
    }


    // Attacher une tâche à un projet
    public function attachTask(Request $request, $projectId)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
        ]);

        $project = Project::findOrFail($projectId);
        $project->tasks()->attach($validated['task_id']);

        return response()->json(['message' => 'Tâche liée au projet avec succès']);
    }

    // Détacher une tâche d'un projet
    public function detachTask(Request $request, $projectId)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
        ]);

        $project = Project::findOrFail($projectId);
        $project->tasks()->detach($validated['task_id']);

        return response()->json(['message' => 'Tâche détachée du projet avec succès']);
    }

    // Liste des tâches liées à un projet
    public function listTasks($projectId)
    {
        $project = Project::with('tasks')->findOrFail($projectId);
        return response()->json($project->tasks);
    }
}
