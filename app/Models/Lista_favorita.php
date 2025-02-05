<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lista_favorita extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    
    public function lista()
    {
        return $this->hasMany(Lista::class, 'id_lista');
    }
}
