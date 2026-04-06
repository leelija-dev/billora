<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role as SpatieRole;

class Roles extends SpatieRole
{
    protected $table = 'roles';
    protected $fillable = [
        'name',
        'guard_name',
    ];
}
