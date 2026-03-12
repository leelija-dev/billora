<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plans;
class PlanController extends Controller
{
    public function index(){
        $data = Plans::all();
        return response()->json([
            'status' => true,
            'message' => 'Plan List',
            'data' => $data
        ]); 
    }
}
