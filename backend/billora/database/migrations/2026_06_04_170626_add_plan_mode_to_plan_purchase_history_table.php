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
        Schema::table('plan_purchase_history', function (Blueprint $table) {
            $table->string('plan_mode')->nullable()->after('plan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plan_purchase_history', function (Blueprint $table) {
            $table->dropColumn('plan_mode');
        });
    }
};
