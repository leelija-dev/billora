<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageCost extends Model
{
    protected $table = 'package_cost';
    protected $fillable=[
        'user_id',
        'package_name',
        'package_price',
        'package_size',
        'created_by'
    ];
}
