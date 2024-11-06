<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeamDeleted implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $teamId;

    /**
     * Create a new event instance.
     */
    public function __construct($teamId)
    {
        $this->teamId = $teamId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('teams'); // Canal global
    }

    /**
     * Define the event name.
     */
    public function broadcastAs()
    {
        return 'team.deleted';
    }

    /**
     * Define the data to broadcast.
     */
    public function broadcastWith()
    {
        return ['teamId' => $this->teamId];
    }
}