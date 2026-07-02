<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Products;
use App\Models\Unit;
use App\Models\Brand;
use App\Models\BusinessPermission;
use App\Models\Categories;
use App\Models\Stocks;
use App\Models\Customers;
use App\Models\InputPermission;
use App\Models\PlanBusinessType;
use App\Models\ProductImages;
use App\Models\ProductVariant;
use App\Models\StockHistory;
use App\Models\Store;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
// use BaconQrCode\Renderer\Image\Png;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Writer;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Milon\Barcode\Facades\DNS1DFacade as DNS1D;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $page = $request->get('page', 1);
            $search = $request->search ?? 'all';


            // Unique cache key
            $cacheKey = "products_{$user}_{$search}_page_{$page}";
            $fromCache = Cache::tags(['products_user_' . $user])->has($cacheKey);
            $customer = Customers::findOrFail($user);
            $startTime = microtime(true);
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->select('pp.slug')
                ->get();

            $hasStockPermission = $permissions
                ->contains('slug', 'stock-management');
            //    $product = Cache::remember($cacheKey, 600, function () use ($user, $request) {
            $product = Cache::tags(['products_user_' . $user])
                ->remember($cacheKey, 600, function () use ($user, $request, $hasStockPermission) {

                    // $query = Products::with([
                    //  'variants',
                    //         'images',
                    //         'medicine_type'
                    // ])
                    // ->where('user_id', $user)
                    // ->where('is_active', true);
                    $relations = [
                        'brand:id,name',
                        'category:id,name',
                        'unit:id,name',
                        'variants',
                        'images',
                        'medicine_type',

                    ];
                    // has stock permission
                    if ($hasStockPermission) {

                        $relations['stocks'] = function ($query) {

                            // $query->select('id', 'product_id');

                        };
                    }
                    $query = Products::with($relations)
                        ->where('user_id', $user);
                    // ->where('is_active', true);
                    // Search filter
                    if ($request->has('search') && !empty($request->search)) {

                        $query->where(function ($q) use ($request) {

                            $q->where('name', 'like', '%' . $request->search . '%')
                                ->orWhere('sku', 'like', '%' . $request->search . '%')
                                ->orWhere('category_id', 'like', '%' . $request->search . '%')
                                ->orWhere('brand_id', 'like', '%' . $request->search . '%')
                                ->orWhere('unit_id', 'like', '%' . $request->search . '%')
                                // ->orWhere('is_active', 'like', '%' . $request->search . '%')
                                ->orWhere('unit_amount', 'like', '%' . $request->search . '%')

                                ->orWhereHas('category', function ($category) use ($request) {
                                    $category->where('name', 'like', "%{$request->search}%");
                                });
                            if ($request->search == 'active') {
                                $q->orWhere('is_active', 1);
                            }
                            if ($request->search == 'inactive') {
                                $q->orWhere('is_active', 0);
                            }
                            // if ($request->search == "low_stock") {
                            //     $q->orWhereHas('stocks', function ($stocks) {
                            //         $stocks->where('quantity', '<=', 5)
                            //             ->where('quantity', '>', 0);
                            //     });
                            // }
                            if ($request->search == 'low-stock') {
                                $q->orWhereHas('stocks', function ($stocks) {
                                    $stocks->whereBetween('quantity', [1, 10]);
                                });
                            }


                            if ($request->search == 'out-of-stock') {
                                $q->orWhereHas('stocks', function ($stocks) {
                                    $stocks->where('quantity', 0);
                            
                                });
                            }

                            if ($request->search == "in-stock") {
                                $q->orWhereHas('stocks', function ($stocks) {
                                    $stocks->where('quantity', '>', 0);
                                });
                            }
                        });
                    }

                    return $query
                        ->orderBy('id', 'desc')
                        ->paginate(8);
                });
            $executionTime = microtime(true) - $startTime;
            return response()->json([
                'status' => true,
                'message' => 'Product List',
                'source' => $fromCache ? 'Cache' : 'Database',
                'response_time' => round($executionTime, 4) . ' sec',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()

            ]);
        }
    }
    public function create($id)
    {
        $user = Auth::user()->id;
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required. Please login first.'
            ]);
        }
        if ($user != $id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not authenticated user!'
            ]);
        }
        try {
            $customer = Customers::findOrFail($id);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }

            $brand = Brand::where('user_id', $id)->where('is_active', true)->get();
            $category = Categories::where('user_id', $id)->where('is_active', true)->get();
            $unit = Unit::where('user_id', $id)->get();
            if ($customer->plan_id == null || $customer->plan_id == 0  || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            } elseif ($customer->is_active == 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Your plan is expired. Please upgrade your plan.'
                ]);
            }
            // $inputPermission = PlanBusinessType::where('business_type_id',$customer->business_type_id)->where('plan_id',$customer->plan_id)->first();
            $inputPermission = BusinessPermission::with('input_permission')->where('business_type_id', $customer->business_type_id)->get();

            return response()->json([
                'status' => true,
                'message' => 'Product Create',
                'brand' => $brand,
                'category' => $category,
                'unit' => $unit,
                'inputPermission' => $inputPermission
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }


    private function uploadToCloudinary($file, $folder = 'Thefastbill')
    {
        try {

            $upload = Cloudinary::uploadApi()->upload(
                $file->getRealPath(),
                [
                    'folder' => $folder
                ]
            );

            return [
                'url' => $upload['secure_url'],
                'public_id' => $upload['public_id']
            ];
        } catch (\Exception $e) {

            Log::error('Cloudinary upload failed: ' . $e->getMessage());

            return null;
        }
    }

    private function generateQrAndUpload($product)
    {
        try {

            $qrData = "ID:{$product->id}";

            $renderer = new ImageRenderer(
                new RendererStyle(200),
                new SvgImageBackEnd()
            );

            $writer = new Writer($renderer);

            $qrContent = $writer->writeString($qrData);

            $tempPath = storage_path('app/temp_qr_' . time() . '.svg');

            file_put_contents($tempPath, $qrContent);

            $upload = Cloudinary::uploadApi()->upload(
                $tempPath,
                [
                    'folder' => 'Thefastbill/qr'
                ]
            );

            if (file_exists($tempPath)) {
                unlink($tempPath);
            }

            return [
                'url' => $upload['secure_url'],
                'public_id' => $upload['public_id']
            ];
        } catch (\Exception $e) {

            Log::error('QR Error: ' . $e->getMessage());

            return [
                'url' => null,
                'public_id' => null
            ];
        }
    }
    public function show($id)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Authentication required'
            ], 401);
        }
        $user = Auth::user()->id;
        try {
            $product = Products::where('user_id', $user)->where('id', $id)->with(['images', 'category', 'brand', 'unit', 'user', 'stocks', 'variants'])->firstOrFail();
            if (!$product) {
                return response()->json([
                    'status' => false,
                    'message' => 'Product not found'
                ]);
            }
            return response()->json([
                'status' => true,
                'message' => 'Product Details',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    private function generateBarcodeAndUpload($product)
    {
        try {

            $barcodeBase64 = DNS1D::getBarcodePNG(
                (string)$product->id,
                'C128'
            );

            $imageData = base64_decode($barcodeBase64);

            $tempPath = storage_path(
                'app/temp_barcode_' . time() . '.png'
            );

            file_put_contents($tempPath, $imageData);

            $upload = Cloudinary::uploadApi()->upload(
                $tempPath,
                [
                    'folder' => 'Thefastbill/barcodes'
                ]
            );

            if (file_exists($tempPath)) {
                unlink($tempPath);
            }

            return [
                'url' => $upload['secure_url'],
                'public_id' => $upload['public_id']
            ];
        } catch (\Exception $e) {

            Log::error('Barcode Error: ' . $e->getMessage());

            return [
                'url' => null,
                'public_id' => null
            ];
        }
    }
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = Auth::user()->id;
            $variants = $request->input('variants');
            // Log::info('cloudi nary url'. )
            // if not array → remove it completely
            if (!is_array($variants)) {
                $request->request->remove('variants');
                $variants = [];
            }
            $data = $request->validate([
                // 'sku'                   => 'required|unique:products',
                'user_id'               => 'nullable',
                'sku'                   => 'required|unique:products,sku,NULL,id,user_id,' . $user,
                'name'                  => 'required',
                'brand_id'              => 'nullable|exists:brand,id',
                'category_id'           => 'required',
                'unit_amount'           => 'required',
                'unit_id'               => 'required|exists:unit,id',
                'selling_price'         => 'nullable',
                'purchase_price'        => 'nullable',
                'gst_percentage'        => 'nullable',
                'purchase_gst_percentage' => 'nullable',
                'discount_percentage'   => 'nullable',
                'description'           => 'nullable',
                'is_active'             => 'required',
                'image'                 => 'nullable',
                'qr_code'               => 'nullable',
                //new columns
                'conversion_factor'    => 'nullable',
                'minimum_stock_quantity' => 'min:0|nullable',
                'maximum_stock_quantity' => 'nullable',
                'current_stock' => 'min:0|nullable',
                'mrp' => 'nullable',
                'wholesale_price' => 'nullable',
                'gst_hsn_code'  => 'nullable',
                'discount_amount' => 'nullable',
                'cess_percentage' => 'nullable',
                'attributes' => 'nullable|array',
                'medicine_type_id' => 'nullable',
                // 'other_medicine_type' => 'nullable',
                'expiry_date' => 'nullable',
                'batch_number' => 'nullable',
                'manufacturer_name' => 'nullable',
                'prescription_required' => 'nullable',
                'schedule_type' => 'nullable',
                'salt_composition' => 'nullable',
                'perishable' => 'nullable',
                'organic_certified' => 'nullable',
                'harvest_date' => 'nullable',
                'storage_instructions' => 'nullable',
                'short_description' => 'nullable',
                'is_featured' => 'nullable',
                'is_returnable' => 'nullable',
                'is_refundable' => 'nullable',
                'warranty_months' => 'nullable',
                'warehouse_location' => 'nullable',
                'supplier_id' => 'nullable',
                'updated_by' => 'nullable',
                'images.*'              => 'nullable|image',
                // Variants
                'variants'              => 'sometimes|array',
                'variants.*.size'       => 'nullable',
                'variants.*.color'      => 'nullable',
                'variants.*.material'   => 'nullable',
                'variants.*.gender'     => 'nullable',

            ]);
            // return response()->json([
            //     'status' => false,
            //     'message' => 'send data ',
            //     'data' => $data
            // ]);
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            if ($user != $request->user_id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.',
                    'logged_user_id' => $user,
                    'sent_user_id' => $request->user_id
                ]);
            }
            //  Upload main Image → image folder
            if ($request->hasFile('image')) {
                // $data['image'] = $this->uploadToDrive(
                //     $request->file('image'),
                //     env('GOOGLE_IMAGE_FOLDER_ID')
                // );
                $upload = $this->uploadToCloudinary(
                    $request->file('image'),
                    'Thefastbill/products'
                );
                if (!$upload) {
                    throw new \Exception('Failed to upload main image');
                }

                $data['image'] = $upload['url'];
                $data['image_public_id'] = $upload['public_id'];
            }

            //  Upload QR → qr_codes folder
            // if ($request->hasFile('qr_code')) {
            //     $data['qr_code'] = $this->uploadToDrive(
            //         $request->file('qr_code'),
            //         env('GOOGLE_QR_FOLDER_ID')
            //     );
            // }
            $data['slug'] = Str::slug($data['name']); // generate unique slug
            $data['user_id'] = $user;
            $data['created_by'] = $user;
            $product = Products::create($data);
            if ($product) {
                $stocks = [
                    'product_id'        => $product->id,
                    'quantity'          => 0,
                    'selling_price'     => $product->selling_price ?? 0,
                    'product_package_id' => null,
                    'purchase_price'    => $product->purchase_price ?? 0,
                    'purchase_gst_percentage' => $product->purchase_gst_percentage ?? 0,
                    'selling_gst_percentage' => $product->gst_percentage ?? 0,
                    'unit_id'           => $product->unit_id,

                ];

                // check permission 
                $customer =  Customers::findOrFail(Auth::user()->id);
                $permissions = DB::table('plan_permission_details as ppd')
                    ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                    ->where('ppd.plan_id', $customer->plan_id)
                    ->pluck('pp.slug')
                    ->toArray();

                $hasStockPermission = in_array('stock-management', $permissions);

                // Log::info('hasStockPermission' . $hasStockPermission);
                if ($hasStockPermission) {
                    $stocks['user_id'] = $user;
                    $stocks['created_by'] = $user;
                    $stock = Stocks::create($stocks);
                    if ($stock) {
                        $stockHistory = StockHistory::create([
                            'user_id' => $user,
                            'product_id' => $product->id,
                            'stock_id' => $stock->id,
                            'price' => $product->purchase_price,
                            'gst' => $product->purchase_gst_percentage,
                            'quantity' => 0,
                            'created_by' => $user
                        ]);
                    }
                    $stocks = Stocks::where('user_id', $user)->get();
                    // Log::info('stocks created' . $stocks);
                }
            }

            $qr = $this->generateQrAndUpload($product);
            $barcode = $this->generateBarcodeAndUpload($product);
            // Log::info($qr);
            // Log::info($barcode);
            $product->update([
                'qr_code'         => $qr['url'] ?? null,
                'qr_public_id'    => $qr['public_id'] ?? null,
                'barcode'         => $barcode['url'] ?? null,
                'barcode_public_id' => $barcode['public_id'] ?? null,
            ]);
            // multi images upload
            // multi images upload
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $img) {
                    $upload = $this->uploadToCloudinary(
                        $img,
                        'Thefastbill/product-images'
                    );

                    if (!$upload) {
                        throw new \Exception('Failed to upload additional image');
                    }

                    ProductImages::create([
                        'user_id' => $user,
                        'product_id' => $product->id,
                        'image' => $upload['url'],
                        'image_public_id' => $upload['public_id'],
                        'created_by' => $user,
                    ]);
                }
            }

            //  CLEAN INVALID VARIANTS INPUT
            if ($request->has('variants')) {

                $variants = $request->input('variants');

                // if variants is not array → remove it completely
                if (!is_array($variants)) {
                    $request->request->remove('variants');
                }
            }
            if (!empty($variants) && is_array($variants)) {

                foreach ($variants as $variant) {

                    if (!is_array($variant)) {
                        continue;
                    }

                    if (
                        empty($variant['size']) &&
                        empty($variant['color']) &&
                        empty($variant['material']) &&
                        empty($variant['gender'])
                    ) {
                        continue;
                    }

                    ProductVariant::create([
                        'user_id'    => $user,
                        'product_id' => $product->id,
                        'size'       => $variant['size'] ?? null,
                        'color'      => $variant['color'] ?? null,
                        'material'   => $variant['material'] ?? null,
                        'gender'     => $variant['gender'] ?? null,
                        'created_by' => $user,
                    ]);
                }
            }

            DB::commit();
            Cache::tags(['products_user_' . $user, 'stock_user_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Product Created Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);
        }
    }
    private function deleteFromCloudinary($publicId)
    {
        if ($publicId) {
            // Cloudinary::destroy($publicId);
            Cloudinary::uploadApi()->destroy($publicId);
        }
    }


    public function update($id, Request $request)
    {   // update product
        DB::beginTransaction();
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }

            $product = Products::where('user_id', $user)->where('id', $id)->first();
            //             Log::info('images', [
            //     'images' => $request->images,
            //     'files' => $request->file('images')
            // ]);
            $data = $request->validate([
                'name'                  => 'required',
                'brand_id'              => 'nullable',
                'category_id'           => 'required',
                'unit_amount'           => 'required',
                'unit_id'               => 'required',
                'selling_price'         => 'nullable',
                'purchase_price'        => 'nullable',
                'gst_percentage'        => 'nullable',
                'purchase_gst_percentage' => 'nullable',
                'discount_percentage'   => 'nullable',
                'description'           => 'nullable',
                'is_active'             => 'required',
                //new columns
                'conversion_factor'    => 'nullable',
                'minimum_stock_quantity' => 'nullable',
                'maximum_stock_quantity' => 'nullable',
                'current_stock' => 'nullable',
                'mrp' => 'nullable',
                'wholesale_price' => 'nullable',
                'gst_hsn_code'  => 'nullable',
                'discount_amount' => 'nullable',
                'cess_percentage' => 'nullable',
                'attributes' => 'nullable',
                'medicine_type_id' => 'nullable',
                // 'other_medicine_type' => 'nullable',
                'expiry_date' => 'nullable',
                'batch_number' => 'nullable',
                'manufacturer_name' => 'nullable',
                'prescription_required' => 'nullable',
                'schedule_type' => 'nullable',
                'salt_composition' => 'nullable',
                'perishable' => 'nullable',
                'organic_certified' => 'nullable',
                'harvest_date' => 'nullable',
                'storage_instructions' => 'nullable',
                'short_description' => 'nullable',
                'is_featured' => 'nullable',
                'is_returnable' => 'nullable',
                'is_refundable' => 'nullable',
                'warranty_months' => 'nullable',
                'warehouse_location' => 'nullable',
                'supplier_id' => 'nullable',
                'updated_by' => 'nullable',
                'images.*'              => 'nullable',
                // Variants
                'variants'              => 'nullable|array',
                'variants.*.size'       => 'nullable|string',
                'variants.*.color'      => 'nullable|string',
                'variants.*.material'   => 'nullable|string',
                'variants.*.gender'     => 'nullable|string',

                'old_images' => 'nullable|array',
                'old_images.*' => 'nullable|string',

            ]);

            if ($product) {
                if ($request->hasFile('image')) {

                    // delete old image
                    if ($product->image) {
                        // $fileId = $this->getFileIdFromUrl($product->image);
                        // if ($fileId) {
                        //     $this->deleteFromDrive($fileId);
                        // }
                        $this->deleteFromCloudinary(
                            $product->image_public_id
                        );
                    }

                    // upload new image
                    // $data['image'] = $this->uploadToDrive(
                    //     $request->file('image'),
                    //     env('GOOGLE_IMAGE_FOLDER_ID')
                    // );
                    $upload = $this->uploadToCloudinary(
                        $request->file('image'),
                        'Thefastbill/products'
                    );

                    $data['image'] = $upload['url'];
                    $data['image_public_id'] = $upload['public_id'];
                } elseif ($request->has('image') && empty($request->image)) {

                    // delete old image
                    if ($product->image_public_id) {

                        $this->deleteFromCloudinary(
                            $product->image_public_id
                        );
                    }

                    // clear DB
                    $data['image'] = null;
                    $data['image_public_id'] = null;
                }

                //QR code
                if ($request->hasFile('qr_code')) {

                    $this->deleteFromCloudinary(
                        $product->qr_public_id
                    );

                    $upload = $this->uploadToCloudinary(
                        $request->file('qr_code'),
                        'Thefastbill/qr'
                    );

                    $data['qr_code'] = $upload['url'];
                    $data['qr_public_id'] = $upload['public_id'];
                }
            }
            $product->update($data);
            if ($product) {
                $stocks = [
                    'product_id'        => $product->id,
                    'quantity'          => 0,
                    'selling_price'     => $product->selling_price ?? 0,
                    'product_package_id' => null,
                    'purchase_price'    => $product->purchase_price ?? 0,
                    'unit_id'           => $product->unit_id,

                ];
                $stocksProduct = Stocks::where('product_id', $product->id)->first();

                // check permission 
                $customer =  Customers::findOrFail(Auth::user()->id);
                $permissions = DB::table('plan_permission_details as ppd')
                    ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                    ->where('ppd.plan_id', $customer->plan_id)
                    ->pluck('pp.slug')
                    ->toArray();

                $hasStockPermission = in_array('stock-management', $permissions);

                // Log::info('hasStockPermission' . $hasStockPermission);
                if ($hasStockPermission) {
                    $stocks['user_id'] = $user;
                    $stocks['created_by'] = $user;
                    if ($stocksProduct) {
                        $stocksProduct->update([
                            'selling_price'     => $product->selling_price ?? 0,
                            'purchase_price'    => $product->purchase_price ?? 0,
                            'unit_id'           => $product->unit_id,
                        ]);
                    } else {
                        $stock = Stocks::create($stocks);
                        // $stocks = Stocks::where('user_id', $user)->get();
                    }

                    // Log::info('stocks created'. $stocks);
                }
            }
            if ($request->hasFile('images') || $request->has('old_images')) {
                $keepImages = $request->old_images ?? [];
                if (!is_array($keepImages)) {
                    $keepImages = [];
                }
                // Get old DB images
                $oldDbImages = ProductImages::where('product_id', $product->id)->get();
                foreach ($oldDbImages as $img) {

                    if (!in_array($img->image, $keepImages)) {

                        if ($img->image_public_id) {

                            $this->deleteFromCloudinary(
                                $img->image_public_id
                            );
                        }

                        $img->delete();
                    }
                }
                // Log::info("images",$request->images);
                //update new images
                if ($request->hasFile('images')) {

                    //  Insert new images
                    foreach ($request->file('images') as $image) {

                        $upload = $this->uploadToCloudinary(
                            $image,
                            'Thefastbill/product-images'
                        );

                        ProductImages::create([
                            'user_id' => $user,
                            'product_id' => $product->id,
                            'image' => $upload['url'],
                            'image_public_id' => $upload['public_id'],
                            'created_by' => $user,
                        ]);
                    }
                }
            } elseif ($request->images == null && !$request->hasFile('images')) {
                $oldDbImag = ProductImages::where('product_id', $product->id)->get();
                foreach ($oldDbImag as $img) {
                    $img->delete();

                    if ($img->image_public_id) {

                        $this->deleteFromCloudinary(
                            $img->image_public_id
                        );
                    }
                }
            }
            //update variants
            if ($request->has('variants')) {

                // Delete old variants
                ProductVariant::where('product_id', $product->id)->delete();

                // Insert new variants
                foreach ($request->variants as $variant) {

                    if (
                        empty($variant['size']) &&
                        empty($variant['color']) &&
                        empty($variant['material']) &&
                        empty($variant['gender'])
                    ) {
                        continue;
                    }

                    ProductVariant::create([
                        'user_id'    => $user,
                        'product_id' => $product->id,
                        'size'       => $variant['size'] ?? null,
                        'color'      => $variant['color'] ?? null,
                        'material'   => $variant['material'] ?? null,
                        'gender'     => $variant['gender'] ?? null,
                        'created_by' => $user,
                    ]);
                }
            }
            DB::commit();
            Cache::tags(['products_user_' . $user, 'stock_user_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Product Updated Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function destroy($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication .required Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $product = Products::where('user_id', $user)->where('id', $id)->first();
            $product->delete();
            $stocksProduct = Stocks::where('user_id', $user)->where('product_id', $product->id)->first();
            if ($stocksProduct) {
                $stocksProduct->delete();
            }
            Cache::tags(['products_user_' . $user, 'stock_user_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Product Deleted Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function bulkDelete(Request $request)
    {     //bulk soft delete products
        $ids = $request->validate([
            'ids' => 'required'
        ]);
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication .required Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            foreach ($ids['ids'] as $id) {
                $product = Products::where('user_id', $user)->where('id', $id)->first();
                $product->delete();
                $stocksProduct = Stocks::where('user_id', $user)->where('product_id', $product->id)->first();
                if ($stocksProduct) {
                    $stocksProduct->delete();
                }
            }
            Cache::tags(['products_user_' . $user, 'stock_user_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Product Deleted Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function restore($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            // check active plan
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $product = Products::withTrashed()->where('user_id', $user)->where('id', $id)->firstOrFail();
            $product->restore();
            // check permission 
            if ($product) {
                $stocks = [
                    'product_id'        => $product->id,
                    'quantity'          => 0,
                    'selling_price'     => $product->selling_price ?? 0,
                    'product_package_id' => null,
                    'purchase_price'    => $product->purchase_price ?? 0,
                    'unit_id'           => $product->unit_id,

                ];
            }
            $permissions = DB::table('plan_permission_details as ppd')
                ->join('plan_permission as pp', 'pp.id', '=', 'ppd.permission_id')
                ->where('ppd.plan_id', $customer->plan_id)
                ->pluck('pp.slug')
                ->toArray();

            $hasStockPermission = in_array('stock-management', $permissions);

            // Log::info('hasStockPermission' . $hasStockPermission);
            if ($hasStockPermission) {
                $stocks['user_id'] = $user;
                $stocks['created_by'] = $user;
                $stock = Stocks::create($stocks);
            }
            Cache::tags(['products_user_' . $user, 'stock_user_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Product Restored Successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function forceDelete($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            // check active plan
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            $product = Products::withTrashed()->where('user_id', $user)->where('id', $id)->first();
            if ($product) {
                if ($product->image) {
                    // $fileId = $this->getFileIdFromUrl($product->image);
                    // if ($fileId) {
                    //     $this->deleteFromDrive($fileId);
                    // }
                    $this->deleteFromCloudinary(
                        $product->image_public_id
                    );
                }
                if ($product->qr_code) {
                    // $fileId = $this->getFileIdFromUrl($product->qr_code);

                    // $this->deleteFromDrive($fileId);
                    $this->deleteFromCloudinary(
                        $product->image_public_id
                    );

                    $this->deleteFromCloudinary(
                        $product->qr_public_id
                    );

                    $this->deleteFromCloudinary(
                        $product->barcode_public_id
                    );
                }
            }
            $product->forceDelete();
            Cache::tags(['products_user_' . $user, 'stock_user_' . $user])->flush();
            return response()->json([
                'status' => true,
                'message' => 'Product Deleted Permanently',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function bulkForceDelete(Request $request)  //bulk permanently delete products
    {
        $ids = $request->validate([
            'ids' => 'required'
        ]);
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            // check active plan
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }
            foreach ($ids['ids'] as $id) {
                $product = Products::withTrashed()->where('user_id', $user)->where('id', $id)->first();
                if ($product) {
                    if ($product->image) {
                        // $fileId = $this->getFileIdFromUrl($product->image);
                        // if ($fileId) {
                        //     $this->deleteFromDrive($fileId);
                        // }
                        $this->deleteFromCloudinary(
                            $product->image_public_id
                        );
                    }
                    if ($product->qr_code) {
                        // $fileId = $this->getFileIdFromUrl($product->qr_code);

                        // $this->deleteFromDrive($fileId);
                        $this->deleteFromCloudinary(
                            $product->image_public_id
                        );

                        $this->deleteFromCloudinary(
                            $product->qr_public_id
                        );

                        $this->deleteFromCloudinary(
                            $product->barcode_public_id
                        );
                    }
                }
                $product->forceDelete();
            }
            return response()->json([
                'status' => true,
                'message' => 'Product Deleted Permanently',
                'data' => []
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    /* public user show products */
    public function userProducts(Request $request, $id)
    {
        try {
            // $id = base64_decode($id);
            $id = Crypt::decryptString($id);
            $startTime = microtime(true);
            // $cacheKey = 'products_user_' . $id;
            $cacheKey = "products_user_{$id}_" . md5(
                json_encode([
                    'search' => $request->search,
                    'page' => $request->page
                ])
            );
            $fromCache = Cache::tags(['products_user_' . $id])->has($cacheKey);
            $data = Cache::tags(['products_user_' . $id])->remember($cacheKey, 600, function () use ($id, $request) {
                // $products = Products::with('brand','category','unit')->where('user_id', $id)->where('is_active',true)->paginate(15);
                $categoies = Categories::where('user_id', $id)->where('is_active', true)->get();
                $brands = Brand::where('user_id', $id)->where('is_active', true)->get();
                $store = Store::where('user_id', $id)->get();
                $products = Products::with('brand', 'category', 'unit')
                    ->where('user_id', $id)
                    ->where('is_active', true)
                    ->when($request->search, function ($query) use ($request) {

                        $search = $request->search;

                        $query->where(function ($q) use ($search) {

                            // Product name
                            $q->where('name', 'like', "%{$search}%")

                                // SKU
                                ->orWhere('sku', 'like', "%{$search}%")

                                // Price
                                ->orWhere('selling_price', 'like', "%{$search}%")
                                ->orWhere('description', 'like', "%{$search}%")
                                // Category name
                                ->orWhereHas('category', function ($q) use ($search) {
                                    $q->where('name', 'like', "%{$search}%");
                                })

                                // Brand name
                                ->orWhereHas('brand', function ($q) use ($search) {
                                    $q->where('name', 'like', "%{$search}%");
                                });
                        });
                    })
                    ->orderBy('id', 'desc')
                    ->paginate(8);
                return [
                    'status' => true,
                    'categories' => $categoies,
                    'brands' => $brands,
                    'stores' => $store,
                    'products' => $products
                ];
            });
            if ($data['products']->count() == 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Product not found!'
                ]);
            }
            $executionTime = microtime(true) - $startTime;
            $data['response_time'] = round($executionTime, 4) . ' sec';
            $data['source'] = $fromCache ? 'Cache' : 'Database';
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function categoryProducts(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'user_id' => 'required'
            ]);
            $startTime = microtime(true);
            $page = $request->page ?? 1;
            $cacheKey = 'category_products' . $id . '_page_' . $page;
            $fromCache = Cache::tags(['category_products_user_' . $id])->get($cacheKey);
            $user_id = Crypt::decryptString($data['user_id']);

            $data = Cache::tags(['category_products_user_' . $id])->remember($cacheKey, 600, function () use ($id, $user_id) {
                $products = Products::with('brand', 'category', 'unit')->where('category_id', $id)->where('user_id', $user_id)->paginate(8);
                $categories = Categories::where('user_id', $user_id)
                    ->where('is_active', 1)
                    ->get();
                return [
                    'status' => true,
                    'user_id' => $user_id,
                    'products' => $products,
                    'categories' => $categories
                ];
            });
            if ($data['products']->count() == 0) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Product not found!'
                ]);
            }
            $data['source'] = $fromCache ? 'Cache' : 'Database';
            $executionTime = microtime(true) - $startTime;
            $data['response_time'] = round($executionTime, 4) . ' sec';
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function deletedProducts($id)
    {
        try {
            $user = $user = Auth::user()->id;
            if ($user != $id) {
                return response()->json([
                    'status' => false,
                    'message' => 'You are not authorized to perform this action'
                ]);
            }
            $products = Products::onlyTrashed()->where('user_id', $id)->get();
            if (!$products) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Product not found!'
                ]);
            }
            return response()->json([
                'status' => true,
                'products' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
    public function decript($encryptedId)
    {
        try {
            $decryptedId = Crypt::decryptString($encryptedId);
            return response()->json([
                'status' => true,
                'decrypted_id' => $decryptedId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
