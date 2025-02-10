<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cancion extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'nombre',
       'reproducciones',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function detalle_lista()
    {
        return $this->belongsToMany(detalle_lista::class, 'id_cancion');
    }
    
    public function detalle_album()
    {
        return $this->belongsToMany(detalle_album::class, 'id_cancion');
    }

    public function favorito()
    {
        return $this->belongsToMany(User::class);
    }


}
