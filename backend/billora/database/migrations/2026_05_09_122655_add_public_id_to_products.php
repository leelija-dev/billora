<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('image_public_id')->nullable()->after('barcode');
            $table->text('qr_public_id')->nullable()->after('image_public_id');
            $table->text('barcode_public_id')->nullable()->after('qr_public_id');
            $table->decimal('purchase_gst_percentage', 5, 2)->default(0)->after('qr_public_id');
            $table->string('barcode', 255)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('image_public_id');
            $table->dropColumn('qr_public_id');
            $table->dropColumn('barcode_public_id');
            $table->dropColumn('purchase_gst_percentage');
            $table->string('barcode', 100)->nullable()->change();
        });
    }
};
