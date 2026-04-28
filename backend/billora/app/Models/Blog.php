<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Blog extends Model
{
    use SoftDeletes;
    protected $table = 'blog';
    protected $fillable = [
        'title',
        'slug',
        'feature_image',
        'feature_image_alt',
        'excerpt',
        'content',
        'meta_title',
        'meta_description',
        'meta_tag',
        'keywords',
        'schema',
        'created_by',
        'status'
    ];
}