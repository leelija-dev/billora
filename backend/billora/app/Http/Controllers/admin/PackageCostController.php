<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Google\Service\ArtifactRegistry\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PackageCost;

class PackageCostController extends Controller


{
    public function index($id)
    {

        try {
            $user = Auth::user()->id;
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            if ($user != $id) {

                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized user',

                ]);
            }
            $packegesCost = PackageCost::where('user_id', $id)->get();
            return response()->json([
                'status' => true,
                'message' => 'Package Cost List',
                'data' => $packegesCost
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function store($id, Request $request)
    {
        try {
            $data = $request->validate([
                'package_name' => 'required',
                'package_price' => 'required',
                'package_size' => 'nullable',
            ]);
            $user = Auth::user()->id;
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            if ($user != $id) {

                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized user',
                ]);
            }
            $data['user_id'] = $id;
            $data['created_by'] = $user;
            $packageCost = PackageCost::create($data);
            return response()->json([
                'status' => true,
                'message' => 'Package Cost Created Successfully',
                'data' => $packageCost
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function edit($id)    //package cost id
    {
        try {
            $user = Auth::user()->id;
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }

            $packageCost = PackageCost::findOrFail($id);
            if (!$packageCost) {
                return response()->json([
                    'status' => false,
                    'message' => 'Package Cost not found'
                ]);
            }
            return response()->json([
                'status' => true,
                'message' => 'Single Package Cost ',
                'data' => $packageCost
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update($id){

        try {
            if(!Auth::check()){
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $data = request()->validate([
                'package_name' => 'required',
                'package_price' => 'required',
                'package_size' => 'nullable',
            ]);

            $packageCost = PackageCost::where('user_id', $user)->where('id', $id)->first();
            $packageCost->update($data);
            return response()->json([
                'status' => true,
                'message' => 'Package Cost Updated Successfully',
                'data' => $packageCost
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function delete($id){
        try {
            $user = Auth::user()->id;
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $packageCost = PackageCost::where('user_id', $user)->where('id', $id)->first();
            $packageCost->delete();
            return response()->json([
                'status' => true,
                'message' => 'Package Cost Deleted Successfully',
                'data' => $packageCost
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
