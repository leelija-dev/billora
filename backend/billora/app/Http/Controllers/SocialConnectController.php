<?php

namespace App\Http\Controllers;

use App\Models\Customers;
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
            'client_id' => env('META_APP_ID',1020309880319734),
            'redirect_uri' => env('META_CALLBACK_URL', 'https://api.thefastbill.com/api/social/facebook/callback'),//META_CALLBACK_URL//env('APP_URL').'/api/social/facebook/callback',
            'config_id' => env('META_CONFIG_ID','2008621436419759'),
            'response_type' => 'code',
            'state' => $userId
        ]);
        // Log::info("redirect url:".$url);
        // Log::info("env('APP_URL')".env('APP_URL'));
        // Log::info("META_CALLBACK_URL:".env('META_CALLBACK_URL'));
        // Log::info("config call back url:".config('app.callback_url'));
        return redirect($url);
    }
    public function callback(Request $request)
    {
         Log::info('Facebook callback hit', [
        'code' => $request->code,
        'state' => $request->state,
        'url' => $request->fullUrl(),
    ]);
        $userId = $request->state;
        Log::info("called");
        // 1. Exchange CODE → Short-lived token
        $tokenResponse = Http::get("https://graph.facebook.com/v19.0/oauth/access_token", [
            'client_id' => env('META_APP_ID',1020309880319734),
            'client_secret' => env('META_APP_SECRET','062a93a7a50427fb2a22d6b0acbe0619'),
            'redirect_uri' => env('META_CALLBACK_URL','https://api.thefastbill.com/api/social/facebook/callback'),
            'code' => $request->code,
        ])->json();
        
        if (!isset($tokenResponse['access_token'])) {
            return response()->json($tokenResponse);
        }

        $shortLivedUserToken = $tokenResponse['access_token'];

        // 2. Exchange → Long-lived token
        $longLivedTokenResponse = Http::get("https://graph.facebook.com/v19.0/oauth/access_token", [
            'grant_type' => 'fb_exchange_token',
            'client_id' => env('META_APP_ID',1020309880319734),
            'client_secret' => env('META_APP_SECRET','062a93a7a50427fb2a22d6b0acbe0619'),
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

        return redirect(env('FRONTEND_ADMIN_URL').'/social-link');
    }
    public function showConnection($id){
        $customer = Customers::findOrFail($id);
        try{
        if(!$customer){
                return response()->json([
                    'status'=>false,
                    'message'=>'customer not found!'
                    
                ]);
        }
        $connection = SocialConnections::where('user_id',$id)->first();
        return response()->json([
            'status'=>true,
            'message'=> "Social connection",
            'data'=>$connection
        ]);
        }catch(\Exception $e){
            return response()->json([
                'status'=>false,
                'message'=>$e->getMessage()
            ]); 
        }
    }
    public function updateSocialConnection(Request $request, $id)  // boolean status 0/1
    {
        $user = Auth::user()->id;
        $data = $request->validate([
            'status' => 'required|boolean'
        ]);
        try {
            if($user != $id){
                return response()->json([
                    'status' => false,
                    'message' => "Unauthorized user"
                ]);
            }
            $customer = Customers::findOrFail($user);
            if(!$customer){
                return response()->json([
                    'status' => false,
                    'message' => "customer not found"
                ]);
            }
            $connection = SocialConnections::where('user_id', $user)->first();
            if(!$connection){
                return response()->json([
                    'status' => false,
                    'message' => "Social connection not found.Please connect first!"
                ]);
            }
            if($connection){
            $connection->update([
                'is_active' => $data['status']
            ]);
            }
            return response()->json([
                'status' => true,
                'message' => "Social connection status updated successfully",
                'data' => $connection
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'=>false,
                'message'=>$e->getMessage()
            ]);
        }
    }
}
