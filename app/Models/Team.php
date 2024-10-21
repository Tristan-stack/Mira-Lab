<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'team_code'];

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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($team) {
            $team->team_code = self::generateTeamCode();
        });
    }

    public static function generateTeamCode()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < 8; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}