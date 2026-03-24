<?php

namespace App\Models;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class AdminUser extends Authenticatable
{
    use Notifiable;
    protected $table = 'admin_users';

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
