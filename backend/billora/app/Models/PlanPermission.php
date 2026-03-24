<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanPermission extends Model
{
    protected $table = 'plan_permission';
    protected $fillable=[
        'permission_name',
        'slug',
        'description',
        'is_active'
    ];
    protected $casts =[
        'is_active' => 'boolean',
        
    ];
}
