<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
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
        'created_by'
];
}
