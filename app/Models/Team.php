<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name'];
    

    // Relation avec les projets
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    // Relation avec les utilisateurs via la table pivot `team_user`
    public function users()
    {
        return $this->belongsToMany(User::class, 'team_user')
                    ->withPivot('role')
                    ->withTimestamps();
    }
}


