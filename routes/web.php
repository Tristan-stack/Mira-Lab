<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Route pour récupérer tous les utilisateurs sauf l'utilisateur connecté
    Route::get('/users', [ProfileController::class, 'index'])->name('users.index');

    Route::get('/teams/create', function () {
        // Charger tous les utilisateurs pour les sélectionner dans le formulaire
        $users = \App\Models\User::all();
        return Inertia::render('TeamCreate', ['users' => $users]);
    })->name('teams.create');

    // Routes des équipes
    Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::post('/teams-with-users', [TeamController::class, 'storeWithUsers'])->name('teams.storeWithUsers');
    Route::get('/teams/{id}', [TeamController::class, 'show'])->name('teams.show');
    Route::put('/teams/{id}', [TeamController::class, 'update'])->name('teams.update');
    Route::put('/teams/{id}/users', [TeamController::class, 'updateUsers'])->name('teams.updateUsers');
    Route::delete('/teams/{id}', [TeamController::class, 'destroy'])->name('teams.destroy');

    // Routes des projets
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{id}', [ProjectController::class, 'show'])->name('projects.show');
    Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Gestion des tâches liées aux projets
    Route::post('/projects/{id}/tasks', [ProjectController::class, 'attachTask'])->name('projects.attachTask');
    Route::delete('/projects/{id}/tasks', [ProjectController::class, 'detachTask'])->name('projects.detachTask');
    Route::get('/projects/{id}/tasks', [ProjectController::class, 'listTasks'])->name('projects.listTasks');

    // Routes des tâches
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/{id}', [TaskController::class, 'show'])->name('tasks.show');
    Route::put('/tasks/{id}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');
});

require __DIR__.'/auth.php';
