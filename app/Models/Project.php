<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'team_id',
    ];

    // Relation avec l'équipe
    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    // Relation avec les utilisateurs (via Project_User)
    public function users()
    {
        return $this->belongsToMany(User::class, 'project_user')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'project_task');
    }

}
