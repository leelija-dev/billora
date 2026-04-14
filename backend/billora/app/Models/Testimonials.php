<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonials extends Model
{
    protected $table = "testimonials";
    protected $fillable=[
        'name',
        'role',
        'company',
        'message',
        'rating',
        'image',
        'shop_type',
        'is_active'
    ];
   
}
