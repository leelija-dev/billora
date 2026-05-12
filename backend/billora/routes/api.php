<?php

use App\Http\Controllers\admin\BillCustomerController;
use App\Http\Controllers\admin\BlogController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\CustomerController;
use App\Http\Controllers\admin\ProductsController;
use App\Http\Controllers\admin\StocksController;
use App\Http\Controllers\admin\UnitController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\InvoiceController;
use App\Http\Controllers\admin\StoreController;
use App\Models\Unit;
use App\Http\Controllers\admin\PlanController;
use App\Http\Controllers\admin\CategoriesController;
use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\admin\CartsController;
use App\Http\Controllers\admin\ReportController;
use App\Http\Controllers\admin\PlanPurchaseHistoryController;
use App\Http\Controllers\admin\PaymentController;
use App\Http\Controllers\admin\BusinessTypeController;
use App\Http\Controllers\admin\ContactUsController;
use App\Http\Controllers\admin\GstController;
use App\Http\Controllers\admin\MedicineTypeController;
use App\Http\Controllers\admin\PackageCostController;
use App\Http\Controllers\admin\UserOrdersController;
use App\Http\Controllers\PlanExpiryController;
use App\Http\Controllers\admin\TestimonialsController;
use App\Models\User;
use App\Models\UserOrders;


// Public routes
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

Route::get('/test', function () {
   return response()->json([
       'message' => 'Hello World',
      'cors' => 'enabled', 
      'timestamp' => now()

   ]);
});

Route::post('/users/login', [CustomerController::class, 'login']);
Route::post('/users/register', [CustomerController::class, 'store']);
Route::get('/verify-email/{token}', [CustomerController::class, 'verifyEmail']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [CustomerController::class, 'index']);
    Route::get('/users/check-session', [CustomerController::class, 'checkSession']);
    Route::post('/users/logout', [CustomerController::class, 'logout']);
    Route::get('/users/edit/{id}', [CustomerController::class, 'edit']);
    Route::put('/users/update/{id}', [CustomerController::class, 'update']);
    Route::put('/users/update-password/{id}', [CustomerController::class, 'updatePassword']);
});
// Route::prefix('auth/session')->group(function () {
//     Route::post('/login', [CustomerController::class, 'login']);
//     Route::post('/logout', [CustomerController::class, 'logout']);
//     Route::get('/check', [CustomerController::class, 'checkSession']);
// });
//admin user
// Route::prefix('users')->group(function () {
//    //    Route::get('/', [CustomerController::class, 'index']);
//    Route::middleware('auth:sanctum')->get('/', [CustomerController::class, 'index']);

//    Route::post('/register', [CustomerController::class, 'store']);
//    Route::post('/login', [CustomerController::class, 'login']);
//    Route::middleware('auth:sanctum')->get('/edit/{id}', [CustomerController::class, 'edit']);
//    Route::middleware('auth:sanctum')->put('/update/{id}', [CustomerController::class, 'update']);
//    Route::middleware('auth:sanctum')->put('/update-password/{id}', [CustomerController::class, 'updatePassword']);
//    // Route::get
//    //    Route::post('/logout', [CustomerController::class, 'logout']);
//    Route::middleware('auth:sanctum')->post('/logout', [CustomerController::class, 'logout']);
//    //due RBAC

// });
// 
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/', [CustomerController::class, 'index']);
//     Route::post('/store', [CustomerController::class, 'store']);
//     Route::post('/login', [CustomerController::class, 'login']);
//     Route::post('/users/logout', [CustomerController::class, 'logout']);
// });

