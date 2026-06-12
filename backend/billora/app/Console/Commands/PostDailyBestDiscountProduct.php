<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\ProductImages;
use App\Models\Products;
use App\Models\SocialConnections;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PostDailyBestDiscountProduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:post-daily-best-discount-product';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $connections = SocialConnections::where('is_active', 1)->get();

        foreach ($connections as $connection) {

            // 1. Get highest discount product for this user
            $product = Products::where('user_id', $connection->user_id)
                ->orderByDesc('discount_percentage')
                ->first();
            $newProducts = Products::where('user_id', $connection->user_id)->where('is_active', 1)->where('is_social_posted', false)->get();
            Log::info('this is social connection id:' . $connection->id);
            if (!$product) {
                Log::info('No product found for user ID: ' . $connection->user_id);
                $this->info("No product found for user ID: {$connection->user_id}");
                continue;
            }
            Log::info('facebook posted product: ' . $product);
            // 2. Cloudinary FULL IMAGE URL (already stored in DB)
            $allImages = [];
            // $imageUrl = $product->image;
            $imageUrl = $this->getDiscountImageUrl(
                $product->image,
                $product->discount_percentage
            );

            // Log::info('Instagram image URL', [
            //     'url' => $imageUrl
            // ]);
            $images = ProductImages::where('user_id', $connection->user_id)->where('product_id', $product->id)->get();
            if (!empty($product->image)) {
                $convertImg = $this->getDiscountImageUrl(
                $product->image,
                $product->discount_percentage
            );
                $allImages[] = $convertImg;
            }
            foreach ($images as $img) {
                $allConImg = $this->getDiscountImageUrl(
                $img->image,
                $product->discount_percentage
            );
                if (!empty($allConImg)) {
                    $allImages[] = $allConImg;
                }
            }
            // 3. Caption
            $caption =
                "\n\n TODAY'S BEST DEAL \n" .
                " Discount: {$product->discount_percentage}% OFF\n" .
                "Grab it before it's gone!";
            $newProductsCaption = "\n 🚨 NEW DROP ALERT 🚨\n\n"
                . "✨ Special Offers ✨\n\n"
                . "Grab it before it's gone! ⏱️";

            // 4. INSTAGRAM POST
            //             $permissions = Http::get(
            //     'https://graph.facebook.com/me/permissions',
            //     [
            //         'access_token' => $connection->user_access_token
            //     ]
            // )->json();

            // Log::info('FB PERMISSIONS', $permissions);
            // Instagram post - USE USER ACCESS TOKEN, not page token
            if (!empty($connection->instagram_business_id)) {

                // First, create media container
                if ($imageUrl) {
                    $create = Http::post(
                        "https://graph.facebook.com/v19.0/{$connection->instagram_business_id}/media",
                        [
                            'caption' => $caption,
                            'image_url' => $imageUrl,
                            'access_token' => $connection->user_access_token, //  Use user token!
                        ]
                    );

                    if ($create->failed()) {
                        $this->error("Instagram media creation failed: " . $create->body());
                        continue;
                    }

                    $creationId = $create->json()['id'] ?? null;

                    if ($creationId) {
                        $publish = Http::post(
                            "https://graph.facebook.com/v19.0/{$connection->instagram_business_id}/media_publish",
                            [
                                'creation_id' => $creationId,
                                'access_token' => $connection->user_access_token, //  Use user token!
                            ]
                        );

                        if ($publish->failed()) {
                            $this->error("Instagram publish failed: " . $publish->body());
                        } else {
                            $this->info("Instagram posted for user {$connection->user_id}");
                        }
                    }
                } else {
                    $create = Http::post(
                        "https://graph.facebook.com/v19.0/{$connection->instagram_business_id}/media",
                        [
                            'caption' => $caption,
                            'access_token' => $connection->user_access_token, //  Use user token!
                        ]
                    );

                    if ($create->failed()) {
                        $this->error("Instagram media creation failed: " . $create->body());
                        continue;
                    }

                    $creationId = $create->json()['id'] ?? null;

                    if ($creationId) {
                        $publish = Http::post(
                            "https://graph.facebook.com/v19.0/{$connection->instagram_business_id}/media_publish",
                            [
                                'creation_id' => $creationId,
                                'access_token' => $connection->user_access_token, //  Use user token!
                            ]
                        );

                        if ($publish->failed()) {
                            $this->error("Instagram publish failed: " . $publish->body());
                        } else {
                            $this->info("Instagram posted for user {$connection->user_id}");
                        }
                    }
                }
            }

            // 5. FACEBOOK PAGE POST
            // if (!empty($connection->page_id)) {
            //     Log::info('facebook page id:'.$connection->page_id);

            //     $post = Http::post(
            //         "https://graph.facebook.com/v19.0/{$connection->page_id}/photos",
            //         [
            //             // 'url' => $imageUrl ?? '',
            //             'caption' => $caption,
            //             'access_token' => $connection->page_access_token,
            //         ]
            //     );
            //     Log::info('facebook post:'.$post);
            //     if(!$post){
            //         Log::info('facebook post failed');
            //     }
            //     $this->info("Facebook posted for user {$connection->user_id}");
            // }
            if (!empty($connection->page_id)) {

                Log::info('facebook page id: ' . $connection->page_id);

                // if (!empty($product->image)) {

                //     $post = Http::post(
                //         "https://graph.facebook.com/v19.0/{$connection->page_id}/photos",
                //         [
                //             'url' => $product->image,
                //             'caption' => $caption,
                //             'access_token' => $connection->page_access_token,
                //         ]
                //     );
                // } else {

                //     $post = Http::post(
                //         "https://graph.facebook.com/v19.0/{$connection->page_id}/feed",
                //         [
                //             'message' => $caption,
                //             'access_token' => $connection->page_access_token,
                //         ]
                //     );
                // }
                $attachedImage = [];

                foreach ($allImages as $image) {

                    $upload = Http::post(
                        "https://graph.facebook.com/v19.0/{$connection->page_id}/photos",
                        [
                            'url' => $image,
                            'published' => false,
                            'access_token' => $connection->page_access_token,
                        ]
                    );

                    Log::info('FB image upload', $upload->json());

                    if (
                        $upload->successful() &&
                        isset($upload->json()['id'])
                    ) {
                        $attachedImage[] = [
                            'media_fbid' => $upload->json()['id']
                        ];
                    }
                }
                if (count($attachedImage) > 0) {

                    $payload = [
                        'message' => $caption,
                        'access_token' => $connection->page_access_token,
                    ];

                    foreach ($attachedImage as $index => $media) {
                        $payload["attached_media[$index]"] = json_encode($media);
                    }

                    $post = Http::asForm()->post(
                        "https://graph.facebook.com/v19.0/{$connection->page_id}/feed",
                        $payload
                    );
                } else {

                    $post = Http::post(
                        "https://graph.facebook.com/v19.0/{$connection->page_id}/feed",
                        [
                            'message' => $caption,
                            'access_token' => $connection->page_access_token,
                        ]
                    );
                }
                if ($newProducts->count() > 0) {
                    foreach ($newProducts as $product) {
                        Log::info('new product found', [
                            'id' => $product->id,
                            'name' => $product->name,
                            'is_social_posted' => $product->is_social_posted,
                        ]);
                    }
                    $albumImages = [];
                    foreach ($newProducts as $newProduct) {
                        // Main image
                        if (!empty($newProduct->image)) {
                            $albumImages[] = $newProduct->image;
                        }
                        // Gallery images
                        $galleryImages = ProductImages::where('user_id', $connection->user_id)->where('product_id', $newProduct->id)->get();

                        foreach ($galleryImages as $img) {
                            if (!empty($img->image)) {
                                $albumImages[] = $img->image;
                            }
                        }
                    }
                    // $newProduct->update([
                    //     'is_social_posted' => true,
                    // ]);
                    // if (!empty($product->image)) {
                    //     Http::post(
                    //         "https://graph.facebook.com/v19.0/{$connection->page_id}/photos",
                    //         [
                    //             'url' => $newProduct->image ? $newProduct->image : '',
                    //             'message' => $newProductsCaption,
                    //             'access_token' => $connection->page_access_token,
                    //         ]
                    //     );
                    // } else {
                    //     Http::post(
                    //         "https://graph.facebook.com/v19.0/{$connection->page_id}/feed",
                    //         [
                    //             'message' => $newProductsCaption,
                    //             'access_token' => $connection->page_access_token,
                    //         ]
                    //     );
                    // }
                    $attachedMedia = [];

                    foreach ($albumImages as $imageUrl) {

                        $upload = Http::post(
                            "https://graph.facebook.com/v19.0/{$connection->page_id}/photos",
                            [
                                'url' => $imageUrl,
                                'published' => false,
                                'access_token' => $connection->page_access_token,
                            ]
                        );

                        Log::info('FB image upload', $upload->json());

                        if (
                            $upload->successful() &&
                            isset($upload->json()['id'])
                        ) {
                            $attachedMedia[] = [
                                'media_fbid' => $upload->json()['id']
                            ];
                        }
                    }
                    if (count($attachedMedia) > 0) {

                        $payload = [
                            'message' => $newProductsCaption,
                            'access_token' => $connection->page_access_token,
                        ];

                        foreach ($attachedMedia as $index => $media) {
                            $payload["attached_media[$index]"] = json_encode($media);
                        }

                        $post = Http::asForm()->post(
                            "https://graph.facebook.com/v19.0/{$connection->page_id}/feed",
                            $payload
                        );
                    } else {

                        $post = Http::post(
                            "https://graph.facebook.com/v19.0/{$connection->page_id}/feed",
                            [
                                'message' => $newProductsCaption,
                                'access_token' => $connection->page_access_token,
                            ]
                        );
                    }
                    foreach ($newProducts as $newProduct) {
                        $newProduct->update([
                            'is_social_posted' => true,
                        ]);
                    }
                }
                Log::info('facebook post response', $post->json());

                if ($post->failed()) {
                    Log::info('facebook post failed', [
                        'error' => $post->body()
                    ]);
                }

                $this->info("Facebook text posted for user {$connection->user_id}");
            }
        }

        $this->info("Daily best discount product posting completed.");
    }

    private function getDiscountImageUrl($imageUrl, $discount)
{
    if (!$discount || $discount <= 0) {
        return $imageUrl;
    }

    return str_replace(
    '/upload/',
    '/upload/' .
    'c_fill,w_1080,h_1350/' .
    'l_text:Arial_140_bold:' . rawurlencode(' '.$discount . '%25 OFF ') .
    ',co_white,b_rgb:FF0000,g_north_east,x_40,y_30,w_330,h_100/',

    $imageUrl
);
}
}
