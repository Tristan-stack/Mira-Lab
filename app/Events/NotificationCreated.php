<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use SerializesModels;

    public $notification;
    public $userIds;

    public function __construct(Notification $notification, $userIds)
    {
        $this->notification = $notification->load('creator', 'task', 'list');
        $this->userIds = $userIds;
    }

    public function broadcastOn()
    {
        return $this->userIds->map(function ($id) {
            return new Channel('user.' . $id);
        })->toArray();
    }

    public function broadcastAs()
    {
        return 'notification.created';
    }
}