//Products
Route::middleware('auth:sanctum')->prefix('products')->group(function () {
   Route::get('/', [ProductsController::class, 'index']); //all products
   Route::get('/create/{id}', [ProductsController::class, 'create']);  // product create page data(brand,unit,category)
   Route::post('/store', [ProductsController::class, 'store']); //store product
   Route::get('/{id}', [ProductsController::class, 'show']); //single product
   Route::put('/{id}', [ProductsController::class, 'update']); // update product
   Route::patch('/{id}', [ProductsController::class, 'restore']); // restore product
   Route::get('/deleted-products/{id}',[ProductsController::class, 'deletedProducts']); // deleted products
   Route::delete('/{id}/force', [ProductsController::class, 'forceDelete']); // delete product permanently
   Route::delete('/bulk-delete', [ProductsController::class, 'bulkDelete']); // bulk delete product (soft delete)
   Route::delete('/bulk-force-delete', [ProductsController::class, 'bulkForceDelete']); // bulk delete product permanently
   Route::delete('/{id}', [ProductsController::class, 'destroy']); // delete product soft delete
});
//stocks
Route::middleware('auth:sanctum')->prefix('stocks')->group(function () {
   Route::get('/', [StocksController::class, 'index']);
   Route::get('/create', [StocksController::class, 'create']);
   Route::post('/store', [StocksController::class, 'store']);
   Route::get('/{id}', [StocksController::class, 'edit']);
   Route::put('/{id}', [StocksController::class, 'update']);
   Route::delete('/{id}', [StocksController::class, 'destroy']);
   Route::post('/add-stock/{id}', [StocksController::class, 'addStock']);
   Route::get('/stock-alert', [StocksController::class, 'stockalert']);
});
//units
Route::middleware('auth:sanctum')->prefix('units')->group(function () {
   Route::get('/', [UnitController::class, 'index']);
   Route::post('/store', [UnitController::class, 'store']);
   Route::get('/{id}', [UnitController::class, 'edit']);
   Route::put('/{id}', [UnitController::class, 'update']);
   Route::delete('/{id}', [UnitController::class, 'delete']);
});
Route::middleware('auth:sanctum')->prefix('brands')->group(function () {
   Route::get('/', [BrandController::class, 'index']);
   Route::post('/store', [BrandController::class, 'store']);
   Route::get('/{id}', [BrandController::class, 'edit']);
   Route::post('/{id}', [BrandController::class, 'update']);
   Route::delete('/{id}', [BrandController::class, 'delete']);
});
//invoices & bill generate from stock table(stock management)
Route::middleware('auth:sanctum')->prefix('invoice')->group(function () {
   Route::get('/', [InvoiceController::class, 'index']); //for bill generate
   Route::post('/store', [InvoiceController::class, 'store']);
   Route::put('/{id}', [InvoiceController::class, 'update']);
   Route::get('/bill-history', [InvoiceController::class, 'billHistory']);
   Route::get('/{id}', [InvoiceController::class, 'show']);
   Route::put('/update-bill-status/{id}', [InvoiceController::class, 'updateBillStatus']);
   Route::delete('/{id}', [InvoiceController::class, 'destroy']);
   

   // user order hisrtory
   Route::get('/user-order-history/{id}', [UserOrdersController::class, 'userOrderHistory']);
   Route::put('/update-order-status/{id}', [UserOrdersController::class, 'updateOrderStatus']);
   Route::put('/update-payment-status/{id}', [UserOrdersController::class, 'updatePaymentStatus']);
   Route::put('/update-order-payment/{id}', [UserOrdersController::class, 'updateOrderPayment']);
   Route::get('/user-order-due/{id}',[UserOrdersController::class,'userOrderDue']);
});
//bill generate from product table(with out stock management)
Route::prefix('invoices')->group(function () {
   Route::get('/{id}', [InvoiceController::class, 'bill']);
   Route::post('/store', [InvoiceController::class, 'billStore']);
   
});


// store or shop
Route::middleware('auth:sanctum')->prefix('store')->group(function () {
   Route::get('/{id}', [StoreController::class, 'index']);
   Route::post('/store', [StoreController::class, 'store']);
   Route::get('/edit/{id}', [StoreController::class, 'edit']);
   Route::put('/{id}', [StoreController::class, 'update']);
   Route::delete('/{id}', [StoreController::class, 'delete']);
});

//client or bill generation customer
Route::middleware('auth:sanctum')->prefix('customer')->group(function () {
 
   Route::post('/store', [BillCustomerController::class, 'store']);
   Route::get('/trashed', [BillCustomerController::class, 'trashed']);
   Route::get('/{id}', [BillCustomerController::class, 'index']);
   Route::get('/show/{id}', [BillCustomerController::class, 'show']);
   Route::delete('/{id}/force', [BillCustomerController::class, 'forceDelete']); //permanently delete
   Route::put('/due-payment/{id}', [BillCustomerController::class, 'duePayment']); // due payment
   Route::put('/{id}', [BillCustomerController::class, 'update']);
   Route::delete('/{id}', [BillCustomerController::class, 'delete']); //soft delete
   Route::patch('/{id}', [BillCustomerController::class, 'restore']); //restore
});

// categories
Route::middleware('auth:sanctum')->prefix('categories')->group(function () {
   Route::get('/', [CategoriesController::class, 'index']);
   // Route::get('/create', [CategoriesController::class, 'create']);
   Route::post('/store', [CategoriesController::class, 'store']);
   Route::get('/{id}', [CategoriesController::class, 'edit']);
   Route::put('/{id}', [CategoriesController::class, 'update']);
   Route::delete('/{id}', [CategoriesController::class, 'delete']);
});

