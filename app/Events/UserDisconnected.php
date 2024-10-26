<?php
namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserDisconnected implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $projectId;

    public function __construct(User $user, $projectId)
    {
        $this->user = $user;
        $this->projectId = $projectId;
    }

    public function broadcastOn()
    {
        return new PresenceChannel('project.' . $this->projectId);
    }

    public function broadcastAs()
    {
        return 'user.disconnected';
    }
}

