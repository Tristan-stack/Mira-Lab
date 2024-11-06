<?php
namespace App\Events;

use App\Models\Team;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class TeamCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $team;
    public $creatorId;

    public function __construct(Team $team)
    {
        $this->team = $team;
        $this->creatorId = Auth::id();
    }

    public function broadcastOn()
    {
        return new Channel('teams');
    }

    public function broadcastAs()
    {
        return 'team.created';
    }
}