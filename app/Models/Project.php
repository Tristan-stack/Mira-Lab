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
        'project_code',
        'chat_id',
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
        return $this->hasMany(Task::class);
    }

    // Relation avec le chat
    public function chat()
    {
        return $this->hasOne(Chat::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            $project->project_code = self::generateProjectCode();
        });
    }

    public static function generateProjectCode()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < 8; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function isBoardLeader($userId)
    {
        $isLeader = $this->users()
                        ->wherePivot('user_id', $userId)
                        ->wherePivot('role', 'Board Leader')
                        ->exists();
                        
        // Ajoute cette ligne pour déboguer
        // dd($isLeader);
        
        return $isLeader;
    }
}