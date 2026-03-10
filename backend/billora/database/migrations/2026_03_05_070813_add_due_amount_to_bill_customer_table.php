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
        Schema::table('bill_customer', function (Blueprint $table) {
            $table->decimal('due_amount', 12, 2)->default(0)->after('city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bill_customer', function (Blueprint $table) {
            $table->dropColumn('due_amount');
        });
    }
};
