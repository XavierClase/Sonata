<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Album;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

class AlbumTest extends TestCase
{
    use WithFaker;

    protected $user;
    protected $admin;
    protected $album;

    public function setUp(): void
    {
        parent::setUp();
        
      
        $this->user = User::firstOrCreate(
            ['email' => 'test_user@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        
       
        $this->admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        
       
        $this->album = Album::firstOrCreate(
            ['nombre' => 'Album Test'],
            [
                'id_usuario' => $this->user->id,
                'num_canciones' => 5,
                'duracion_total' => '00:15:30',
                'tipo' => 'album'
            ]
        );
    }

    /** @test */
    public function puede_obtener_todos_los_albumes()
    {
       
        $response = $this->getJson('/api/albumes');
        
        $response->assertStatus(200);
        $this->assertIsArray($response->json());
    }

    /** @test */
    public function puede_obtener_un_album_especifico()
    {
       
        $response = $this->getJson('/api/albumes/' . $this->album->id);
        
        $response->assertStatus(200);
    }

    /** @test */
    public function puede_crear_un_album_con_autenticacion()
    {
        Storage::fake('public');
        Sanctum::actingAs($this->user);
        
        $file = UploadedFile::fake()->image('album_cover.jpg');
        
        $response = $this->postJson('/api/albumes', [
            'nombre' => 'Nuevo Album Test',
            'num_canciones' => 8,
            'duracion_total' => '32:45',
            'tipo' => 'album',
            'portada' => $file
        ]);
        
        $response->assertStatus(201);
        $this->assertArrayHasKey('album', $response->json());
    }

    /** @test */
    public function no_puede_crear_album_sin_autenticacion()
    {
        Storage::fake('public');
        
        $file = UploadedFile::fake()->image('album_cover.jpg');
        
        $response = $this->postJson('/api/albumes', [
            'nombre' => 'Album Sin Auth',
            'num_canciones' => 3,
            'duracion_total' => '12:15',
            'tipo' => 'sencillo',
            'portada' => $file
        ]);
        
       
        $response->assertStatus(401);
    }

    /** @test */
    public function puede_actualizar_un_album_propio()
    {
        Sanctum::actingAs($this->user);
        
        
        $response = $this->putJson('/api/albumes/' . $this->album->id, [
            'nombre' => 'Album Actualizado',
            'num_canciones' => 6,
            'duracion_total' => '18:20',
            'tipo' => 'ep',
            'canciones' => '[]'
        ]);
        
    
        if ($response->status() == 405) {
            $response = $this->postJson('/api/albumes/' . $this->album->id, [
                'nombre' => 'Album Actualizado',
                'num_canciones' => 6,
                'duracion_total' => '18:20',
                'tipo' => 'ep',
                '_method' => 'PUT',
                'canciones' => '[]'
            ]);
        }
        
        $response->assertStatus(200);
    }

    /** @test */
    public function puede_actualizar_portada_album()
    {
        Storage::fake('public');
        Sanctum::actingAs($this->user);
        
        $file = UploadedFile::fake()->image('new_cover.jpg');
        
        
        $response = $this->postJson('/api/albumes/' . $this->album->id . '/portada', [
            'portada' => $file
        ]);
        
        $response->assertStatus(200);
    }

    /** @test */
    public function puede_eliminar_album_como_propietario()
    {
      
        $tempAlbum = Album::create([
            'nombre' => 'Album Temporal',
            'id_usuario' => $this->user->id,
            'num_canciones' => 2,
            'duracion_total' => '00:08:30',
            'tipo' => 'sencillo'
        ]);
        
        Sanctum::actingAs($this->user);
        
       
        $response = $this->deleteJson('/api/albumes/' . $tempAlbum->id);
        
        $response->assertStatus(200);
    }

    /** @test */
    public function puede_obtener_albumes_de_un_artista()
    {
      
        $response = $this->getJson('/api/albumes/artista/' . $this->user->id);
        
        $response->assertStatus(200);
    }

    /** @test */
    public function puede_obtener_albumes_aleatorios()
    {
      
        $response = $this->getJson('/api/albumes/aleatorios');
        
        $response->assertStatus(200);
        $this->assertArrayHasKey('data', $response->json());
    }

    /** @test */
    public function puede_obtener_todos_los_albumes_detallados()
    {
       
        $response = $this->getJson('/api/albumes/todos');
        
        $response->assertStatus(200);
        $this->assertArrayHasKey('data', $response->json());
    }
}