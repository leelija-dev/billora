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
        Schema::table('bill_payment_history', function (Blueprint $table) {
            $table->string('invoice_id')->nullable()->change();
            $table->string('store_id')->nullable()->change();
            $table->text('remarks')->nullable()->after('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bill_payment_history', function (Blueprint $table) {
            $table->string('invoice_id')->nullable(false)->change();
            $table->string('store_id')->nullable(false)->change();
            $table->dropColumn('remarks');
        });
    }
};
