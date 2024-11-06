<?php

namespace App\Events;

use App\Models\Team;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;

class TeamCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $team;

    /**
     * Create a new event instance.
     */
    public function __construct(Team $team)
    {
        $this->team = $team;// Ajouter l'ID du créateur pour le filtrage côté client
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('teams'); // Canal global
    }

    /**
     * Définir le nom de l'événement.
     */
    public function broadcastAs()
    {
        return 'team.created';
    }
}