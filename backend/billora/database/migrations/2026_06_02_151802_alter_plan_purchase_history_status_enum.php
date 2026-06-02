<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plan_purchase_history', function (Blueprint $table) {
             DB::statement("
            ALTER TABLE plan_purchase_history
            MODIFY COLUMN status ENUM(
                'active',
                'pending',
                'expired',
                'cancelled'
            ) NOT NULL DEFAULT 'pending'
        ");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plan_purchase_history', function (Blueprint $table) {
            DB::statement("
            ALTER TABLE plan_purchase_history
            MODIFY COLUMN status ENUM(
                'active',
                'expired',
                'cancelled'
            ) NOT NULL DEFAULT 'cancelled'
        ");
        });
    }
};
