<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessType;
use Illuminate\Http\Request;

class BusinessTypeController extends Controller
{
    public function index(){
        $businessType = BusinessType::where('is_active',1)->get();
        return response()->json([
            'status' => true,
            'message' => 'Business Type List',
            'data' => $businessType
        ]);
    }
}
