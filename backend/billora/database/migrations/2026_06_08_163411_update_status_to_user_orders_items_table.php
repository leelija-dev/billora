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
        Schema::table('user_orders_items', function (Blueprint $table) {
           $table->enum('status', [
                'pending',
                'processing',
                'ready_to_serve',
                'completed',
                'cancelled'
            ])->default('pending')->change();
    
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_orders_items', function (Blueprint $table) {
            $table->enum('status', [
                'pending',
                'processing',
                'ready_to_serve',
                'completed'
            ])->default('pending')->change();
        });
    }
};
