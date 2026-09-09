<?php
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

// Broadcast::channel('App.Models.Customers.{id}', function ($user, $id) {

//     Log::info('CHANNEL AUTH CHECK', [
//         'user_id' => $user?->id,
//         'channel_id' => $id,
//     ]);

//     return $user && (int) $user->id === (int) $id;
// });
// Broadcast::channel('App.Models.Customers.{id}', function ($user, $id) {
//     Log::info("Broadcasting channel App.Models.Customers.{$id} for user ID: {$user->id}");
//     return (int) $user->id === (int) $id;
// });

Broadcast::channel(
    'App.Models.Customers.{id}',
    function ($user, $id) {

        Log::info('=== BROADCAST AUTH ATTEMPT ===', [
            'user_id' => $user?->id,
            'channel_id' => $id,
        ]);

        return $user && (int) $user->id === (int) $id;
    }
);