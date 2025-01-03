<?php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Events\CounterUpdated;
use App\Events\TestEvent;
use Illuminate\Http\Request;
use App\Http\Controllers\ListController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserActivityController;


// Route pour la page de connexion
Route::get('/', function () {
    return Inertia::render('Accueil'); // Rediriger vers Accueil
});

// Route pour HomePage
Route::get('/home', function () {
    return Inertia::render('HomePage'); // Rediriger vers HomePage
})->name('home');

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
    Route::get('/user/teams', [TeamController::class, 'getUserTeams'])->name('teams.user');
    Route::delete('/teams/{team_id}/remove-user/{user_id}', [TeamController::class, 'removeUser'])->name('teams.removeUser');
    Route::get('/teams/{id}', [TeamController::class, 'show'])->name('teams.show');
    Route::post('/teams/{teamId}/withdraw', [TeamController::class, 'withdraw'])->name('teams.withdraw');
    Route::delete('/teams/{id}', [TeamController::class, 'destroy'])->name('teams.destroy');
    Route::post('/teams/join', [TeamController::class, 'joinTeam'])->name('teams.join');


    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
    Route::post('/teams-with-users', [TeamController::class, 'storeWithUsers'])->name('teams.storeWithUsers');
    Route::put('/teams/{id}', [TeamController::class, 'update'])->name('teams.update');
    Route::put('/teams/{id}/users', [TeamController::class, 'updateUsers'])->name('teams.updateUsers');
    
    Route::delete('/teams/{id}/remove-user', [TeamController::class, 'removeUser'])->name('teams.removeUser');

    Route::get('/user/teams', [ProjectController::class, 'getUserTeams']);
    Route::get('/teams/{id}/projects', [TeamController::class, 'getTeamProjects']);

    Route::get('/project/{id}', [ProjectController::class, 'show']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    Route::post('/projects/join', [ProjectController::class, 'joinPrivateProject'])->name('projects.join');

    // Routes des projets
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{id}', [ProjectController::class, 'show'])->name('projects.show');
    Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
    Route::put('/projects/{id}/update-title', [ProjectController::class, 'updateTitle'])->name('projects.updateTitle');
    Route::put('/projects/{id}/update-visibility', [ProjectController::class, 'updateVisibility'])->name('projects.updateVisibility');
    Route::post('/projects/{id}/leave', [ProjectController::class, 'leaveProject'])->name('projects.leave');
    Route::post('/projects/{id}/promote' , [ProjectController::class, 'promoteUser'])->name('projects.promote');
    Route::post('/projects/{id}/downgrade' , [ProjectController::class, 'downgrade'])->name('projects.downgrade');
    Route::get('/user/projects', [ProjectController::class, 'userProjects']);

    // Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Gestion des tâches liées aux projets
    Route::post('/projects/{id}/tasks', [ProjectController::class, 'attachTask'])->name('projects.attachTask');
    Route::delete('/projects/{id}/tasks', [ProjectController::class, 'detachTask'])->name('projects.detachTask');
    Route::get('/projects/{id}/tasks', [ProjectController::class, 'listTasks'])->name('projects.listTasks');

    // Routes des tâches

    Route::get('/project/{project}/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/{taskId}', [TaskController::class, 'show'])->name('tasks.show');
    Route::put('/projects/{projectId}/tasks/{taskId}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::post('/projects/{projectId}/tasks/{taskId}/add-dependency', [TaskController::class, 'addDependency']);
    Route::put('/projects/{projectId}/tasks/{taskId}/update-status', [TaskController::class, 'updateStatus']);
    Route::delete('/projects/{projectId}/tasks/{taskId}/remove-dependency', [TaskController::class, 'removeDependency']);

    Route::post('/project/{project}/tasks', [TaskController::class, 'store']);
    Route::delete('/project/{project}/tasks/{task}', [TaskController::class, 'destroy']);
    Route::put('/project/{project}/tasks/{task}', [TaskController::class, 'update']);

    Route::post('/project/{project}/lists', [ListController::class, 'store']);
    Route::get('/project/{project}/lists', [ListController::class, 'index']);
    Route::put('/project/{project}/lists/{id}', [ListController::class, 'update']);
    Route::delete('/project/{project}/lists/{id}', [ListController::class, 'destroy']);


    Route::post('/trigger-event', function (Request $request) {
    event(new TestEvent());
    return response()->json(['message' => 'Event triggered']);
    });

    Route::post('/update-counter', function (Request $request) {
    $counter = $request->input('counter');
    // Diffuse l'événement
    event(new CounterUpdated($counter));
    return response()->json(['counter' => $counter, 'message' => 'Counter updated']);
    });


    Route::middleware(['auth'])->group(function () {
        Route::get('/project/{projectId}/messages', [MessageController::class, 'index'])->name('messages.index');
        Route::post('/project/{projectId}/messages', [MessageController::class, 'store'])->name('messages.store');
    });

    Route::get('/notifications', [NotificationController::class, 'getUserNotifications']);
    Route::post('/notifications/{notificationId}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{notificationId}', [NotificationController::class, 'deleteNotification']);

    Route::get('/user/activities', [UserActivityController::class, 'getUserActivities']);

});

require __DIR__.'/auth.php';

