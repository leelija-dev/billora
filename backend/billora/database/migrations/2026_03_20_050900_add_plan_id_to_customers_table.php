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
        Schema::table('customers', function (Blueprint $table) {
            $table->unsignedBigInteger('plan_id')->nullable()->after('created_by');
            $table->boolean('is_active')->default(false)->after('plan_id');
            $table->boolean('is_trial')->default(false)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('plan_id');
            $table->dropColumn('is_active');
            $table->dropColumn('is_trial');
        });
    }
};
