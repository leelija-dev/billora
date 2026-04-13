<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerSidebarPermission extends Model
{
    protected $table = 'customer_sidebar_permission';
    protected $fillable = ['name', 'slug', 'status'];
    
}
