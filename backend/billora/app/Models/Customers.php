<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Customers extends  Authenticatable  //Model
{
 use HasApiTokens, Notifiable;
 
protected $table="customers";

protected $fillable=[
        'name',
        'email',
        'phone',
        'password',
        'email_varified_at',
        'remember_token',
        'company_name',
        'gst_number',
        'address',
        'city',
        'state',
        'country',
        'pincode',
        'created_by',
        'plan_id',
        'is_active'
];
protected $hidden = [
        'password',
        'remember_token'
    ];
}
