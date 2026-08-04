<?php 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\superadmin\DashboardController;
use App\Http\Controllers\admin\superadmin\AdminMailController;
use App\Http\Controllers\admin\superadmin\AdminUserController;
use App\Http\Controllers\admin\superadmin\BusinessTypeController;
use App\Http\Controllers\admin\superadmin\ContactController;
use App\Http\Controllers\admin\superadmin\CustomerController;
use App\Http\Controllers\admin\superadmin\PlansController;
use App\Http\Controllers\admin\superadmin\PlanPermissionController;
use App\Http\Controllers\admin\superadmin\RolesController;
use App\Http\Controllers\admin\superadmin\SuperAdminPermissionController;
use App\Http\Controllers\admin\superadmin\TestimonialsController;
use App\Models\AdminMailHistory;
use App\Models\AdminUser;
use App\Models\SuperAdminPermission;
use App\Http\Controllers\admin\superadmin\TagsController;
use App\Http\Controllers\admin\superadmin\BlogController;
use App\Http\Controllers\admin\superadmin\BlogCategoriesController;
use App\Http\Controllers\admin\superadmin\FeaturesController;

Route::middleware(['web', 'admin.guest'])->prefix('admin')->group(function () {
    Route::view('/login', 'admin.login')->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('admin.login');
});
 
