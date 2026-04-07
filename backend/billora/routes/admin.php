<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\superadmin\AdminMailController;
use App\Http\Controllers\admin\superadmin\AdminUserController;
use App\Http\Controllers\admin\superadmin\CustomerController;
use App\Http\Controllers\admin\superadmin\PlansController;
use App\Http\Controllers\admin\superadmin\PlanPermissionController;
use App\Http\Controllers\admin\superadmin\RolesController;
use App\Http\Controllers\admin\superadmin\SuperAdminPermissionController;
use App\Models\AdminMailHistory;
use App\Models\SuperAdminPermission;

Route::middleware(['web', 'admin.guest'])->prefix('admin')->group(function () {
    Route::view('/login', 'admin.login')->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('admin.login');
});
 
// Authenticated admin routes
Route::middleware(['web', 'admin.auth'])->prefix('admin')->group(function () {
    Route::get('/logout', function() {
        abort(404);
    });
    Route::get('/', function() {
        return view('admin.dashboard');
    })->name('admin.dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');
    //     Route::view('/sidebar', 'admin.sidebar')->name('sidebar');

    
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('admin.customers.index'); 
        Route::get('all-plans/{id}', [CustomerController::class, 'plans'])->name('admin.customers.plans');
        Route::get('/send-mail', [CustomerController::class, 'customerMail'])->name('admin.customers.customer-mail');
        Route::post('/send-mail', [CustomerController::class, 'sendMail'])->name('admin.customers.send-mail');
    });
    Route::prefix('plans')->group(function () {
        Route::get('/', [PlansController::class, 'index'])->name('admin.plans.index');
        Route::get('/create', [PlansController::class, 'create'])->name('admin.plans.create');
        Route::post('/store', [PlansController::class, 'store'])->name('admin.plans.store');
        Route::get('/edit/{id}', [PlansController::class, 'edit'])->name('admin.plans.edit');
        Route::post('/update/{id}', [PlansController::class, 'update'])->name('admin.plans.update');
        Route::delete('/delete/{id}', [PlansController::class, 'delete'])->name('admin.plans.delete');
        Route::get('/trashed', [PlansController::class, 'trashed'])->name('admin.plans.deleted');
        Route::post('/restore/{id}', [PlansController::class, 'restore'])->name('admin.plans.restore');
        Route::delete('/force-delete/{id}', [PlansController::class, 'forceDelete'])->name('admin.plans.force-delete');
        Route::get('/show/{id}', [PlansController::class, 'show'])->name('admin.plans.show');
    
        Route::get('plan-purchase-history', [PlansController::class, 'purchaseHistory'])->name('admin.plans.purchase-history');
    });
    Route::prefix('plan-permission')->group(function () {
        Route::get('/', [PlanPermissionController::class, 'index'])->name('admin.plan-permission.index');
        Route::get('/create', [PlanPermissionController::class, 'create'])->name('admin.plan-permission.create');
        Route::post('/store', [PlanPermissionController::class, 'store'])->name('admin.plan-permission.store');
        Route::get('/edit/{id}', [PlanPermissionController::class, 'edit'])->name('admin.plan-permission.edit');
        Route::post('/update/{id}', [PlanPermissionController::class, 'update'])->name('admin.plan-permission.update');
        Route::delete('/delete/{id}', [PlanPermissionController::class, 'delete'])->name('admin.plan-permission.delete');
    });

    Route::prefix('mail-history')->group(function () {
        Route::get('/', [AdminMailController::class, 'mailHistory'])->name('admin.mail-history');
        Route::get('/{id}', [AdminMailController::class, 'viewMail'])->name('admin.mail-history.view');
    });
    Route::prefix('admin-users')->group(function (){
        Route::get('/', [AdminUserController::class, 'index'])->name('admin.admin-users.index');
        Route::get('/create', [AdminUserController::class, 'create'])->name('admin.admin-users.create');

    });
    Route::prefix('permissions')->group(function (){
        Route::get('/', [SuperAdminPermissionController::class, 'index'])->name('admin.permissions.index');
        Route::get('/create', [SuperAdminPermissionController::class, 'create'])->name('admin.permissions.create');
        Route::post('/store', [SuperAdminPermissionController::class, 'store'])->name('admin.permissions.store');
    });
    Route::prefix('role')->group(function (){
        Route::get('/',[RolesController::class ,'index'])->name('admin.roles.index');
        Route::get('/create', [RolesController::class, 'create'])->name('admin.roles.create');
        Route::post('/store', [RolesController::class, 'store'])->name('admin.roles.store');
        Route::get('/edit/{id}', [RolesController::class, 'edit'])->name('admin.roles.edit');
        Route::post('/update/{id}', [RolesController::class, 'update'])->name('admin.roles.update');
        Route::delete('/delete/{id}', [RolesController::class, 'delete'])->name('admin.roles.delete');
    });
});