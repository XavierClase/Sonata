<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
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
            'num_cancioens' => $this->num_cancioens,
            'duracion_total' => $this->duracion_total,
            'portada' => count($this->getMedia('*')) > 0 ? $this->getMedia('*')[0]->getUrl() : null,
            'tipo' => $this->tipo,
            'artista' => $this->artista->nombre,
            
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString()
        ];

    }
}
