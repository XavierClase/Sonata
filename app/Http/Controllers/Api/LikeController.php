<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cancion;
use App\Models\Cancion_favorita;
use Auth;


class LikeController extends Controller
{
    public function likeCancion(Request $request)
    {
        $request->validate([
            'id_cancion' => 'required|exists:canciones,id',
            'orden' => 'required|integer', 
        ]);

        $user = Auth::user(); 

        $cancionFavorita = Cancion_favorita::where('id_cancion', $request->id_cancion)
                                          ->where('id_usuario', $user->id)
                                          ->first();

        if ($cancionFavorita) {
            // Si ya es favorita, puedes actualizar el "orden" o simplemente no hacer nada
            // $cancionFavorita->update(['orden' => $request->orden]);
            return response()->json(['message' => 'La canción ya está en tus favoritas'], 400);
        }

        Cancion_favorita::create([
            'id_cancion' => $request->id_cancion,
            'id_usuario' => $user->id, 
            'orden' => $request->orden, 
        ]);
        

        return response()->json(['message' => 'Canción agregada a tus favoritas'], 200);
    }
}
