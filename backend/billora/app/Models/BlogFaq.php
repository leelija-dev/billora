<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogFaq extends Model
{
    protected $table = 'blog_faqs';
    protected $fillable = [
        'blog_id',
        'question',
        'answer',
        'status',
    ];
public function blog()
{
    return $this->belongsTo(Blog::class);

}
}
