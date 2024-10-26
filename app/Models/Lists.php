<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lists extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'status',
        'start_date',
        'end_date',
        'project_id',
    ];

    // Relation avec les tâches
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Relation avec le projet
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}