// Authenticated admin routes
Route::middleware(['web', 'admin.auth'])->prefix('admin')->group(function () {
    Route::get('/logout', function() {
        abort(404);
    });
    // Route::get('/', function() {
    //     return view('admin.dashboard');
    // })->name('admin.dashboard');
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');
    //     Route::view('/sidebar', 'admin.sidebar')->name('sidebar');

    
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('admin.customers.index'); 
        Route::get('all-plans/{id}', [CustomerController::class, 'plans'])->name('admin.customers.plans');
        Route::get('/send-mail', [CustomerController::class, 'customerMail'])->name('admin.customers.customer-mail');
        Route::post('/send-mail', [CustomerController::class, 'sendMail'])->name('admin.customers.send-mail');
        // Route::get('mail-verify/{id}', [App\Http\Controllers\admin\CustomerController::class, 'mailVerify'])->name('admin.customers.mail-verify');
        Route::get('/send-verification-mail/{id}', [CustomerController::class, 'sendVerificationMail'])->name('customer.sendVerificationMail');
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
        Route::post('update-end-date/{id}',[PlansController::class,'updateEndDate'])->name('admin.plans.update-end-date');
    });
    Route::prefix('features')->group(function () {
        Route::get('/', [FeaturesController::class, 'index'])->name('admin.features.index');
        Route::get('/create', [FeaturesController::class, 'create'])->name('admin.features.create');
        Route::post('/store', [FeaturesController::class, 'store'])->name('admin.features.store');
        Route::get('/edit/{id}', [FeaturesController::class, 'edit'])->name('admin.features.edit');
        Route::post('/update/{id}', [FeaturesController::class, 'update'])->name('admin.features.update');
        Route::delete('/delete/{id}', [FeaturesController::class, 'delete'])->name('admin.features.delete');
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
        Route::post('/store', [AdminUserController::class, 'store'])->name('admin.admin-users.store');
        Route::get('/edit/{id}',[AdminUserController::class, 'edit'])->name('admin.admin-users.edit');
        Route::post('/update/{id}',[AdminUserController::class, 'update'])->name('admin.admin-users.update');
        Route::delete('/delete/{id}',[AdminUserController::class, 'destroy'])->name('admin.admin-users.destroy');
        Route::get('/update-pssword/{id}',[AdminUserController::class, 'showPassword'])->name('admin.admin-users.show-password');
        Route::post('/update-password/{id}',[AdminUserController::class, 'updatePassword'])->name('admin.admin-users.update-password');

    });
    Route::prefix('permissions')->group(function (){
        Route::get('/', [SuperAdminPermissionController::class, 'index'])->name('admin.permissions.index');
        Route::get('/create', [SuperAdminPermissionController::class, 'create'])->name('admin.permissions.create');
        Route::post('/store', [SuperAdminPermissionController::class, 'store'])->name('admin.permissions.store');
        Route::get('/edit/{id}', [SuperAdminPermissionController::class, 'edit'])->name('admin.permissions.edit');
        Route::post('/update/{id}', [SuperAdminPermissionController::class, 'update'])->name('admin.permissions.update');
        Route::delete('/delete/{id}', [SuperAdminPermissionController::class, 'destroy'])->name('admin.permissions.destroy');
    });
    Route::prefix('role')->group(function (){
        Route::get('/',[RolesController::class ,'index'])->name('admin.roles.index');
        Route::get('/create', [RolesController::class, 'create'])->name('admin.roles.create');
        Route::post('/store', [RolesController::class, 'store'])->name('admin.roles.store');
        Route::get('/edit/{id}', [RolesController::class, 'edit'])->name('admin.roles.edit');
        Route::post('/update/{id}', [RolesController::class, 'update'])->name('admin.roles.update');
        Route::delete('/delete/{id}', [RolesController::class, 'delete'])->name('admin.roles.delete');
    });
    Route::prefix('business-types')->group(function () {
       Route::get('/', [BusinessTypeController::class, 'index'])->name('admin.business-types.index');
       Route::get('/create', [BusinessTypeController::class, 'create'])->name('admin.business-types.create');
       Route::post('/store', [BusinessTypeController::class, 'store'])->name('admin.business-types.store');
       Route::get('/edit/{id}', [BusinessTypeController::class, 'edit'])->name('admin.business-types.edit');
       Route::post('/update/{id}', [BusinessTypeController::class, 'update'])->name('admin.business-types.update');
       Route::delete('/delete/{id}', [BusinessTypeController::class, 'delete'])->name('admin.business-types.delete');
    });
    Route::prefix('contact-us')->group(function () {
        Route::get('/', [ContactController::class, 'index'])->name('admin.contacts.index');
        Route::get('/view/{id}', [ContactController::class, 'view'])->name('admin.contacts.view');
        Route::get('/send-mail/{id}', [ContactController::class, 'sendMail'])->name('admin.contacts.send-mail');
        Route::post('/send-mail', [ContactController::class, 'mailSend'])->name('admin.contacts.mail-send');
    });

    Route::prefix('testimonial')->group(function () {
        Route::get('/', [TestimonialsController::class, 'index'])->name('admin.testimonial.index');
        Route::get('/create', [TestimonialsController::class, 'create'])->name('admin.testimonial.create');
        Route::post('/store', [TestimonialsController::class, 'store'])->name('admin.testimonial.store');
        Route::get('/edit/{id}', [TestimonialsController::class, 'edit'])->name('admin.testimonial.edit');
        Route::post('/update/{id}', [TestimonialsController::class, 'update'])->name('admin.testimonial.update');
        Route::delete('/delete/{id}', [TestimonialsController::class, 'delete'])->name('admin.testimonial.delete');
    });
    Route::prefix('blogs')->group(function () {
        Route::get('/',[BlogController::class,'index'])->name('admin.blogs.index');
        Route::get('/create',[BlogController::class,'create'])->name('admin.blogs.create');
        Route::post('/store',[BlogController::class,'store'])->name('admin.blogs.store');
        Route::get('/edit/{id}',[BlogController::class,'edit'])->name('admin.blogs.edit');
        Route::post('/update/{id}',[BlogController::class,'update'])->name('admin.blogs.update');
        Route::delete('/delete/{id}',[BlogController::class,'destroy'])->name('admin.blogs.destroy');
        Route::get('/trashed',[BlogController::class,'trashed'])->name('admin.blogs.trash');
        Route::delete('/force-delete/{id}',[BlogController::class,'forceDelete'])->name('admin.blogs.force-delete');
        Route::post('/restore/{id}',[BlogController::class,'restore'])->name('admin.blogs.restore');
        
    });
    Route::prefix('blog-tag')->group(function (){
        Route::get('/',[TagsController::class,'index'])->name('admin.blog-tag.index');
        Route::get('/create',[TagsController::class,'create'])->name('admin.blog-tag.create');
        Route::post('/store',[TagsController::class,'store'])->name('admin.blog-tag.store');
        Route::get('/edit/{id}',[TagsController::class,'edit'])->name('admin.blog-tag.edit');
        Route::post('/update/{id}',[TagsController::class,'update'])->name('admin.blog-tag.update');
        Route::post('/delete/{id}',[TagsController::class,'destroy'])->name('admin.blog-tag.destroy');
    });
    Route::prefix('category')->group(function () {
        Route::get('/', [BlogCategoriesController::class, 'index'])->name('admin.category.index');
        Route::get('/create', [BlogCategoriesController::class, 'create'])->name('admin.category.create');
        Route::post('/store', [BlogCategoriesController::class, 'store'])->name('admin.category.store');
        Route::get('/edit/{id}', [BlogCategoriesController::class, 'edit'])->name('admin.category.edit');
        Route::post('/update/{id}', [BlogCategoriesController::class, 'update'])->name('admin.category.update');
        Route::post('/delete/{id}', [BlogCategoriesController::class, 'destroy'])->name('admin.category.destroy');    
    });  
    
});