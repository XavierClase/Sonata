<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CancionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => 'Id del autor:' . $this->id,
            'nombre' => $this->nombre,
            'archivo' => $this->archivo,
            'reproduccciones' => $this->reproducciones,
            'duracion' => $this->duracion,
            'autor' => $this->id_usuario,
            
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString()
        ];
    }
}
