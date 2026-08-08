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
        'feature_image_public_id',
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
 public function tags()
{
    return $this->hasMany(
        BlogTags::class,'blog_id');
}

public function categories()
{
    return $this->belongsToMany(
        Category::class,
        'blog_categories',
        'blog_id',
        'category_id'
    );
}
public function faqs()
{
    return $this->hasMany(BlogFaq::class , 'blog_id');
}
public function user(){
    return $this->belongsTo(AdminUser::class , 'created_by');
}
}