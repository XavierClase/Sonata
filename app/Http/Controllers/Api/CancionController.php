<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CancionResource;
use Illuminate\Http\Request;
use App\Models\Cancion;
use App\Models\Album;

class CancionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'duracion' => 'required|string',
            'archivo' => 'required|file|mimes:mp3,wav',
            'album_id' => 'required|exists:albums,id',
            'orden' => 'required|integer'
        ]);

        $duracionPartes = explode(':', $request->duracion);
        $duracionFormateada = '00:' . str_pad($duracionPartes[0], 2, '0', STR_PAD_LEFT) . ':' . 
                            str_pad(isset($duracionPartes[1]) ? $duracionPartes[1] : '00', 2, '0', STR_PAD_LEFT);


        try {
            $cancion = new Cancion([
                'nombre' => $request->nombre,
                'duracion' => $duracionFormateada,
                'reproducciones' => 0,
                'id_usuario' => auth()->id()
            
            ]); 
            
            $cancion->save();

            if ($request->hasFile('archivo')) {
                $cancion->addMediaFromRequest('archivo')
                    ->toMediaCollection('audio/canciones');
            }

            $album = Album::findOrFail($request->album_id);
            $album->canciones()->attach($cancion->id, ['orden' => $request->orden]);

            return response()->json([
                'message' => 'Canción creada y asociada exitosamente',
                'cancion' => $cancion
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la canción',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function getPopulares($userId)
    {
        $canciones = Cancion::with('albums')->where('id_usuario', $userId)->orderBy('reproducciones', 'desc')->take(5)->get();

        return CancionResource::collection($canciones);
    }

    public function getCancionesUsuario(string $userId)
    {
        $canciones = Cancion::where('id_usuario', $userId)->get();
        return response()->json($canciones, 200);
    }

    public function getCancionesArtistaEstadisticas(string $userId)
    {
        $canciones = Cancion::where('id_usuario', $userId)
            ->orderBy('reproducciones', 'desc')
            ->get();
        return response()->json($canciones, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    public function sumarRepro($cancionId)
    {
        $cancion = Cancion::findOrFail($cancionId);

        $cancion->increment('reproducciones');

        return response()->json([
            'message' => 'Reproducción sumada correctamente',
            'reproducciones' => $cancion->reproducciones
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

public function destroy(string $id)
{
    try {
        $cancion = Cancion::findOrFail($id);
    
        if ($cancion->id_usuario !== auth()->id()) {
            return response()->json([
                'message' => 'No tienes permiso para eliminar esta canción'
            ], 403);
        }
    
    
        $cancion->clearMediaCollection('audio/canciones');
    
     
        $cancion->albums()->detach();
    
      
        $cancion->delete();
    
        return response()->json([
            'message' => 'Canción eliminada completamente del sistema'
        ], 200);
            
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al eliminar la canción',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
