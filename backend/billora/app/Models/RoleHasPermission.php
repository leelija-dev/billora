<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleHasPermission extends Model
{
    protected $table='role_has_permission';
    protected $fillable=[
            'permission_id',
            'role_id'
    ];

    public function permission(){
        return $this->belongsTo(SuperAdminPermission::class);
    }
    public function role(){
        return $this->belongsTo(Roles::class);
    }
}
