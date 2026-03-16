<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Unit;
// use Psy\Util\Str;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class UnitController extends Controller
{
    public function index(Request $request)
{
    try {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $user = Auth::id();
        $search = $request->search;

        $units = Unit::where('user_id', $user)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', "%$search%")
                      ->orWhere('name', 'like', "%$search%")
                      ->orWhere('code', 'like', "%$search%")
                      ->orWhere('slug', 'like', "%$search%");
                });
            })
            ->paginate(15);

        return response()->json([
            'status' => true,
            'message' => 'Unit List',
            'data' => $units,
            'user_id' => $user
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
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $user = Auth::user()->id;
        $unit = $request->validate([
            'code'        => 'required',
            'name'        => 'required',
        ]);
        try {
            $unit['user_id'] = $user;
            $unit['created_by'] =$user;
            $unit['slug'] = Str::slug($unit['name']);
            $data = Unit::create($unit);
            //  dd($unit);
            $units = Unit::where('user_id',$data->user_id)->get();
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
             if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
            }
            $user=Auth::user()->id;
            $unit = Unit::where('id', $id)->where('user_id',$user)->get();
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
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
        $user = Auth::user()->id;
        $data = $request->validate([
            'code'    => 'required',
            'name'    => 'required'
        ]);
        try {
            $unit = Unit::where('id',$id)->where('user_id',$user)->first();
            // ->orWhere('user_id',auth()->user()->id),
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
            if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ], 401);
        }
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
