<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Customers;
use App\Models\WayBill;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Milon\Barcode\Facades\DNS1DFacade as DNS1D;

class WaybillController extends Controller
{
    /**
     * Next sequential number for ONE user: 00001, 00002 ...
     * Locks THIS user's row in customers, then reads the user's latest waybill
     * (one index lookup). Must be called inside DB::transaction.
     */
    public function index(Request $request)
{
    if (!Auth::check()) {
        return response()->json([
            'status'  => false,
            'message' => 'Authentication required. Please login first.',
        ], 401);
    }
 
    $user = Auth::id();
 
    try {
        $f = $request->validate([
            'invoice_id' => 'nullable|integer',
            'status'     => 'nullable|in:draft,issued,in_transit,delivered,cancelled',
            'search'     => 'nullable|string|max:100',
        ]);
 
        // same tag name you flush in store():  Cache::tags(['waybill_user_' . $user])->flush();
        $tag = ['waybill_user_' . $user];
 
        // one cache key per filter combination (same filters -> same key)
        ksort($f);
        $key = 'waybills_' . $user . '_' . md5(json_encode($f));
 
        $started   = microtime(true);
        $fromCache = Cache::tags($tag)->has($key);
 
        $waybills = Cache::tags($tag)->remember($key, 600, function () use ($user, $f) {
            return WayBill::where('user_id', $user)                        // only MY waybills
                ->when($f['invoice_id'] ?? null, fn ($q, $i) => $q->where('invoice_id', $i))
                ->when($f['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
                ->when($f['search'] ?? null, function ($q, $s) {
                    $s = addcslashes($s, '%_\\');
                    $q->where(function ($w) use ($s) {
                        $w->where('waybill_number', 'like', "{$s}%")
                          ->orWhere('vehicle_number', 'like', "{$s}%")
                          ->orWhere('customer_name', 'like', "%{$s}%");
                    });
                })
                ->orderByDesc('id')                                        // newest first
                ->get();
        });
 
        return response()->json([
            'status'        => true,
            'message'       => 'Waybills retrieved successfully',
            'source'        => $fromCache ? 'Cache' : 'Database',
            'response_time' => round(microtime(true) - $started, 4) . ' sec',
            'data'          => $waybills,
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        throw $e;
    } catch (\Exception $e) {
        Log::error('Waybill index failed: ' . $e->getMessage());
 
        return response()->json([
            'status'  => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}
    private function nextWaybillNumber(int $userId): string
    {
        Customers::where('id', $userId)->lockForUpdate()->first();

        // withTrashed so a deleted number is never reused
        // (remove withTrashed() if your Waybill model has no SoftDeletes)
        $last = WayBill::where('user_id', $userId)
            ->orderByDesc('id')
            ->value('waybill_number');

        $next = $last ? ((int) $last) + 1 : 1;

        return str_pad((string) $next, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Generate a Code128 BARCODE in memory and upload it to Cloudinary.
     * The barcode contains ONLY $value, so the scanner shows exactly that text.
     * No temp file. Fixed public_id + overwrite => no duplicate files.
     */
    private function barcodeAndUpload(string $value, string $folder, string $publicId): array
    {
        try {
            // getBarcodePNG() already returns base64
            $base64 = DNS1D::getBarcodePNG($value, 'C128', 2, 60);

            $upload = Cloudinary::uploadApi()->upload(
                'data:image/png;base64,' . $base64,
                [
                    'folder'     => $folder,
                    'public_id'  => $publicId,
                    'overwrite'  => true,
                    'invalidate' => true,
                ]
            );

            return [
                'url'       => $upload['secure_url'],
                'public_id' => $upload['public_id'],
            ];
        } catch (\Exception $e) {
            Log::error('Waybill barcode error: ' . $e->getMessage());

            return ['url' => null, 'public_id' => null];
        }
    }

    private function deleteFromCloudinary(?string $publicId): void
    {
        if ($publicId) {
            try {
                Cloudinary::uploadApi()->destroy($publicId);
            } catch (\Exception $e) {
                Log::error('Cloudinary delete failed: ' . $e->getMessage());
            }
        }
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status'  => false,
                'message' => 'Authentication required. Please login first.',
            ], 401);
        }

        $user = Auth::id();

        try {
            // plan check
            $customer = Customers::findOrFail($user);
            if ($customer->plan_id == null || $customer->is_active == false) {
                return response()->json([
                    'status'  => false,
                    'message' => 'You do not have any active plan. Please upgrade your plan.',
                ]);
            }

            // validate + whitelist (only these keys can ever reach the database)
            $data = $request->validate([
                // invoice must belong to THIS user (change table name if yours differs)
                'invoice_id'          => "nullable|integer|exists:invoice,id,user_id,{$user}",
                'waybill_date'        => 'nullable|date',

                'store_name'          => 'required|string|max:150',
                'store_address'       => 'nullable|string',
                'store_gstin'         => 'nullable|string|size:15',
                'store_phone'         => 'nullable|string|max:20',

                'customer_name'       => 'required|string|max:150',
                'customer_address'    => 'nullable|string',
                'customer_pincode'    => 'nullable|string|max:10',
                'customer_gstin'      => 'nullable|string|size:15',
                'customer_phone'      => 'nullable|string|max:20',

                'origin_city'         => 'nullable|string|max:80',
                'origin_pincode'      => 'nullable|string|max:10',
                'destination_city'    => 'nullable|string|max:80',
                'destination_pincode' => 'nullable|string|max:10',

                'vehicle_number'      => 'nullable|string|max:20',
                'transport_mode'      => 'nullable|in:road,rail,air,ship',

                'total_packages'      => 'nullable|integer|min:0',
                'total_weight'        => 'nullable|numeric|min:0',
                'total_value'         => 'nullable|numeric|min:0',
                'freight_amount'      => 'nullable|numeric|min:0',
                'other_charges'       => 'nullable|numeric|min:0',

                'status'              => 'nullable|in:draft,issued,in_transit,delivered,cancelled',
            ]);

            // 1) DB work only, inside a short transaction (no network calls while the lock is held)
            $waybill = DB::transaction(function () use ($data, $user) {
                $data['user_id']        = $user;
                $data['waybill_number'] = $this->nextWaybillNumber($user);
                $data['waybill_date']   = $data['waybill_date'] ?? now()->toDateString();
                $data['transport_mode'] = $data['transport_mode'] ?? 'road';
                $data['status']         = $data['status'] ?? 'issued';

                $waybill = new WayBill();
                $waybill->forceFill($data)->save();   // works even if $fillable is not set

                return $waybill;
            });

            // 2) BARCODES after commit. If Cloudinary is down, the waybill is still saved
            //    (barcode columns stay null and can be regenerated later).
            $number = $waybill->waybill_number;
            $update = [];

            // Barcode 1 -> scanner shows ONLY the waybill number, e.g. 00001
            $wb = $this->barcodeAndUpload(
                $number,
                'Thefastbill/waybill_barcode',
                "waybill_{$user}_{$number}"
            );
            $update['waybill_qr']           = $wb['url'];
            $update['waybill_public_id'] = $wb['public_id'];

            // Barcode 2 -> scanner shows ONLY the invoice number, e.g. INV-2026-0042
            if (!empty($waybill->invoice_id)) {
                // CHANGE table / column names to match your invoice table
                $invoiceNumber = DB::table('invoice')
                    ->where('id', $waybill->invoice_id)
                    ->where('user_id', $user)
                    ->value('invoice_number');

                if ($invoiceNumber) {
                    $invoiceNumber = (string) $invoiceNumber;
                    $safeName      = preg_replace('/[^A-Za-z0-9_-]/', '_', $invoiceNumber);

                    $inv = $this->barcodeAndUpload(
                        $invoiceNumber,
                        'Thefastbill/waybill_invoice_barcode',
                        "invoice_{$user}_{$safeName}"
                    );
                    $update['invoice_qr']           = $inv['url'];
                    $update['invoice_public_id'] = $inv['public_id'];
                }
            }

            // 3) one UPDATE query for both barcodes
            $waybill->forceFill($update)->save();

            Cache::tags(['waybill_user_' . $user])->flush();

            return response()->json([
                'status'  => true,
                'message' => 'Waybill Created Successfully',
                'data'    => $waybill,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e; // keep normal 422 validation response
        } catch (\Exception $e) {
            Log::error('Waybill store failed: ' . $e->getMessage());

            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
    public function update(Request $request, $id)
{
    if (!Auth::check()) {
        return response()->json([
            'status'  => false,
            'message' => 'Authentication required. Please login first.',
        ], 401);
    }

    $user = Auth::id();

    try {
        // only MY waybill can be edited
        $waybill = WayBill::where('id', $id)->where('user_id', $user)->first();

        if (!$waybill) {
            return response()->json([
                'status'  => false,
                'message' => 'Waybill not found',
            ], 404);
        }

        // waybill_number, invoice_id and barcodes are NOT editable
        $data = $request->validate([
            'store_name'          => 'required|string|max:150',
            'store_address'       => 'nullable|string',
            'store_gstin'         => 'nullable|string|size:15',
            'store_phone'         => 'nullable|string|max:20',

            'customer_name'       => 'required|string|max:150',
            'customer_address'    => 'nullable|string',
            'customer_pincode'    => 'nullable|string|max:10',
            'customer_gstin'      => 'nullable|string|size:15',
            'customer_phone'      => 'nullable|string|max:20',

            'origin_city'         => 'nullable|string|max:80',
            'origin_pincode'      => 'nullable|string|max:10',
            'destination_city'    => 'nullable|string|max:80',
            'destination_pincode' => 'nullable|string|max:10',

            'vehicle_number'      => 'nullable|string|max:20',
            'transport_mode'      => 'nullable|in:road,rail,air,ship',

            'total_packages'      => 'nullable|integer|min:0',
            'total_weight'        => 'nullable|numeric|min:0',
            'total_value'         => 'nullable|numeric|min:0',
            'freight_amount'      => 'nullable|numeric|min:0',
            'other_charges'       => 'nullable|numeric|min:0',

            'status'              => 'nullable|in:draft,issued,in_transit,delivered,cancelled',
        ]);

        // empty numeric field -> 0, empty mode/status -> keep the old value
        foreach (['total_packages', 'total_weight', 'total_value', 'freight_amount', 'other_charges'] as $k) {
            if (array_key_exists($k, $data) && $data[$k] === null) {
                $data[$k] = 0;
            }
        }
        $data['transport_mode'] = $data['transport_mode'] ?? $waybill->transport_mode;
        $data['status']         = $data['status'] ?? $waybill->status;

        $waybill->forceFill($data)->save();

        Cache::tags(['waybill_user_' . $user])->flush();

        return response()->json([
            'status'  => true,
            'message' => 'Waybill Updated Successfully',
            'data'    => $waybill,
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        throw $e;
    } catch (\Exception $e) {
        Log::error('Waybill update failed: ' . $e->getMessage());

        return response()->json([
            'status'  => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}
}