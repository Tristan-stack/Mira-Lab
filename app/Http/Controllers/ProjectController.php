<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

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

        $project = Project::create($validated);

        return response()->json(['message' => 'Projet créé avec succès', 'project' => $project], 201);
    }

    // Afficher un projet spécifique
    public function show($id)
    {
        $project = Project::with('tasks')->findOrFail($id);
        return response()->json($project);
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

        return response()->json(['message' => 'Projet supprimé avec succès']);
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
