<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    protected $table ='contact_us';
    protected $fillable =[
        'name',
        'phone',
        'email',
        'subject',
        'message',
        'view_status'
    ];
}
