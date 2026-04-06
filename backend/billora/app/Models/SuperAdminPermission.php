<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuperAdminPermission extends Model
{
    protected $table = 'superadmin_permission';
    protected $fillable = [
        'name',
        'slug',
        'is_active'
    ] ;
}
