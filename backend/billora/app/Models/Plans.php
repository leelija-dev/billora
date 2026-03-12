<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plans extends Model
{
    protected $table='plans';

    protected $fillable = [
        'name',
        'slug',
        'price',
        'created_by',
        'features',
        'description',
        'is_active',
        'duration_days',
        'currency'
    ];

    protected $casts = [
        'features'=>'array',
        'is_active'=>'boolean:2',
        'duration_days'=>'integer',
        'price'=>'decimal:10,2',
        'slug'=>'unique'
    ];
}
