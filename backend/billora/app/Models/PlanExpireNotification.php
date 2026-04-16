<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanExpireNotification extends Model
{
    protected $table = 'plan_expire_notifications';
    protected $fillable = [
        'user_id',
        'data',
    ];

}
