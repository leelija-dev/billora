<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanPermissionWithCustomerSidebar extends Model
{
    protected $table = 'plan_permission_with_customer_dashboard';
    protected $fillable = 
    [
        'plan_permission_id',
        'customer_sidebar_permission_id',
        'created_by'
    ];
}
