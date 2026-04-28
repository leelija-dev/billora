<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogCategories extends Model
{
    protected $table = 'blog_categories';
    protected $fillable = [
        'blog_id',
        'category_id'
    ];
  
}
