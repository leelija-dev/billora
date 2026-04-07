<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessType extends Model
{
    protected $table = 'business_type';
    protected $fillable = [
        'name',
        'slug',
        'is_active',
        'created_by'
    ];
}
