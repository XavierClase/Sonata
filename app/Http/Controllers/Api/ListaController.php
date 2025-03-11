<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListaResource;
use App\Http\Resources\CancionResource;
use Illuminate\Http\Request;
use App\Models\Lista;


class ListaController extends Controller
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
            'descripcion' => 'nullable|string',
            'duracion_total' => 'required|string',
            'portada' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {

            $lista = new Lista([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,  
                'duracion_total' => $request->duracion_total, 
            ]);
            
            $lista->id_usuario = auth()->id();
            $lista->save();

            if ($request->hasFile('portada')) {
                $lista->addMediaFromRequest('portada')
                    ->toMediaCollection('images/listas');
            }

            return response()->json([
                'message' => 'Lista creada exitosamente',
                'lista' => $lista
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la lista',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recibe los datos de la lista seleccionada.
     */
    public function show($idLista)
    {
        $lista = Lista::where('id', $idLista)->first();

        if (!$lista) {
            return response()->json(['message' => 'Álbum no encontrado'], 404);
        }
        
        return new ListaResource($lista);
    }

    /**
     * Recibir todas las canciones pertenecientes a la lista introducida.
     */
    public function getCancionesLista(string $id)
    {
        $lista = Lista::findOrFail($id);
        $canciones = $lista->canciones;
        
        return CancionResource::collection($canciones);
    }

    /**
     * Recibir las listas de el usuario iniciado.
     */
    public function getListasUser($userId)
    {
        $listas = Lista::where('id_usuario', $userId)->get();

        return ListaResource::collection($listas); 
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
