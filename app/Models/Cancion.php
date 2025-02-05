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
}
