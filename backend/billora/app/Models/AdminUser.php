<?php

namespace App\Models;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;
class AdminUser extends Authenticatable
{
    use Notifiable;
    use HasRoles;
    protected $table = 'admin_users';
    protected $guard_name = 'admin';
    protected $fillable = [
        'username',
        'email',
        'password',
        'fname',
        'lname',
        'address',
        'image',
        'description',
        'last_login_at',
        'no_logon'
    ];
    protected $hidden = [
        'password',
        'remember_token'
    ];
    protected $casts = [
        'last_login_at' => 'datetime',
    ];
}
