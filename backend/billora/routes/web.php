<?php
use App\Http\Controllers\admin\CustomerController;
use Illuminate\Support\Facades\Route;
use Google\Client;
use Google\Service\Drive;


Route::get('/', function () {
    return view('welcome');
});
Route::get('/verify-email/{token}', [CustomerController::class, 'verifyEmail']);

Route::get('/google-drive-token', function () {
    $client = new Client();

    $client->setClientId(env('GOOGLE_CLIENT_ID'));
    $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));

    // must match Google redirect URI
    $client->setRedirectUri('http://127.0.0.1:8000/google-drive-token');

    // IMPORTANT for refresh token
    $client->setAccessType('offline');
    $client->setPrompt('consent');

    $client->addScope(Drive::DRIVE);

    // Step 1: Redirect to Google login
    if (!request()->has('code')) {
        return redirect($client->createAuthUrl());
    }

    // Step 2: After Google login
    $token = $client->fetchAccessTokenWithAuthCode(request('code'));

    dd($token);
});