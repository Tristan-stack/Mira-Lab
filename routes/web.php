<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


// Route pour la page de connexion
Route::get('/', function () {
    return Inertia::render('HomePage'); // Rediriger vers HomePage
});

Route::get('/dashboard', function () {
    return redirect('/profile');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/users', [ProfileController::class, 'index'])->name('users.index');

    Route::get('/teams/create', function () {
        $users = \App\Models\User::all();
        return Inertia::render('TeamCreate', ['users' => $users]);
    })->name('teams.create');

    // Routes des équipes
    Route::get('/teams', [TeamController::class, 'index'])->name('teams.index');
    Route::delete('/teams/{team_id}/remove-user/{user_id}', [TeamController::class, 'removeUser'])->name('teams.removeUser');
    Route::get('/teams/{id}', [TeamController::class, 'show'])->name('teams.show');
    Route::post('/teams/{teamId}/withdraw', [TeamController::class, 'withdraw'])->name('teams.withdraw');



    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::post('/teams-with-users', [TeamController::class, 'storeWithUsers'])->name('teams.storeWithUsers');
    Route::put('/teams/{id}', [TeamController::class, 'update'])->name('teams.update');
    Route::put('/teams/{id}/users', [TeamController::class, 'updateUsers'])->name('teams.updateUsers');
    Route::delete('/teams/{id}', [TeamController::class, 'destroy'])->name('teams.destroy');
    Route::delete('/teams/{id}/remove-user', [TeamController::class, 'removeUser'])->name('teams.removeUser');


    Route::get('/project/{id}', [ProjectController::class, 'show']);
    Route::delete('/project/{id}', [ProjectController::class, 'destroy']);






    // Routes des projets
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{id}', [ProjectController::class, 'show'])->name('projects.show');
    Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
    // Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');

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

