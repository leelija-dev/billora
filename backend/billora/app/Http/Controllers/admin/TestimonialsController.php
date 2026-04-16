<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonials;
use Illuminate\Http\Request;

class TestimonialsController extends Controller
{
    public function index()
    {
        try{
        $testimonials = Testimonials::where('is_active', true)->get();
        if($testimonials->isEmpty()){
            return response()->json([
                'success' => false,
                'message' => 'No active testimonials found!'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'All Testimonials' => $testimonials
        ]);
        }catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching testimonials: ' . $e->getMessage()
            ], 500);
        }
    }
}
