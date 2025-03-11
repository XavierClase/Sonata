<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Storage;

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
            'id' => $this->id,
            'nombre' => $this->nombre,
            'archivo' => $this->getFirstMediaUrl('audio/canciones'),
            'reproducciones' => $this->reproducciones,
            'duracion' => $this->getDuracionFormateadaAttribute(),
            'autor' => optional($this->user)->name,
            'portada' => $this->albums->first()?->getMedia('*')->isNotEmpty() ? $this->albums->first()->getMedia('*')[0]->getUrl() : null,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString()
        ];
    }
}
