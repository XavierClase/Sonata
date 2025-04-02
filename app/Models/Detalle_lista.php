<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detalle_lista extends Model
{
    use HasFactory;
    protected $table = 'detalles_listas';
    protected $fillable = [
        'orden'
    ];
    public function lista()
    {
        return $this->hasMany(Lista::class, 'id_lista');
    }

    public function cancion()
    {
        return $this->hasMany(Cancion::class, 'id_cancion');
    }
}
