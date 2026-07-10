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
            $table->string('qr_code')->nullable()->after('seller_product_id');
            $table->string('qr_code_public_id')->nullable()->after('qr_code');
            $table->string('bar_code')->nullable()->after('qr_code_public_id');
            $table->string('bar_code_public_id')->nullable()->after('bar_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stocks', function (Blueprint $table) {
            $table->dropColumn('qr_code');
            $table->dropColumn('qr_code_public_id');
            $table->dropColumn('bar_code');
            $table->dropColumn('bar_code_public_id');
        });
    }
};
