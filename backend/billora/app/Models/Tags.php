<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tags extends Model
{
    protected  $table = 'tags';
    protected $fillable = [
        'name',
        'slug',
        'status'
    ];
    public function blogs()
{
    return $this->belongsToMany(
        Blog::class,
        'blog_tags',
        'tag_id',
        'blog_id'
    );
}
}