Route::prefix('plans')->group(function (){
   Route::get('/', [PlanController::class, 'index']);
   Route::post('/store',[PlanController::class, 'store']);
   Route::get('/trashed', [PlanController::class, 'trashed']);
   Route::get('/search', [PlanController::class, 'search']);
   Route::get('/{id}', [PlanController::class, 'edit']);
   Route::put('/{id}', [PlanController::class, 'update']);
   Route::delete('/{id}', [PlanController::class, 'delete']);
   Route::patch('/{id}', [PlanController::class, 'restore']);
   Route::delete('/{id}/force', [PlanController::class, 'forceDelete']);
});
//cart products
Route::middleware('auth:sanctum')->prefix('carts')->group(function () {
   Route::get('/', [CartsController::class, 'index']);
   Route::post('/store', [CartsController::class, 'store']);
   Route::put('/{id}', [CartsController::class, 'update']);
   Route::delete('/{id}', [CartsController::class, 'destroy']);
});


Route::prefix('dashboard')->group(function (){
   Route::get('/overview/{id}', [DashboardController::class, 'index']);
   
});
//reports 
Route::middleware('auth:sanctum')->prefix('reports')->group(function () {
   Route::get('/', [ReportController::class, 'index']);
});
// plan purchase history
Route::middleware('auth:sanctum')->prefix('plans-purchase-history')->group(function () {
   Route::get('/{id}', [PlanPurchaseHistoryController::class, 'index']);
});

//payment 
Route::prefix('cashfree')->group(function () {
    Route::post('/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/upgrade-plan', [PaymentController::class, 'upgradePlan']);
    Route::get('/verify/{order_id}', [PaymentController::class, 'verifyPayment']);
});

//plan expire reminder
Route::middleware('auth:sanctum')->prefix('plan-expire-reminder')->group(function () {
   Route::get('/{id}', [PlanExpiryController::class, 'getExpiringPlans']);
});

//public user access product with out login for restaurant,etc.
Route::prefix('restaurant-all-products')->group(function () {
   Route::get('/{id}', [ProductsController::class, 'userProducts']);  // for user products by id
   Route::get('/category/{id}', [ProductsController::class, 'categoryProducts']);  // for user products by category({slug}')  

});

//user product order 
Route::prefix('orders')->group(function () { 
   Route::post('/store', [UserOrdersController::class, 'store']);

});

Route::prefix('business-type')->group(function (){
   Route::get('/', [BusinessTypeController::class, 'index']);
});
Route::middleware('auth:sanctum')->prefix('packages-cost')->group(function () {
   Route::get('/{id}', [PackageCostController::class, 'index']);
   Route::post('/store/{id}', [PackageCostController::class, 'store']);
   Route::get('/edit/{id}', [PackageCostController::class, 'edit']);
   Route::put('/update/{id}', [PackageCostController::class, 'update']);
   Route::delete('/delete/{id}', [PackageCostController::class, 'delete']);
});

Route::prefix('contact-us')->group(function () {
   Route::get('/', [ContactUsController::class, 'index']);
   Route::post('/store', [ContactUsController::class, 'store']);
});
Route::middleware('auth:sanctum')->prefix('medicine-type')->group(function () {
   Route::get('/{id}', [MedicineTypeController::class, 'index']);
   Route::post('/store', [MedicineTypeController::class, 'store']);
   Route::get('/edit/{id}', [MedicineTypeController::class, 'edit']);
   Route::put('/update/{id}', [MedicineTypeController::class, 'update']);
   Route::delete('/delete/{id}', [MedicineTypeController::class, 'delete']);
});
Route::prefix('testimonial')->group(function () {
   Route::get('/', [TestimonialsController::class, 'index']);
});
Route::prefix('/blog')->group(function (){
   Route::get('/', [BlogController::class, 'index']);
   Route::get('/{slug}', [BlogController::class, 'show']);
   Route::get('/all-categories', [BlogController::class, 'allCategrories']);
   
});
Route::middleware('auth:sanctum')->prefix('gst-collection')->group(function () {
   Route::get('/{id}',[GstController::class, 'index']);     //register user id
   Route::get('/all-products/{id}', [GstController::class, 'productDetails']);   //product id
   Route::put('/update-status/{id}', [GstController::class, 'updateStatus']);
});