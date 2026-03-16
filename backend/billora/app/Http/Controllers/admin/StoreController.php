<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    public function index(Request $request, $id)
    {
        try {
            $user = Auth::user()->id;
            if ($user != $id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized, You are not allowed to perform this action',

                ]);
            }
            $search = $request->search;

            $store = Store::where('user_id', $user)
                ->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%$search%")
                        ->orWhere('gst', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%")
                        ->orWhere('mobile', 'like', "%$search%")
                        ->orWhere('address', 'like', "%$search%")
                        ->orWhere('city', 'like', "%$search%");
                })
                ->paginate(15);

            if ($store->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Does not have any data',
                    'data' => null
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Store List',
                'data' => $store
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'data' => null
            ]);
        }
    }
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ]);
        }
        $user = Auth::user()->id;
        $store = $request->validate([
            'user_id'     => 'required',
            'name'        => 'required',
            'gst'         => 'nullable',
            'email'       => 'required',
            'logo'        => 'nullable',
            'mobile'      => 'nullable',
            'address'     => 'required',
            'city'        => 'required',
            'status'      => 'required',
            'created_by'  => 'required'
        ]);
        if ($store['user_id'] != $user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized, You are not allowed to perform this action',
            ]);
        }

        try {
            $store = Store::create($store);
            return response()->json([
                'status' => true,
                'message' => 'Store Created Successfully',
                'data' => $store
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

            $userId = Auth::user()->id;

            $store = Store::where('user_id', $userId)
                ->where('id', $id)
                ->first();

            if (!$store) {
                return response()->json([
                    'status' => false,
                    'message' => 'Store not found'
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Store Details',
                'data' => $store
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    } 
    public function update(Request $request, $id)
    {
        $user = Auth::user()->id;
        $data = $request->validate([
            'name'    => 'required',
            'gst'     => 'nullable',
            'email'   => 'required',
            'logo'    => 'nullable',
            'mobile'  => 'nullable',
            'address' => 'required',
            'city'    => 'required',
            'status'  => 'required',
        ]);
        try {

            $store = Store::where('user_id', $user)->where('id', $id)->first();
            $store->update($data);
            return response()->json([
                'status' => true,
                'message' => 'Store Updated Successfully',
                'data' => $store
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
            $user = Auth::user()->id;
            $store = Store::where('user_id', $user)->where('id', $id)->first();
            $store->delete();
            return response()->json([
                'status' => true,
                'message' => 'Store Deleted Successfully',
                'data' => null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
