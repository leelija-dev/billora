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
        Schema::table('stocks', function (Blueprint $table) {
            $table->decimal('purchase_gst_percentage', 5, 2)->default(0)->after('purchase_price');
            $table->decimal('selling_gst_percentage', 5, 2)->default(0)->after('selling_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stocks', function (Blueprint $table) {
            $table->dropColumn('purchase_gst_percentage');
            $table->dropColumn('selling_gst_percentage');
        });
    }
};
