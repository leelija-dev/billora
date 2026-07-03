<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Google\Service\ArtifactRegistry\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PackageCost;
use Illuminate\Support\Facades\Cache;
class PackageCostController extends Controller


{
    public function index($id)
    {

        try {
            $user = Auth::user()->id;
            $startTime = microtime(true);
            $cacheKey = "package_cost_list_{$user}";
            $formCache = Cache::tags(['package_cost_user_' . $user])->has($cacheKey);
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
            $packegesCost = Cache::tags(['package_cost_user_' . $user])->remember($cacheKey, 600, function () use ($id) {
                return PackageCost::where('user_id', $id)->paginate(8);
            });
            $executionTime = microtime(true) - $startTime;
            return response()->json([
                'status' => true,
                'message' => 'Package Cost List',
                'source' => $formCache ? 'Cache' : 'Database',
                'response_time' => round($executionTime, 4) . ' sec',
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
            Cache::tags(['package_cost_user_' . $user])->flush();
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
             Cache::tags(['package_cost_user_' . $user])->flush();
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
            Cache::tags(['package_cost_user_' . $user])->flush();
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
            Cache::tags(['package_cost_user_' . $user])->flush();
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
