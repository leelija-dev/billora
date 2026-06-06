<?php

namespace App\Http\Controllers\admin\superadmin;

use App\Http\Controllers\Controller;
use App\Models\BusinessType;
use App\Models\Customers;
use App\Models\PlanBusinessType;
use Illuminate\Http\Request;
use App\Models\Plans;
use App\Models\PlanPermission;
use App\Models\PlanPermissionDetails;
use App\Models\PlanPurchaseHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class PlansController extends Controller
{
    private function checkAdminAuth()
    {
        if (!Auth::guard('admin')->check()) {
            return redirect()->route('admin.login')->with('error', 'Please login to access this page.');
        }
    }
    public function index(Request $request)
    {
        $this->checkAdminAuth();
        // Start with base query
        $query = Plans::query();

        // Apply search if exists
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhere('price', 'LIKE', "%{$search}%");
            });
        }

        // Get all plans with search applied
        $plans = $query->latest()->paginate(15)->withQueryString();

        return view('admin.plans.index', [
            'plans' => $plans,
            'totalPlans' => Plans::withTrashed()->count(),
            'activePlans' => $plans->where('is_active', true)->count(),
            'inactivePlans' => $plans->where('is_active', false)->count(),
            'deletedPlans' => Plans::onlyTrashed()->count(),
            'search' => $request->input('search') // Pass search term back to view
        ]);
    }
    public function create()
    {
        $this->checkAdminAuth();
        $permissions = PlanPermission::all();
        $business_types = BusinessType::where('is_active', 1)->get();
        return view('admin.plans.create', compact('permissions', 'business_types'));
    }
    public function store(Request $request)
    {
        $this->checkAdminAuth();
        $data = $request->validate([
            'name'          => 'required',
            'price'         => 'required',
            'gst'           => 'required',
            'discount'      => 'required',
            'features'      => 'nullable',
            'description'   => 'nullable',
            'is_active'     => 'required',
            'duration_days' => 'required',
            'currency'      => 'nullable',
            'permissions'    => 'nullable|array',
            'business_types' => 'required|array'
        ]);
        $admin = Auth::guard('admin')->user();

        // Add admin data
        $data['created_by'] = $admin->name;
        $data['slug'] = Str::slug($data['name']);
        try {
            $plan = Plans::create($data);
            if ($plan) {
                foreach ($data['permissions'] as $permission) {
                    PlanPermissionDetails::create([
                        'plan_id' => $plan->id,
                        'permission_id' => $permission
                    ]);
                }
                foreach ($data['business_types'] as $business_type) {
                    PlanBusinessType::create([
                        'plan_id' => $plan->id,
                        'business_type_id' => $business_type
                    ]);
                }
            }
            Cache::tags(['users_plans'])->flush();
            return redirect()->route('admin.plans.index')->with('success', 'Plan Created Successfully');
        } catch (\Exception $e) {

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function edit($id)
    {
        $this->checkAdminAuth();

        $plan = Plans::findOrFail($id);

        // all permissions list
        $permissions = PlanPermission::all();
        $business_types = BusinessType::where('is_active', 1)->get();
        $selected_business_types = PlanBusinessType::where('plan_id', $plan->id)->pluck('business_type_id')->toArray();
        // get saved permission IDs
        $planPermissions = PlanPermissionDetails::where('plan_id', $plan->id)
            ->pluck('permission_id')
            ->toArray();

        return view('admin.plans.edit', compact('plan', 'permissions', 'planPermissions', 'business_types', 'selected_business_types'));
    }
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name'          => 'required',
            'price'         => 'required',
            'gst'           => 'required',
            'discount'      => 'required',
            'features'      => 'nullable',
            'description'   => 'nullable',
            'is_active'     => 'nullable|boolean',
            'duration_days' => 'required',
            'currency'      => 'nullable',
            'permissions'   => 'nullable|array',
            'business_types' => 'required|array'
        ]);

        try {
            $plan = Plans::findOrFail($id);

            // Update plan
            $plan->update($data);

            // Selected permissions from form
            $newPermissions = $request->permissions ?? [];
            $newBusinessTypes = $request->business_types ?? [];
            // Existing permissions in DB
            $oldPermissions = PlanPermissionDetails::where('plan_id', $plan->id)
                ->pluck('permission_id')
                ->toArray();

            //  DELETE unchecked permissions
            $toDelete = array_diff($oldPermissions, $newPermissions);

            if (!empty($toDelete)) {
                PlanPermissionDetails::where('plan_id', $plan->id)
                    ->whereIn('permission_id', $toDelete)
                    ->delete();
            }

            // INSERT new permissions (only new ones)
            $toInsert = array_diff($newPermissions, $oldPermissions);

            foreach ($toInsert as $permission) {
                PlanPermissionDetails::create([
                    'plan_id' => $plan->id,
                    'permission_id' => $permission
                ]);
            }
            //update business types
            // Existing business types
            $oldBusinessTypes = PlanBusinessType::where('plan_id', $plan->id)
                ->pluck('business_type_id')
                ->toArray();

            // DELETE unchecked
            $toDeleteBusiness = array_diff($oldBusinessTypes, $newBusinessTypes);

            if (!empty($toDeleteBusiness)) {
                PlanBusinessType::where('plan_id', $plan->id)
                    ->whereIn('business_type_id', $toDeleteBusiness)
                    ->delete();
            }

            // INSERT new
            $toInsertBusiness = array_diff($newBusinessTypes, $oldBusinessTypes);

            foreach ($toInsertBusiness as $typeId) {
                PlanBusinessType::create([
                    'plan_id' => $plan->id,
                    'business_type_id' => $typeId
                ]);
            }
            Cache::tags(['users_plans'])->flush();
            return redirect()->route('admin.plans.index')
                ->with('success', 'Plan Updated Successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function delete($id)
    {
        try {
            $plan = Plans::findOrFail($id);
            $plan->delete();
            Cache::tags(['users_plans'])->flush();
            return redirect()->route('admin.plans.index')->with('success', 'Plan Deleted Successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function trashed()
    {
        $this->checkAdminAuth();
        $plans = Plans::onlyTrashed()->latest()->paginate(15);
        return view('admin.plans.deleted', compact('plans'));
    }
    public function restore($id)
    {
        try {
            $plan = Plans::withTrashed()->findOrFail($id);
            $plan->restore();
            Cache::tags(['users_plans'])->flush();
            return redirect()->route('admin.plans.deleted')->with('success', 'Plan Restored Successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function forceDelete($id)
    {
        try {
            $plan = Plans::withTrashed()->findOrFail($id);
            $plan->forceDelete();
            Cache::tags(['users_plans'])->flush();
            return redirect()->route('admin.plans.deleted')->with('success', 'Plan Deleted Permanently');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show($id)
    {
        $this->checkAdminAuth();

        $plan = Plans::onlyTrashed()->findOrFail($id);

        // all permissions list
        $permissions = PlanPermission::all();

        // get saved permission IDs
        $planPermissions = PlanPermissionDetails::where('plan_id', $plan->id)
            ->pluck('permission_id')
            ->toArray();

        return view('admin.plans.edit', compact('plan', 'permissions', 'planPermissions'));
    }
    public function purchaseHistory(Request $request)
    {
        $cacheKey = 'plan_purchase_history_' . md5($request->fullUrl());

            $data = Cache::tags(['plan_purchase_history'])
                ->remember($cacheKey, 600, function () use ($request) {
                $search = $request->search;

                $planPurchaseHistory = PlanPurchaseHistory::when($search, function ($query) use ($search) {
                        $query->where('id', 'like', '%' . $search . '%')
                        ->orWhere('payment_id', 'like', '%' . $search . '%')
                        ->orWhereHas('plan', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                    })
                    ->latest()
                    ->paginate(10)
                    ->withQueryString();
                $totalplanHistory = PlanPurchaseHistory::count();
                $successPayment = PlanPurchaseHistory::where('payment_status', 'success')->count();
                $planExpire = PlanPurchaseHistory::where('payment_status', 'pending')->count();
                $cancelledPayment = PlanPurchaseHistory::where('payment_status', 'failed')->count();
                return [
                    'planPurchaseHistory'=>$planPurchaseHistory,
                    'totalplanHistory'=>$totalplanHistory,
                    'successPayment'=>$successPayment,
                    'planExpire'=>$planExpire,
                    'cancelledPayment'=>$cancelledPayment
                ];
        });
        return view('admin.plans.plan-purchase-history', $data);
    }

    public function updateEndDate(Request $request, $id)
    {
        $data = $request->validate([
            'new_end_date' => 'required',
            'user_id' =>'required|exists:customers,id'
        ]);

        try {
            $planPurchase = PlanPurchaseHistory::where('id',$id)->where('user_id',$data['user_id'])->firstOrFail();
            $endDate = \Carbon\Carbon::parse($data['new_end_date']);
            $customer = Customers::findOrFail($data['user_id']);
            if($planPurchase->payment_status != 'success'){
                return redirect()->back()->with('error', 'Your plan payment has not been completed.');
            }
             $planPurchase->update([
                'end_date' => $endDate,
                'status' => $endDate->gte(now()) ? 'active' : 'expired'
             ]);
             $customer->update([
                    'is_active' => $endDate->gte(now())
            ]);
            Cache::tags(['plan_purchase_history'])->flush();

            return redirect()->back()->with('success', 'Plan end date updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while updating the end date: ' . $e->getMessage());
        }
    }
}
