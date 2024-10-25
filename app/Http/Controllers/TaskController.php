<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use App\Events\TaskUpdated;

class TaskController extends Controller
{

    public function store(Request $request)
    {
        // Valider les données de la requête
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'dependencies' => 'nullable|exists:tasks,id',
        ]);

        // Ajouter l'ID de l'utilisateur authentifié aux données validées
        $validatedData['user_id'] = Auth::id();

        // Créer une nouvelle tâche avec les données validées
        $task = Task::create($validatedData);

        broadcast(new TaskCreated($task))->toOthers();

        // Renvoyer une réponse avec la tâche créée
        return response()->json([
            'task' => $task,
            'message' => 'Task created successfully!'
        ], 201);
    }

    public function update(Request $request, $projectId, $taskId)
    {
        // Validation des données
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Trouver et mettre à jour la tâche
        $task = Task::where('project_id', $projectId)->findOrFail($taskId);
        $task->update($validatedData);

        // Diffuser l'événement de mise à jour de la tâche
        broadcast(new TaskUpdated($task))->toOthers();

        // Retourner la tâche mise à jour en réponse JSON
        return response()->json([
            'message' => 'Task updated successfully!',
            'task' => $task
        ], 200);
    }

    public function destroy($projectId, $taskId)
    {
        // Trouver la tâche par ID et vérifier qu'elle appartient au projet
        $task = Task::where('project_id', $projectId)->findOrFail($taskId);

        broadcast(new TaskDeleted($task))->toOthers();

        // Supprimer la tâche
        $task->delete();


        // Renvoyer une réponse de succès
        return response()->json([
            'message' => 'Task deleted successfully!'
        ], 200);
    }
}