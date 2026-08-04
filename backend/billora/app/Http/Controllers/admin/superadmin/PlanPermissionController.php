<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\CustomerSidebarPermission;
use Illuminate\Http\Request;
use App\Models\PlanPermission;
use App\Models\PlanPermissionWithCustomerSidebar;
use Google\Service\Monitoring\Custom;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
class PlanPermissionController extends Controller
{
    public function index()
    {
        $planPermission = PlanPermission::paginate(15);
        return view('admin.plan_permission.index', compact('planPermission'));
    }

    public function create()
    {
        $permissions = CustomerSidebarPermission::where('status', 1)->get();
        return view('admin.plan_permission.create', compact('permissions'));
    }
    public function store(Request $request)
    {
        try {
            $permission = $request->validate([
                'name' => 'required',
                'slug' => 'required',
                'description' => 'nullable',
                'is_active' => 'required',
                'permissions' => 'required|array'
            ]);
            // dd($permission);
            // $permission['slug'] = Str::slug($permission['name']);

            $planPermission = PlanPermission::create([
                'permission_name' => $permission['name'],
                'slug' => $permission['slug'],
                'description' => $permission['description'],
                'is_active' => $permission['is_active'],

            ]);
            if ($planPermission) {
                try {
                    foreach ($permission['permissions'] as $permission) {
                        // dd($permission);
                        PlanPermissionWithCustomerSidebar::create([
                            'plan_permission_id' => $planPermission->id,
                            'customer_sidebar_permission_id' => $permission,
                            'created_by' => 'admin',
                        ]);
                    }
                } catch (\Exception $e) {
                    dd($e->getMessage());
                    return redirect()->back()->with('error', $e->getMessage());
                }
            } else {
                dd('Plan Permission Not Created');
            }

            return redirect()->route('admin.plan-permission.index')->with('success', 'Plan Permission Created Successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function edit($id)
    {
        try {
            $planPermission = PlanPermission::findOrFail($id);
            $selectedPermissions = PlanPermissionWithCustomerSidebar::where('plan_permission_id', $id)->pluck('customer_sidebar_permission_id')->toArray();
            $permissions = CustomerSidebarPermission::where('status', 1)->get();
            return view('admin.plan_permission.edit', compact('planPermission', 'selectedPermissions', 'permissions'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $data = $request->validate([
                'name' => 'required',
                'slug' => 'required',
                'description' => 'nullable',
                'is_active' => 'required',
                'permissions' => 'required|array'
            ]);

            // Find record
            $planPermission = PlanPermission::findOrFail($id);

            // Update main table
            $planPermission->update([
                'permission_name' => $data['name'],
                // 'slug' => Str::slug($data['name']),
                'slug' => $data['slug'],
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'],
            ]);

            // delete old permissions
            PlanPermissionWithCustomerSidebar::where('plan_permission_id', $id)->delete();
            Cache::tags('plan_details')->flush();
            // insert new permissions
            foreach ($data['permissions'] as $perm) {
                PlanPermissionWithCustomerSidebar::create([
                    'plan_permission_id' => $planPermission->id,
                    'customer_sidebar_permission_id' => $perm,
                    'created_by' => 'admin',
                ]);
            }

            DB::commit();
            Cache::tags('plan_details')->flush();
            return redirect()->route('admin.plan-permission.index')
                ->with('success', 'Plan Permission Updated Successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function delete($id)
    {
        try {
            $planPermission = PlanPermission::findOrFail($id);
            $planPermission->delete();
            return redirect()->route('admin.plan-permission.index')->with('success', 'Plan Permission Deleted Successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
