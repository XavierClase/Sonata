<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album_favorito extends Model
{
    use HasFactory;


    public function user()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    
    public function album()
    {
        return $this->belongsTo(Album::class, 'id_album');
    }
}
