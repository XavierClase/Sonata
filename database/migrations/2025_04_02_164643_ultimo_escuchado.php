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
        Schema::create('ultimo_escuchado', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_album')->nullable();
            $table->unsignedBigInteger('id_lista')->nullable();
            $table->timestamp('ultima_reproduccion')->useCurrent();
            $table->timestamps();
            
         
            $table->foreign('id_usuario')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('id_album')->references('id')->on('albums')->cascadeOnDelete();
            $table->foreign('id_lista')->references('id')->on('listas')->cascadeOnDelete();
            
            $table->unique(['id_usuario', 'id_album'], 'uq_usuario_album');
            $table->unique(['id_usuario', 'id_lista'], 'uq_usuario_lista');
           
        });
    }
    
    public function down(): void
    {
      
    }
};
