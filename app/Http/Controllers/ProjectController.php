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

    public function show(Request $request, $id)
    {
        $project = Project::with('tasks', 'users')->findOrFail($id);
        $currentUser = Auth::user(); // Récupérer l'utilisateur connecté

        // Vérifiez si l'utilisateur fait partie du projet
        if (!$project->users->contains($currentUser)) {
            return redirect('/profile')->with('error', 'Vous ne faites pas partie de ce projet.');
        }

        $projectId = $project->id;

        // Récupérer l'équipe associée au projet
        $team = $project->team; // Assurez-vous que la relation 'team' est définie dans le modèle Project

        // Récupérer les utilisateurs de l'équipe
        $teamUsers = $team->users; // Assurez-vous que la relation 'users' est définie dans le modèle Team

        // Vérifier si l'utilisateur actuel est le Board Leader du projet
        $isBoardLeader = $project->isBoardLeader($currentUser->id);

        return inertia('Project/Show', compact('project', 'currentUser', 'team', 'teamUsers', 'isBoardLeader', 'projectId')); // Renvoie la vue avec le projet, l'utilisateur actuel, l'équipe, les utilisateurs de l'équipe et le rôle de Board Leader
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

    public function updateTitle(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $project = Project::findOrFail($id);
        $project->update(['name' => $validated['name']]);

        return response()->json(['message' => 'Le titre du projet a été mis à jour avec succès.', 'project' => $project]);
    }

    public function updateVisibility(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Public,Privé',
        ]);

        $project = Project::findOrFail($id);
        $currentUser = $request->user();

        // Vérifier si l'utilisateur actuel est le Board Leader du projet
        if (!$project->isBoardLeader($currentUser->id)) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à mettre à jour la visibilité de ce projet.'], 403);
        }

        
        $project->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Visibilité du projet mise à jour avec succès.', 'project' => $project]);
    }

    // Supprimer un projet
    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        // Retirer tous les utilisateurs du projet
        $project->users()->detach();

        // Supprimer le projet
        $project->delete();

        return response()->json(['message' => 'Projet supprimé avec succès.']);
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

    public function leaveProject($id)
    {
        $project = Project::findOrFail($id);
        $userId = Auth::id();

        // Vérifier si l'utilisateur est membre du projet
        if (!$project->users()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Vous n\'êtes pas membre de ce projet.'], 403);
        }

        // Retirer l'utilisateur du projet
        $project->users()->detach($userId);

        return response()->json(['message' => 'Vous vous êtes retiré du projet avec succès.']);
    }
    public function joinPrivateProject(Request $request)
    {
        $validated = $request->validate([
            'project_code' => 'required|string|exists:projects,project_code',
            'user_id' => 'required|exists:users,id',
        ]);
    
        $project = Project::where('project_code', $validated['project_code'])->firstOrFail();
        $userId = $validated['user_id'];
    
        // Vérifier si l'utilisateur est membre de l'équipe associée au projet
        $team = $project->team;
        if (!$team->users()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Vous devez être membre de l\'équipe pour rejoindre ce projet.'], 400);
        }
    
        // Vérifier si l'utilisateur est déjà lié au projet
        if ($project->users()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Vous êtes déjà membre de ce projet.'], 400);
        }
    
        // Ajouter l'utilisateur au projet privé
        $project->users()->attach($userId);
    
        return response()->json(['message' => 'Vous avez rejoint le projet privé avec succès.']);
    }

    public function promoteUser(Request $request, $projectId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:Board Leader,Contributor',
        ]);

        $project = Project::findOrFail($projectId);
        $currentUser = $request->user();

        // Vérifier si l'utilisateur actuel est le Board Leader du projet
        if (!$project->isBoardLeader($currentUser->id)) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à promouvoir des rôles dans ce projet.'], 403);
        }

        // Mettre à jour le rôle de l'utilisateur dans le projet
        $project->users()->updateExistingPivot($validated['user_id'], ['role' => $validated['role']]);

        return response()->json(['message' => 'Rôle mis à jour avec succès.']);
    }

    public function downgrade(Request $request, $projectId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:Board Leader,Contributor',
        ]);

        $project = Project::findOrFail($projectId);
        $currentUser = $request->user();

        // Vérifier si l'utilisateur actuel est le Board Leader du projet
        if (!$project->isBoardLeader($currentUser->id)) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à rétrograder des rôles dans ce projet.'], 403);
        }

        // Mettre à jour le rôle de l'utilisateur dans le projet
        $project->users()->updateExistingPivot($validated['user_id'], ['role' => $validated['role']]);

        return response()->json(['message' => 'Rôle mis à jour avec succès.']);
    }
}
