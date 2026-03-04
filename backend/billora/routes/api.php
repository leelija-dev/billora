<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\CustomerController;
use App\Http\Controllers\admin\ProductsController;
use App\Http\Controllers\admin\StocksController;
Route::get('/test', function () {
    return response()->json([
        'message' => 'Hello World',
    ]);
});
Route::prefix('users')->group(function () {
    Route::get('/', [CustomerController::class, 'index']);
    Route::post('/store', [CustomerController::class, 'store']);
    //due RBAC

});

//Products
Route::prefix('products')->group(function () {
    Route::get('/', [ProductsController::class, 'index']); //all products
    Route::post('/store', [ProductsController::class, 'store']); // store product
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