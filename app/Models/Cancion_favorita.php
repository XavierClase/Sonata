<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cancion_favorita extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_cancion',
        'id_usuario',
        'orden',
    ];
    

    protected $table = 'canciones_favoritas'; 



    public function users()
    {
        return $this->belongsToMany(User::class, 'canciones_favoritas', 'id_cancion', 'id_usuario');
    }

    public function canciones()
    {
        return $this->belongsToMany(Cancion::class, 'canciones_favoritas', 'id_usuario', 'id_cancion');
    }
}
