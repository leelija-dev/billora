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
use App\Models\Store;
use Illuminate\Support\Facades\Auth;
use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Support\Facades\Log;
use BaconQrCode\Renderer\Image\Png;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Writer;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Milon\Barcode\Facades\DNS1DFacade as DNS1D;

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
            $product = Products::with('variQA::
            ants', 'images')->where('user_id', $user)->where('is_active', true)->paginate(15);
            if ($request->has('search')) {
                $product = Products::where('user_id', $user)->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%')
                    ->orWhere('category_id', 'like', '%' . $request->search . '%')
                    ->orWhere('brand_id', 'like', '%' . $request->search . '%')
                    ->orWhere('unit_id', 'like', '%' . $request->search . '%')
                    ->orWhere('unit_amount', 'like', '%' . $request->search . '%')
                    ->paginate(10);
            }
            return response()->json([
                'status' => true,
                'message' => 'Product List',
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
            if($customer->plan_id == null || $customer->plan_id == 0  || $customer->is_active == false){
                return response()->json([
                    'status' => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.'
                ]);
            }elseif($customer->is_active == 0){
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
                'inputPermission'=>$inputPermission
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    private function uploadToDrive($file, $folderId)
    {
        $client = new Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->refreshToken(env('GOOGLE_REFRESH_TOKEN'));

        $service = new Drive($client);
        $name = method_exists($file, 'getClientOriginalName')
        ? $file->getClientOriginalName()
        : basename($file->getPathname());


        $fileMetadata = new DriveFile([
            // 'name' => time() . '_' . $file->getClientOriginalName(),
            'name' => time() . '_' . $name,
            'parents' => [$folderId]
        ]);

        $uploadedFile = $service->files->create($fileMetadata, [
            'data' => file_get_contents($file->getRealPath()),
            'mimeType' => $file->getMimeType(),
            'uploadType' => 'multipart',
            'fields' => 'id'
        ]);

        $fileId = $uploadedFile->id;

        // Make file public
        $permission = new Permission([
            'type' => 'anyone',
            'role' => 'reader'
        ]);

        $service->permissions->create($fileId, $permission);

        return "https://drive.google.com/uc?export=view&id=" . $fileId;
    }
    private function generateQrAndUpload($product)
    {
        try {
            $qrData = "ID:{$product->id}";
            // OR better:
            // $qrData = env('FRONTEND_URL') . "/product/" . $product->id;

            $renderer = new ImageRenderer(
                new RendererStyle(100),
                new SvgImageBackEnd()
            );

            $writer = new Writer($renderer);

            // Generate QR as string (NO FILE)
            $qrContent = $writer->writeString($qrData);

            return $this->uploadStringToDrive(
                $qrContent,
                'qr_' . $product->id . '_' . time() . '.svg',
                env('GOOGLE_QR_FOLDER_ID')
            );
        } catch (\Exception $e) {
            Log::error('QR Error: ' . $e->getMessage());
            return null;
        }
    }

    private function uploadStringToDrive($content, $fileName, $folderId)
    {
        $client = new Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->refreshToken(env('GOOGLE_REFRESH_TOKEN'));

        $service = new Drive($client);

        $fileMetadata = new DriveFile([
            'name' => $fileName,
            'parents' => [$folderId]
        ]);

        $uploadedFile = $service->files->create($fileMetadata, [
            'data' => $content,
            'mimeType' => 'image/svg+xml',
            'uploadType' => 'multipart',
            'fields' => 'id'
        ]);

        $fileId = $uploadedFile->id;

        // Make public
        $permission = new Permission([
            'type' => 'anyone',
            'role' => 'reader'
        ]);

        $service->permissions->create($fileId, $permission);

        return "https://drive.google.com/uc?export=view&id=" . $fileId;
    }
    private function generateBarcodeAndUpload($product)
    {
        // generate base64 barcode
        $barcodeBase64 = DNS1D::getBarcodePNG((string)$product->id, 'C128');

        // convert base64 → binary
        $imageData = base64_decode($barcodeBase64);

        // create temp file (memory-based)
        $tempFile = tmpfile();
        $tempPath = stream_get_meta_data($tempFile)['uri'];

        file_put_contents($tempPath, $imageData);

        // convert to Laravel File
        $file = new \Illuminate\Http\File($tempPath);

        // upload to Google Drive
        $barcodeUrl = $this->uploadToDrive(
            $file,
            env('GOOGLE_BAR_CODE_FOLDER_ID')
        );

        // close temp file (auto deletes)
        fclose($tempFile);

        return $barcodeUrl;
    }
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = Auth::user()->id;
          $variants = $request->input('variants');

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
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            //  Upload main Image → image folder
            if ($request->hasFile('image')) {
                $data['image'] = $this->uploadToDrive(
                    $request->file('image'),
                    env('GOOGLE_IMAGE_FOLDER_ID')
                );
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
            $qrUrl = $this->generateQrAndUpload($product);
            // BARCODE (no local file)
            $barcodeUrl = $this->generateBarcodeAndUpload($product);
            // $product->update(['barcode' => $barcodeUrl]);
            //  Save QR in DB
            $product->update([
                'qr_code' => $qrUrl,
                'barcode' => $barcodeUrl
            ]);
            // multi images upload
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $img) {

                    $imageUrl = $this->uploadToDrive(
                        $img,
                        env('GOOGLE_IMAGE_FOLDER_ID')
                    );

                    ProductImages::create([
                        'user_id'    => $user,
                        'product_id' => $product->id,
                        'image'      => $imageUrl,
                        'created_by' => $user,
                    ]);
                }
            }
            //             if ($request->has('variants') && is_string($request->variants)) {
            //     $request->merge([
            //         'variants' => json_decode($request->variants, true)
            //     ]);
            // }
            //product variants
            // $variants = $request->input('variants');
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
    public function show($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Authentication required. Please login first.'
                ]);
            }
            $user = Auth::user()->id;
            $product = Products::with('variants', 'images')->where('user_id', $user)->where('id', $id)->first();
            return response()->json([
                'status' => true,
                'message' => 'Single product',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
    private function getFileIdFromUrl($url)
    {
        parse_str(parse_url($url, PHP_URL_QUERY), $params);
        return $params['id'] ?? null;
    }
    private function deleteFromDrive($fileId)
    {
        $client = new \Google\Client();
        $client->setClientId(env('GOOGLE_CLIENT_ID'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->refreshToken(env('GOOGLE_REFRESH_TOKEN'));

        $service = new \Google\Service\Drive($client);

        try {
            $service->files->delete($fileId);
        } catch (\Exception $e) {
            // ignore if already deleted
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
            $data = $request->validate([
                'name'                  => 'required',
                'brand_id'              => 'nullable',
                'category_id'           => 'required',
                'unit_amount'           => 'required',
                'unit_id'               => 'required',
                'selling_price'         => 'nullable',
                'purchase_price'        => 'nullable',
                'gst_percentage'        => 'nullable',
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
                'images.*'              => 'nullable|image',
                // Variants
                'variants'              => 'nullable|array',
                'variants.*.size'       => 'nullable|string',
                'variants.*.color'      => 'nullable|string',
                'variants.*.material'   => 'nullable|string',
                'variants.*.gender'     => 'nullable|string',

            ]);
            if ($product) {
                if ($request->hasFile('image')) {

                    // delete old image
                    if ($product->image) {
                        $fileId = $this->getFileIdFromUrl($product->image);
                        if ($fileId) {
                            $this->deleteFromDrive($fileId);
                        }
                    }

                    // upload new image
                    $data['image'] = $this->uploadToDrive(
                        $request->file('image'),
                        env('GOOGLE_IMAGE_FOLDER_ID')
                    );
                }

                //QR code
                if ($request->hasFile('qr_code')) {

                    // delete old qr
                    if ($product->qr_code) {
                        $fileId = $this->getFileIdFromUrl($product->qr_code);
                        if ($fileId) {
                            $this->deleteFromDrive($fileId);
                        }
                    }

                    // upload new qr
                    $data['qr_code'] = $this->uploadToDrive(
                        $request->file('qr_code'),
                        env('GOOGLE_QR_FOLDER_ID')
                    );
                }
            }
            $product->update($data);
            //update multiple images
            if ($request->hasFile('images')) {

                //  Delete old images from DB + Drive
                $oldImages = ProductImages::where('product_id', $product->id)->get();

                foreach ($oldImages as $img) {
                    if ($img->image) {
                        $fileId = $this->getFileIdFromUrl($img->image);
                        if ($fileId) {
                            $this->deleteFromDrive($fileId);
                        }
                    }
                    $img->delete();
                }

                //  Insert new images
                foreach ($request->file('images') as $image) {

                    $imageUrl = $this->uploadToDrive(
                        $image,
                        env('GOOGLE_IMAGE_FOLDER_ID')
                    );

                    ProductImages::create([
                        'user_id'    => $user,
                        'product_id' => $product->id,
                        'image'      => $imageUrl,
                        'created_by' => $user,
                    ]);
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
            $product = Products::withTrashed()->where('user_id', $user)->where('id', $id)->get();
            $product->restore();
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
                    $fileId = $this->getFileIdFromUrl($product->image);
                    if ($fileId) {
                        $this->deleteFromDrive($fileId);
                    }
                }
                if ($product->qr_code) {
                    $fileId = $this->getFileIdFromUrl($product->qr_code);
                    if ($fileId) {
                        $this->deleteFromDrive($fileId);
                    }
                }
            }
            $product->forceDelete();
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

    /* public user show products */
    public function userProducts(Request $request, $id)
    {
        try {

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
                ->paginate(12);
            if (!$products) {
                return response()->json([
                    'status' => false,
                    'message' => 'Product not found!'
                ]);
            }
            return response()->json([
                'status' => true,
                'categories' => $categoies,
                'brands' => $brands,
                'stores' => $store,
                'products' => $products

            ]);
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

            $user_id = $request->user_id;

            $products = Products::with('brand', 'category', 'unit')->where('category_id', $id)->where('user_id', $user_id)->paginate(12);
            $categories = Categories::where('user_id', $user_id)
            ->where('is_active', 1)
            ->get();
            if (!$products) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Product not found!'
                ]);
            }
            return response()->json([
                'status' => true,
                'products' => $products,
                'categories' => $categories

            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
