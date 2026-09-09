<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table='notifications';
    protected $fillable = [
        'user_id',
        'title',
        'message',
        'notification_type',
        'read_at',
    ];
    
    public function user(){
        return $this->belongsTo(Customers::class);
    }
}
