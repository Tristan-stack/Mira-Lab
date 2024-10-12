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

    public function getUserTeams()
    {
        $user = Auth::user();
        $teams = $user->teams; // Assurez-vous que la relation 'teams' est bien définie dans le modèle User
        return response()->json($teams);
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

        // Créer le projet
        $project = Project::create($validated);

        // Ajouter l'utilisateur connecté à la table project_user avec le rôle "Board Leader"
        $userId = Auth::id(); // Récupérer l'ID de l'utilisateur connecté
        $project->users()->attach($userId, ['role' => 'Board Leader']); // Ajouter l'utilisateur avec le rôle "Board Leader"

        // Ajouter les utilisateurs de l'équipe associée sans inclure l'utilisateur créateur du projet
        $teamUsers = $project->team->users; // Récupérer les utilisateurs de l'équipe
        $userIds = $teamUsers->pluck('id')->toArray(); // Récupérer les IDs des utilisateurs de l'équipe

        // Filtrer les IDs pour exclure l'utilisateur créateur du projet
        $filteredUserIds = array_diff($userIds, [$userId]);

        // Ajouter chaque utilisateur avec le rôle "Contributor"
        foreach ($filteredUserIds as $teamUserId) {
            $project->users()->attach($teamUserId, ['role' => 'Contributor']);
        }

        return response()->json(['message' => 'Projet créé avec succès', 'project' => $project], 201);
    }



    // Afficher un projet spécifique
    public function show($id)
    {
        $project = Project::with('tasks', 'users')->findOrFail($id);
        $currentUser = Auth::user(); // Récupérer l'utilisateur connecté

        // Récupérer l'équipe associée au projet
        $team = $project->team; // Assurez-vous que la relation 'team' est définie dans le modèle Project

        // Récupérer les utilisateurs de l'équipe
        $teamUsers = $team->users; // Assurez-vous que la relation 'users' est définie dans le modèle Team

        return inertia('Project/Show', compact('project', 'currentUser', 'team', 'teamUsers')); // Renvoie la vue avec le projet, l'utilisateur actuel, l'équipe et les utilisateurs de l'équipe
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
