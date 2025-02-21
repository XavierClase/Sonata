<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use Illuminate\Http\Request;
use App\Models\Album;




class AlbumController extends Controller
{
    /**
     * Recibir todos los albumes (y los datos del usuario artista propietario).
     */
    public function index()
    {
        $albumes = Album::with('user')->get();

        return response()->json($albumes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'num_canciones' => 'required|integer',
            'duracion_total' => 'required|string',
            'tipo' => 'required|string',
            'portada' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            $album = new Album([
                'nombre' => $request->nombre,
                'num_canciones' => $request->num_canciones,
                'duracion_total' => $request->duracion_total,
                'tipo' => $request->tipo,
                'portada' => $request->portada,
            ]);
            $album->id_usuario = auth()->id();
            $album->save();

           
            if ($request->hasFile('portada')) {
                $album->addMediaFromRequest('portada')
                    ->toMediaCollection('images/albums');
            }

            return response()->json([
                'message' => 'Álbum creado exitosamente',
                'album' => $album
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el álbum',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Recibir los álbumes de un usuario artista en concreto (y los datos del usuario artista propietario).
     */
    public function show($userId)
    {
        $albumes = Album::with('user')->where('id_usuario', $userId)->get();

        return response()->json($albumes, 200);

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
