<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detalle_album extends Model
{
    use HasFactory;

    public function album()
    {
        return $this->hasMany(Album::class, 'id_album');
    }

    public function cancion()
    {
        return $this->hasMany(Cancion::class, 'id_cancion');
    }
    
}
