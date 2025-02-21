<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    try {
        $cancion = new Cancion([
            'nombre' => $request->nombre,
            'duracion' => $request->duracion,
            'reproducciones' => 0,
            'id_usuario' => auth()->id(),
            'fecha_subida' => now(),
            'archivo' => $request->archivo
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
