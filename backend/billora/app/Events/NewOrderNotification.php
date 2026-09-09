<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrderNotification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $adminId;
    public int $id;
    public string $orderId;
    public string $title;
    public string $message;
    public ?string $orderTime = null;  // Fix: Add default value

    public function __construct(int $adminId, int $id, string $orderId, string $title, string $message, ?string $orderTime = null)
    {
        $this->adminId = $adminId;
        $this->id = $id;
        $this->orderId = $orderId;
        $this->title = $title;
        $this->message = $message;
        $this->orderTime = $orderTime ?? now()->toDateTimeString();
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.Customers.' . $this->adminId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'new-order';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->orderId,
            'title' => $this->title,
            'message' => $this->message,
            'order_time' => $this->orderTime ?? now()->toDateTimeString(),
        ];
    }
}