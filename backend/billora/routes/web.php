<?php
use App\Http\Controllers\admin\CustomerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/verify-email/{token}', [CustomerController::class, 'verifyEmail']);