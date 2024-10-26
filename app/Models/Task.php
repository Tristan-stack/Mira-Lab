<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'project_id',
        'user_id',
        'dependencies',
        'lists_id',
    ];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Gérer la dépendance des tâches
    public function dependency()
    {
        return $this->belongsTo(Task::class, 'dependencies');
    }

    // Relation avec la liste
    public function list()
    {
        return $this->belongsTo(Lists::class);
    }
}