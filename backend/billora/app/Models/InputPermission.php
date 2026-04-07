<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InputPermission extends Model
{
    protected $table = 'input_permission';
    protected $fillable =[
        'name',
        'slug',
        'created_by'
    ];
}
