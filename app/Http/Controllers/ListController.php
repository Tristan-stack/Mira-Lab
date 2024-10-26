<?php

namespace App\Http\Controllers;

use App\Models\Lists;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Events\ListCreated;
use App\Events\ListDeleted;

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
            'project_id' => 'required|exists:projects,id', // Vérifie que le projet existe
        ]);

        // Créer une nouvelle liste avec les données validées
        $list = Lists::create($validatedData);

        broadcast(new ListCreated($list))->toOthers();

        // Renvoyer une réponse avec la liste créée
        return response()->json([
            'list' => $list->load('tasks'), // Inclut les tâches associées
            'message' => 'List created successfully!'
        ], 201);
    }



    public function show($projectId)
    {
        // Récupérer le projet avec ses listes et les tâches associées
        $project = Project::with(['lists.tasks', 'users'])->findOrFail($projectId);

        return response()->json($project);
    }


    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $list = Lists::findOrFail($id);
        $list->update($validatedData);

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