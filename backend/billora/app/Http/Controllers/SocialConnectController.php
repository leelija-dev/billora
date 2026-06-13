<?php

namespace App\Http\Controllers;

use App\Models\SocialConnections;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SocialConnectController extends Controller
{
   public function redirect(Request $request)
{
    $userId = Auth::user()->id;

    $url = "https://www.facebook.com/dialog/oauth?" . http_build_query([
        'client_id' => env('META_APP_ID'),
        'redirect_uri' => env('META_CALLBACK_URL'),
        'config_id' => env('META_CONFIG_ID'),
        'response_type' => 'code',
        'state' => $userId
    ]);

    return redirect($url);
}
public function callback(Request $request)
{
    $userId = $request->state;

    // 1. Exchange CODE → Short-lived token
    $tokenResponse = Http::get("https://graph.facebook.com/v19.0/oauth/access_token", [
        'client_id' => env('META_APP_ID'),
        'client_secret' => env('META_APP_SECRET'),
        'redirect_uri' => env('META_CALLBACK_URL'),
        'code' => $request->code,
    ])->json();

    if (!isset($tokenResponse['access_token'])) {
        return response()->json($tokenResponse);
    }

    $shortLivedUserToken = $tokenResponse['access_token'];

    // 2. Exchange → Long-lived token
    $longLivedTokenResponse = Http::get("https://graph.facebook.com/v19.0/oauth/access_token", [
        'grant_type' => 'fb_exchange_token',
        'client_id' => env('META_APP_ID'),
        'client_secret' => env('META_APP_SECRET'),
        'fb_exchange_token' => $shortLivedUserToken
    ])->json();

    $longLivedUserToken = $longLivedTokenResponse['access_token'] ?? null;

    // 3. Get pages
    $pages = Http::get("https://graph.facebook.com/me/accounts", [
        'access_token' => $longLivedUserToken
    ])->json();

    if (!isset($pages['data'])) {
        return response()->json($pages);
    }

    foreach ($pages['data'] as $page) {

        // 4. Get Instagram account
        $ig = Http::get("https://graph.facebook.com/{$page['id']}", [
            'fields' => 'instagram_business_account',
            'access_token' => $page['access_token']
        ])->json();
        // Log::info('Page ID', ['page_id' => $page['id']]);

        // Log::info('Instagram Response', $ig);
        
        // 5. Save
        SocialConnections::updateOrCreate(
            [
                'user_id' => $userId,
                'page_id' => $page['id']
            ],
            [
                'page_name' => $page['name'],
                'page_access_token' => $page['access_token'],
                'user_access_token' => $longLivedUserToken,
                'instagram_business_id' => $ig['instagram_business_account']['id'] ?? null,
                'token_expires_at' => now()->addDays(60),
                'is_active' => 1
            ]
        );
    }

    return redirect('/dashboard');
}
}
