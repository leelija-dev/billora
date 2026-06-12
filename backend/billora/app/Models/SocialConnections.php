<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialConnections extends Model
{
    protected $table = 'social_connections';
    protected $fillable = [
        'user_id',
        'page_id',
        'page_name',
        'page_access_token',
        'user_access_token',
        'instagram_business_id',
        'token_expires_at',
        'is_active'
    ];
}
