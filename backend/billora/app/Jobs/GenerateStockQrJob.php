<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use App\Models\Stocks;
class GenerateStockQrJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    protected $stockId;
    public function __construct($stockId)
    {
        $this->stockId = $stockId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $stock = Stocks::find($this->stockId);
         if (!$stock) {
            return;
        }
        $controller = app(\App\Http\Controllers\admin\StocksController::class);

        $qr = $controller->stockQrAndUpload($stock->id);

        $barcode = $controller->stockBarcodeAndUpload($stock->id);
         $stock->update([
            'qr_code' => $qr['url'],
            'qr_code_public_id' => $qr['public_id'],
            'bar_code' => $barcode['url'],
            'bar_code_public_id' => $barcode['public_id'],
        ]);
        Cache::tags([
                    'stock_user_' . $stock->user_id,
                    'products_user_' . $stock->user_id,
                    'gst_collection_user_' . $stock->user_id,
                    'billing_user_' . $stock->user_id,
                    'seller_user_' . $stock->user_id
                ])->flush();
    }
}
