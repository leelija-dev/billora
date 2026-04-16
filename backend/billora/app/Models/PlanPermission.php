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
    public function sidebarPermissions()
{
    return $this->belongsToMany(
        CustomerSidebarPermission::class,
        'plan_permission_with_customer_dashboard',
        'plan_permission_id',
        'customer_sidebar_permission_id'
    );
}
}
