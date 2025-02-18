<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Album;




class AlbumController extends Controller
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
            'num_canciones' => 'required|integer',
            'duracion_total' => 'required|string',
            'tipo' => 'required|string',
            'portada' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('portada')) {
            $fileName = time() . '_' . $request->file('portada')->getClientOriginalName();
            $request->file('portada')->storeAs('public/images/albums', $fileName);
            
           
            $album = new Album([
                'nombre' => $request->nombre,
                'num_canciones' => $request->num_canciones,
                'duracion_total' => $request->duracion_total,
                'tipo' => $request->tipo,
                'portada' => $fileName
            ]);
            
       
            $album->id_usuario = auth()->id();
            $album->save();

            return response()->json([
                'message' => 'Album creado exitosamente',
                'album' => $album
            ], 201);
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
