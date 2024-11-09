<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Notification;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\TaskCreated;
use App\Events\TaskDeleted;
use App\Events\TaskUpdated;


class TaskController extends Controller
{
    public function index($projectId)
    {
        $tasks = Task::where('project_id', $projectId)->get();
    
        return response()->json([
            'tasks' => $tasks,
        ]);
    }

    public function show($taskId)
    {
        try {
            $task = Task::findOrFail($taskId);
    
            return response()->json([
                'task' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching task details',
                'error' => $e->getMessage()
            ], 500);
        }
    }
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
            'lists_id' => 'required|exists:lists,id',
            'dependencies' => 'nullable|exists:tasks,id',
        ]);

        // Ajouter l'ID de l'utilisateur authentifié
        $validatedData['user_id'] = Auth::id();

        // Créer une nouvelle tâche
        $task = Task::create($validatedData);

        // Récupérer le projet avec ses utilisateurs
        $project = Project::with('users')->find($validatedData['project_id']);

        // Obtenir tous les utilisateurs du projet sauf le créateur de la tâche
        $projectUsers = $project->users->where('id', '!=', Auth::id());

        // Créer la notification
        $notification = Notification::create([
            'text' => 'Nouvelle tâche créée : ' . $task->name,
            'user_id' => Auth::id(), // L'utilisateur qui a créé la notification
            'task_id' => $task->id,
            'list_id' => $task->lists_id,
        ]);

        // Associer la notification aux utilisateurs (sauf le créateur)
        foreach ($projectUsers as $user) {
            $notification->users()->attach($user->id, ['status' => 'unread']);
        }

        // Diffuser l'événement TaskCreated
        broadcast(new TaskCreated($task))->toOthers();

        // Renvoyer une réponse
        return response()->json([
            'task' => $task,
            'message' => 'Task created successfully!',
        ], 201);
    }
    public function update(Request $request, $projectId, $taskId)
    {
        // Validation des données
        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'lists_id' => 'sometimes|exists:lists,id',
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

        // Diffuser l'événement de suppression de la tâche
        broadcast(new TaskDeleted($task))->toOthers();

        // Supprimer la tâche
        $task->delete();

        // Renvoyer une réponse de succès
        return response()->json([
            'message' => 'Task deleted successfully!'
        ], 200);
    }

    public function addDependency(Request $request, $projectId, $taskId)
    {
        // Validation des données
        $validatedData = $request->validate([
            'dependencies' => 'nullable|exists:tasks,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);
    
        // Trouver la tâche
        $task = Task::where('project_id', $projectId)->findOrFail($taskId);
    
        // Mettre à jour les champs si présents
        if (isset($validatedData['dependencies'])) {
            $task->dependencies = $validatedData['dependencies'];
        }
        if (isset($validatedData['start_date'])) {
            $task->start_date = $validatedData['start_date'];
        }
        if (isset($validatedData['end_date'])) {
            $task->end_date = $validatedData['end_date'];
        }
    
        // Vérifier si la date de fin est passée et mettre à jour le statut
        if (isset($validatedData['end_date']) && new \DateTime($validatedData['end_date']) < new \DateTime()) {
            $task->status = 'Fini';
        }
    
        $task->save();
    
        // Diffuser l'événement de mise à jour de la tâche
        broadcast(new TaskUpdated($task))->toOthers();
    
        // Retourner la tâche mise à jour en réponse JSON
        return response()->json([
            'message' => 'Task updated successfully!',
            'task' => $task
        ], 200);
    }

    public function removeDependency($projectId, $taskId)
    {
        // Trouver la tâche et supprimer la dépendance
        $task = Task::where('project_id', $projectId)->findOrFail($taskId);
        $task->dependencies = null;
        $task->save();

        // Diffuser l'événement de mise à jour de la tâche
        broadcast(new TaskUpdated($task))->toOthers();

        // Retourner la tâche mise à jour en réponse JSON
        return response()->json([
            'message' => 'Dependency removed successfully!',
            'task' => $task
        ], 200);
    }
}