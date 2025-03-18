<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CancionFavorita;
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

    $cancionFavorita = CancionFavorita::where('id_cancion', $request->id_cancion)
                                      ->where('id_usuario', $user->id)
                                      ->first();

    if ($cancionFavorita) {
        CancionFavorita::where('id_cancion', $request->id_cancion)
                      ->where('id_usuario', $user->id)
                      ->delete();
        return response()->json(['message' => 'Canción eliminada de favoritos'], 200);
    }

    // Si no existe, crear el registro
    CancionFavorita::create([
        'id_cancion' => $request->id_cancion,
        'id_usuario' => $user->id, 
        'orden' => $request->orden, 
    ]);

    return response()->json(['message' => 'Canción agregada a tus favoritos'], 200);
}


    public function obtenerCancionesFav()
    {
        $user = Auth::user();
        $favoritos = CancionFavorita::where('id_usuario', $user->id)->pluck('id_cancion');

        if ($favoritos->isEmpty()) {
            return response()->json([], 200);
        }

        return response()->json($favoritos, 200);
    }
    



}
