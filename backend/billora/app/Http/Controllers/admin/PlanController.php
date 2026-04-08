<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\PlanPermission;
use Illuminate\Http\Request;
use App\Models\Plans;
use App\Models\PlanPermissionDetails;
use Illuminate\Support\Str;

class PlanController extends Controller
{
    public function index()
    {
        $data = Plans::with('permissions','business_types.businessType')->where('is_active', true)->get();
        return response()->json([
            'status' => true,
            'message' => 'Plan List',
            'data' => $data
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required',
            'price'         => 'required',
            'features'      => 'nullable',
            'description'   => 'nullable',
            'is_active'     => 'required',
            'duration_days' => 'required',
            'currency'      => 'nullable',
            'created_by'    => 'nullable'
        ]);
        $data['slug'] = Str::slug($data['name']);
        try {
            $plan = Plans::create($data);
            return response()->json([
                'status' => true,
                'message' => 'Plan Created Successfully',
                'data' => $plan
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
            $data = Plans::findOrFail($id);
            $plan = Plans::findOrFail($id);



            // get saved permission IDs
            $planPermissions = PlanPermissionDetails::where('plan_id', $plan->id)
                ->pluck('permission_id')
                ->toArray();
            $permissionNames = PlanPermission::whereIn('id', $planPermissions)
                ->select([
                    'id',
                    'permission_name',
                    'slug',
                    'description'
                ])
                ->get();
                
            return response()->json([
                'status' => true,
                'message' => 'Plan Details',
                'Single Plan' => $data,
                'permissions_id' => $planPermissions,
                'permissionNames' => $permissionNames
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
        $data = $request->validate([
            'name'          => 'required',
            'price'         => 'required',
            'features'      => 'nullable',
            'description'   => 'nullable',
            'is_active'     => 'required',
            'duration_days' => 'required',
            'currency'      => 'nullable',
            'created_by'    => 'nullable'
        ]);
        try {
            $plan = Plans::findOrFail($id);
            $plan->update($data);
            return response()->json([
                'status' => true,
                'message' => 'Plan Updated Successfully',
                'data' => $plan
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
            $plan = Plans::findOrFail($id);
            $plan->delete();
            return response()->json([
                'status' => true,
                'message' => 'Plan Deleted Successfully',
                'data' => null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function trashed()
    {
        try {
            $plan = Plans::onlyTrashed()->get();
            return response()->json([
                'status' => true,
                'message' => 'Plan List',
                'data' => $plan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function restore($id)
    {
        try {
            $plan = Plans::withTrashed()->findOrFail($id);
            $plan->restore();
            return response()->json([
                'status' => true,
                'message' => 'Plan Restored Successfully',
                'data' => $plan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function forceDelete($id)
    {
        try {
            $plan = Plans::withTrashed()->findOrFail($id);
            $plan->forceDelete();
            return response()->json([
                'status' => true,
                'message' => 'Plan Deleted Permanently',
                'data' => $plan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
