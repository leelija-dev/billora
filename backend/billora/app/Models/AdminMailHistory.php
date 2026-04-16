<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminMailHistory extends Model
{
    protected $table = 'admin_mail_history';
    protected $fillable = [
        'customer_id',
        'email',
        'subject',
        'message',
        'status',
        'error_message',
    ];

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'customer_id');
    }
}
