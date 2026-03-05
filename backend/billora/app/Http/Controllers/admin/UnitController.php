<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Unit;
// use Psy\Util\Str;
use Illuminate\Support\Str;

class UnitController extends Controller
{
    public function index()
    {
        try {
            //     $units=Unit::where('user_id',auth()->user()->id)
            //     ->OrWhere('user_id',auth()->user()->created_by)->get();
            $units = Unit::paginate(15);
            return response()->json([
                'status' => true,
                'message' => 'Unit List',
                'data' => $units
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function store(Request $request)
    {
        $unit = $request->validate([
            'user_id' => 'required',
            'code' => 'required',
            'name' => 'required',
            'created_by' => 'nullable'
        ]);
        try {

            $unit['slug'] = Str::slug($unit['name']);
            Unit::create($unit);
            //  dd($unit);
            $units = Unit::all();
            return response()->json([
                'status' => true,
                'message' => 'Unit Created Successfully',
                'data' => $units
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function edit($id)
    {
        try {
            $unit = Unit::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => 'Unit Details',
                'data' => $unit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function update($id, Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required',
            'code' => 'required',
            'name' => 'required'
        ]);
        try {
            $unit = Unit::findOrFail($id);
            // ->orWhere('user_id',auth()->user()->id)
            // ->orWhere('user_id',auth()->user()->created_by)->first();
            $unit->update($data);
            return response()->json([
                'status' => true,
                'message' => 'Unit Updated Successfully',
                'data' => $unit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function delete($id)
    {
        try {
            $unit = Unit::findOrFail($id);
            $unit->delete();
            return response()->json([
                'status' => true,
                'message' => 'Unit Deleted Successfully',
                'data' => $unit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
