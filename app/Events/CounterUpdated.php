<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CounterUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $counter;

    public function __construct($counter)
    {
        $this->counter = $counter;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('counter-channel'), // Assurez-vous que c'est le bon canal
        ];
    }

    public function broadcastAs(): string
    {
        return 'counter-event'; // Utilisé pour écouter cet événement dans React
    }
}

