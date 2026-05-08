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
        Schema::table('blog_tags', function (Blueprint $table) {
            $table->dropColumn('tag_id');
        });
        Schema::table('blog_tags', function (Blueprint $table) {
            $table->string('tag_name')->nullable()->after('blog_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_tags', function (Blueprint $table) {
            $table->dropColumn('tag_name');
        });

        Schema::table('blog_tags', function (Blueprint $table) {
            $table->unsignedBigInteger('tag_id')->after('blog_id');
        });
    }
};
