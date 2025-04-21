<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Lista;
use App\Models\Cancion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ListaTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_una_lista(): void
    {
        $user = User::create([
            'name' => 'Usuario Prueba',
            'email' => 'usuario@example.com',
            'password' => bcrypt('password'),
        ]);

        $lista = Lista::create([
            'nombre' => 'Lista de prueba',
            'descripcion' => 'Descripción',
            'id_usuario' => $user->id,
        ]);

        $this->assertDatabaseHas('listas', [
            'nombre' => 'Lista de prueba',
            'descripcion' => 'Descripción',
            'id_usuario' => $user->id,
        ]);
    }

    public function test_lista_tiene_relacion_con_usuario(): void
    {
        $user = User::create([
            'name' => 'Usuario Relacionado',
            'email' => 'relacionado@example.com',
            'password' => bcrypt('password'),
        ]);

        $lista = Lista::create([
            'nombre' => 'Lista relacionada',
            'descripcion' => 'Relacionada con usuario',
            'id_usuario' => $user->id,
        ]);

        $this->assertEquals($user->id, $lista->usuario->id);
    }

    public function test_lista_puede_tener_canciones(): void
    {
        $user = User::create([
            'name' => 'Usuario Canciones',
            'email' => 'canciones@example.com',
            'password' => bcrypt('password'),
        ]);

        $lista = Lista::create([
            'nombre' => 'Lista con canciones',
            'descripcion' => 'Tiene canciones',
            'id_usuario' => $user->id,
        ]);

        $cancion = Cancion::create([
            'titulo' => 'Canción de prueba',
            'artista' => 'Artista X',
            'archivo' => 'media/audio/canciones/test.mp3',
        ]);

        $lista->canciones()->attach($cancion->id);

        $this->assertTrue($lista->canciones->contains($cancion));
    }

    public function test_puede_guardar_una_imagen_en_la_media_collection(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name' => 'Usuario Imagen',
            'email' => 'imagen@example.com',
            'password' => bcrypt('password'),
        ]);

        $lista = Lista::create([
            'nombre' => 'Lista con imagen',
            'descripcion' => 'Descripción',
            'id_usuario' => $user->id,
        ]);

        $imagen = UploadedFile::fake()->image('imagen.jpg');

        $lista->addMedia($imagen)->toMediaCollection('imagen_usuario');

        $this->assertCount(1, $lista->getMedia('imagen_usuario'));
    }
}
