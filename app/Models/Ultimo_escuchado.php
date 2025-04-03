<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ultimo_escuchado extends Model
{
    use HasFactory;
    
    protected $table = 'ultimo_escuchado';
    
    protected $fillable = [
        'id_usuario',
        'id_album',
        'id_lista',
        'ultima_reproduccion'
    ];
    

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }
    
    public function album()
    {
        return $this->belongsTo(Album::class, 'id_album');
    }
    
    public function lista()
    {
        return $this->belongsTo(Lista::class, 'id_lista');
    }
}
