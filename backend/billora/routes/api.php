<?php

use App\Http\Controllers\admin\BillCustomerController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\CustomerController;
use App\Http\Controllers\admin\ProductsController;
use App\Http\Controllers\admin\StocksController;
use App\Http\Controllers\admin\UnitController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\InvoiceController;
use App\Http\Controllers\admin\StoreController;
use App\Models\Unit;

Route::get('/test', function () {
   return response()->json([
      'message' => 'Hello World',
   ]);
});
//admin user
Route::prefix('users')->group(function () {
   //    Route::get('/', [CustomerController::class, 'index']);
   Route::middleware('auth:sanctum')->get('/', [CustomerController::class, 'index']);

   Route::post('/store', [CustomerController::class, 'store']);
   Route::post('/login', [CustomerController::class, 'login']);
   //    Route::post('/logout', [CustomerController::class, 'logout']);
   Route::middleware('auth:sanctum')->post('/logout', [CustomerController::class, 'logout']);
   //due RBAC

});
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/', [CustomerController::class, 'index']);
//     Route::post('/store', [CustomerController::class, 'store']);
//     Route::post('/login', [CustomerController::class, 'login']);
//     Route::post('/users/logout', [CustomerController::class, 'logout']);
// });

//Products
Route::prefix('products')->group(function () {
   Route::get('/', [ProductsController::class, 'index']); //all products
   Route::post('/store', [ProductsController::class, 'store']); //store product
   Route::get('/{id}', [ProductsController::class, 'show']); //single product
   Route::put('/{id}', [ProductsController::class, 'update']); // update product
   Route::delete('/{id}', [ProductsController::class, 'destroy']); // delete product
   Route::patch('/{id}', [ProductsController::class, 'restore']); // restore product
   Route::delete('/{id}/force', [ProductsController::class, 'forceDelete']); // delete product permanently
});
//stocks
Route::prefix('stocks')->group(function () {
   Route::get('/', [StocksController::class, 'index']);
   Route::post('/store', [StocksController::class, 'store']);
   Route::get('/{id}', [StocksController::class, 'edit']);
   Route::put('/{id}', [StocksController::class, 'update']);
   Route::delete('/{id}', [StocksController::class, 'destroy']);
   Route::post('/add-stock/{id}', [StocksController::class, 'addStock']);
});
//units
Route::prefix('units')->group(function () {
   Route::get('/', [UnitController::class, 'index']);
   Route::post('/store', [UnitController::class, 'store']);
   Route::get('/{id}', [UnitController::class, 'edit']);
   Route::put('/{id}', [UnitController::class, 'update']);
   Route::delete('/{id}', [UnitController::class, 'delete']);
});
//brands
Route::prefix('brands')->group(function () {
   Route::get('/', [BrandController::class, 'index']);
   Route::post('/store', [BrandController::class, 'store']);
   Route::get('/{id}', [BrandController::class, 'edit']);
   Route::put('/{id}', [BrandController::class, 'update']);
   Route::delete('/{id}', [BrandController::class, 'delete']);
});
//invoices
Route::prefix('invoice')->group(function () {
   Route::get('/', [InvoiceController::class, 'index']);
   Route::post('/store', [InvoiceController::class, 'store']);
   Route::get('/bill-history', [InvoiceController::class, 'billHistory']);
   Route::get('/{id}', [InvoiceController::class, 'show']);
   Route::put('/{id}', [InvoiceController::class, 'update']);
   Route::delete('/{id}', [InvoiceController::class, 'destroy']);
   
});


// store/shop
Route::prefix('store')->group(function () {
   Route::get('/{id}', [StoreController::class, 'index']);
   Route::post('/store', [StoreController::class, 'store']);
   Route::get('/edit/{id}', [StoreController::class, 'edit']);
   Route::put('/{id}', [StoreController::class, 'update']);
   Route::delete('/{id}', [StoreController::class, 'delete']);
});

//client or bill generation customer
Route::prefix('customer')->group(function () {
   Route::get('/', [BillCustomerController::class, 'index']);
   Route::post('/store', [BillCustomerController::class, 'store']);
   Route::get('/show/{id}', [BillCustomerController::class, 'show']);
   Route::put('/{id}', [BillCustomerController::class, 'update']);
   Route::delete('/{id}', [BillCustomerController::class, 'delete']); //soft delete
   Route::patch('/{id}', [BillCustomerController::class, 'restore']); //restore
   Route::delete('/{id}/force', [BillCustomerController::class, 'forceDelete']); //permanently delete
});

