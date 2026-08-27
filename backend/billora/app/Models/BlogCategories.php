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
    
    public $timestamps = true;
    public function blog()
    {
        return $this->belongsTo(Blog::class, 'blog_id');
    } 

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
