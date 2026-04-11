<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineType extends Model
{
    protected $table = 'medicine_type';

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'created_by',
    ];
}
