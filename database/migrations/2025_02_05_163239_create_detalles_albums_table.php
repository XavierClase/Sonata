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
        Schema::create('detalles_albums', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_album');
            $table->foreign('id_album')->references('id')->on('albums')->cascadeOnDelete();

            $table->unsignedBigInteger('id_cancion');
            $table->foreign('id_cancion')->references('id')->on('canciones')->cascadeOnDelete();

            $table->integer('orden');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_albums');
    }
};
