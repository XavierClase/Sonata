<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CancionFavorita extends Model
{
    use HasFactory;

    protected $table = 'canciones_favoritas';

    protected $fillable = ['id_cancion', 'id_usuario', 'orden'];
    
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function cancion()
    {
        return $this->belongsTo(Cancion::class, 'id_cancion');
    }
}
