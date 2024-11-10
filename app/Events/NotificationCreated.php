<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use SerializesModels;

    public $notification;
    public $userIds;

    public function __construct(Notification $notification, $userIds)
    {
        // Charge la relation 'users' avec le pivot 'status' pour les utilisateurs concernés
        $this->notification = $notification->load(['users' => function ($query) use ($userIds) {
            $query->whereIn('users.id', $userIds)->withPivot('status');
        }, 'creator', 'task', 'list']);
        $this->userIds = $userIds;
    }

    public function broadcastOn()
    {
        return collect($this->userIds)->map(function ($id) {
            return new PrivateChannel('user.' . $id);
        })->toArray();
    }

    public function broadcastAs()
    {
        return 'notification.created';
    }

    public function broadcastWith()
    {
        // Prépare la notification avec le statut 'unread' pour chaque utilisateur
        return [
            'notification' => [
                'id' => $this->notification->id,
                'text' => $this->notification->text,
                'status' => 'unread', // Le statut par défaut est 'unread' pour une nouvelle notification
                // Ajouter d'autres champs si nécessaire
            ],
        ];
    }
}