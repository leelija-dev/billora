<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $table='store';
    protected $fillable=[
    'user_id',
    'name',
    'gst',
    'email',
    'logo',
    'mobile',
    'address',
    'city',
    'status',
    'state',
    'bank_qr',
    'logo_public_id',
    'bank_qr_public_id',
    'pincode',
    'created_by'
    ];
    protected $casts = [
        'status' => 'boolean',
         
    ];

}
