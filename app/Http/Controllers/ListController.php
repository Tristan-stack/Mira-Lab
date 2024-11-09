<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lists;
use App\Models\Project;
use App\Models\Notification;
use App\Events\ListCreated;
use App\Events\ListDeleted;
use App\Events\ListUpdated;
use Illuminate\Support\Facades\Auth;

class ListController extends Controller
{

    public function index($projectId)
    {
        $lists = Lists::where('project_id', $projectId)->get();

        return response()->json([
            'lists' => $lists,
        ]);
    }
    public function store(Request $request)
    {
        // Valider les données de la requête
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string',
            'project_id' => 'required|exists:projects,id',
        ]);

        // Créer une nouvelle liste
        $list = Lists::create($validatedData);

        // Récupérer le projet avec ses utilisateurs
        $project = Project::with('users')->find($validatedData['project_id']);

        // Obtenir tous les utilisateurs du projet sauf le créateur de la liste
        $projectUsers = $project->users->where('id', '!=', Auth::id());

        // Créer la notification
        $notification = Notification::create([
            'text' => 'Nouvelle liste créée : ' . $list->name,
            'user_id' => Auth::id(), // L'utilisateur qui a créé la notification
            'list_id' => $list->id,
        ]);

        // Associer la notification aux utilisateurs (sauf le créateur)
        foreach ($projectUsers as $user) {
            $notification->users()->attach($user->id, ['status' => 'unread']);
        }

        // Diffuser l'événement ListCreated
        broadcast(new ListCreated($list))->toOthers();

        // Renvoyer une réponse
        return response()->json([
            'list' => $list->load('tasks'),
            'message' => 'List created successfully!',
        ], 201);
    }



    public function show($projectId)
    {
        // Récupérer le projet avec ses listes et les tâches associées
        $project = Project::with(['lists.tasks', 'users'])->findOrFail($projectId);

        return response()->json($project);
    }
    public function update(Request $request, $projectId, $id)
    {
        // Valider les données de la requête
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);
    
        // Trouver la liste correspondante au projet et à l'ID
        $list = Lists::where('project_id', $projectId)->findOrFail($id);
    
        // Mettre à jour la liste avec les données validées
        // dd($validatedData);

        $list->update($validatedData);
    
        // Diffuser l'événement ListUpdated
        broadcast(new ListUpdated($list))->toOthers();
    
        // Retourner une réponse JSON avec la liste mise à jour et un message de succès
        return response()->json([
            'list' => $list,
            'message' => 'List updated successfully!'
        ]);
    }

    public function destroy($projectId, $id)
    {
        $list = Lists::where('project_id', $projectId)->findOrFail($id);

        broadcast(new ListDeleted($list))->toOthers();

        $list->delete();

        return response()->json([
            'message' => 'List deleted successfully!'
        ]);
    }
}