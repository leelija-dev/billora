<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $fillable = [
        'name',
        'slug',
        'description',
        'status'
    ];
    public function blogs()
{
    return $this->belongsToMany(
        Blog::class,
        'blog_categories',
        'category_id',
        'blog_id'
    );
}
}
