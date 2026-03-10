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
            $table->decimal('purchase_price', 12, 2)->default(0)->after('unit_id');
            $table->decimal('selling_price', 12, 2)->default(0)->after('purchase_price');
            $table->decimal('gst_percentage', 5, 2)->default(0)->after('selling_price');
            $table->decimal('discount_percentage', 5, 2)->default(0)->after('gst_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('purchase_price');
            $table->dropColumn('selling_price');
            $table->dropColumn('gst_percentage');
            $table->dropColumn('discount_percentage');
        });
    }
};
