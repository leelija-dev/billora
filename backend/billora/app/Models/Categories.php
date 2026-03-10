<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'product_categories';
    protected $fillable=[
        'user_id',
        'name',
        'slug',
        'is_active',
        'created_by',
        'description'
    ];
}
