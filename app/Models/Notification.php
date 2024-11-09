<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'text',
        'user_id',
        'task_id',
        'list_id',
    ];

    /**
     * Relation avec les utilisateurs.
     * Une notification peut être associée à plusieurs utilisateurs.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'notification_user')
                    ->withPivot('status')
                    ->withTimestamps();
    }

    /**
     * L'utilisateur qui a créé la notification.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relation avec la tâche, si applicable.
     */
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Relation avec la liste, si applicable.
     */
    public function list()
    {
        return $this->belongsTo(Lists::class);
    }
}