<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Project;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Broadcast::channel('test-channel', function ($user) {
//     return true;
// });

Broadcast::channel('project.{projectId}', function ($user, $projectId) {
    return Project::find($projectId)->users->contains($user->id);
});

Broadcast::channel('project.{projectId}', function ($user, $projectId) {
    return ['id' => $user->id, 'name' => $user->name];
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
