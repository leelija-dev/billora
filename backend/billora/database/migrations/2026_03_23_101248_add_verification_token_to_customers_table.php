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
           $table->dropColumn('email_varified_at'); // remove wrong one
           $table->timestamp('email_verified_at')->nullable()->after('remember_token'); // add correct
           $table->string('verification_token')->nullable()->after('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['email_verified_at', 'verification_token']); // remove both

        // optional: restore old column (if needed)
        $table->string('email_varified_at')->nullable();
        });
    }
};
