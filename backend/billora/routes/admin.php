<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\superadmin\CustomerController;
use App\Http\Controllers\admin\superadmin\PlansController;
use App\Http\Controllers\admin\superadmin\PlanPermissionController;
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
    
    });
    Route::prefix('plan-permission')->group(function () {
        Route::get('/', [PlanPermissionController::class, 'index'])->name('admin.plan-permission.index');
    });

});