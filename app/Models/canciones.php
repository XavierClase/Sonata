<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class canciones extends Model
{
    protected $fillable = [
        'nombre',
       'reproducciones',
    ];
    use HasFactory;
}
