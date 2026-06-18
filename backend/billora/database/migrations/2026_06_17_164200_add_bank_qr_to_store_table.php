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
        Schema::table('store', function (Blueprint $table) {
            $table->string('bank_qr')->nullable()->after('status');
            $table->string('bank_qr_public_id')->nullable()->after('bank_qr');
            $table->string('logo_public_id')->nullable()->after('logo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store', function (Blueprint $table) {
            $table->dropColumn('bank_qr');
            $table->dropColumn('bank_qr_public_id');
            $table->dropColumn('logo_public_id');
        });
    }
};
