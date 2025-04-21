<?php

namespace Tests\Feature;

use App\Models\Album;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AlbumTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $adminUser;

    public function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        
       
        $this->adminUser = User::factory()->create();
        
        $this->adminUser->assignRole('admin');
        
     
        Storage::fake('public');
    }

    public function test_index_returns_all_albums()
    {
      
        $albums = Album::factory()->count(3)->create([
            'id_usuario' => $this->user->id
        ]);

        $response = $this->getJson('/api/albums');

        $response->assertStatus(200)
                ->assertJsonCount(3);
    }

    public function test_store_creates_new_album()
    {
        $this->actingAs($this->user);

        $albumData = [
            'nombre' => 'Test Album',
            'num_canciones' => 10,
            'duracion_total' => '45:30',
            'tipo' => 'album',
            'portada' => UploadedFile::fake()->image('album_cover.jpg')
        ];

        $response = $this->postJson('/api/albums', $albumData);

        $response->assertStatus(201)
                ->assertJsonFragment([
                    'nombre' => 'Test Album',
                    'num_canciones' => 10
                ]);

        $this->assertDatabaseHas('albums', [
            'nombre' => 'Test Album',
            'id_usuario' => $this->user->id
        ]);
    }

    public function test_show_returns_album_by_id()
    {
        $album = Album::factory()->create([
            'id_usuario' => $this->user->id,
            'nombre' => 'Test Album Show'
        ]);

        $response = $this->getJson("/api/albums/{$album->id}");

        $response->assertStatus(200)
                ->assertJsonFragment([
                    'nombre' => 'Test Album Show'
                ]);
    }

    public function test_show_returns_404_for_nonexistent_album()
    {
        $response = $this->getJson("/api/albums/9999");

        $response->assertStatus(404);
    }

    public function test_get_canciones_album_returns_songs()
    {
        $album = Album::factory()->create([
            'id_usuario' => $this->user->id
        ]);
        
        // You'll need to create and associate songs with the album
        // This depends on your relationship setup
        // $album->canciones()->saveMany(Song::factory()->count(3)->create());

        $response = $this->getJson("/api/albums/{$album->id}/canciones");

        $response->assertStatus(200);
        // Assert that the correct number of songs is returned
        // $response->assertJsonCount(3);
    }

    public function test_get_albums_artista_returns_artist_albums()
    {
        Album::factory()->count(3)->create([
            'id_usuario' => $this->user->id
        ]);

        $response = $this->getJson("/api/albums/artista/{$this->user->id}");

        $response->assertStatus(200)
                ->assertJsonCount(3);
    }

    public function test_update_portada_updates_album_cover()
    {
        $this->actingAs($this->user);

        $album = Album::factory()->create([
            'id_usuario' => $this->user->id
        ]);

        $response = $this->postJson("/api/albums/{$album->id}/portada", [
            'portada' => UploadedFile::fake()->image('new_cover.jpg')
        ]);

        $response->assertStatus(200)
                ->assertJsonFragment([
                    'message' => 'Portada actualizada exitosamente'
                ]);
    }

    public function test_update_portada_returns_403_for_unauthorized_user()
    {
        $this->actingAs($this->user);

        $otherUser = User::factory()->create();
        $album = Album::factory()->create([
            'id_usuario' => $otherUser->id
        ]);

        $response = $this->postJson("/api/albums/{$album->id}/portada", [
            'portada' => UploadedFile::fake()->image('new_cover.jpg')
        ]);

        $response->assertStatus(403);
    }

    public function test_update_updates_album_data()
    {
        $this->actingAs($this->user);

        $album = Album::factory()->create([
            'id_usuario' => $this->user->id,
            'nombre' => 'Original Name',
            'tipo' => 'album'
        ]);

        $updateData = [
            'nombre' => 'Updated Album Name',
            'tipo' => 'ep',
            'num_canciones' => 5,
            'duracion_total' => '25:15'
        ];

        $response = $this->putJson("/api/albums/{$album->id}", $updateData);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('albums', [
            'id' => $album->id,
            'nombre' => 'Updated Album Name',
            'tipo' => 'ep'
        ]);
    }

    public function test_update_returns_403_for_unauthorized_user()
    {
        $this->actingAs($this->user);

        $otherUser = User::factory()->create();
        $album = Album::factory()->create([
            'id_usuario' => $otherUser->id
        ]);

        $updateData = [
            'nombre' => 'Updated Album Name',
            'tipo' => 'ep',
            'num_canciones' => 5,
            'duracion_total' => '25:15'
        ];

        $response = $this->putJson("/api/albums/{$album->id}", $updateData);

        $response->assertStatus(403);
    }

    public function test_destroy_deletes_album()
    {
        $this->actingAs($this->user);

        $album = Album::factory()->create([
            'id_usuario' => $this->user->id
        ]);

        $response = $this->deleteJson("/api/albums/{$album->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('albums', ['id' => $album->id]);
    }

    public function test_destroy_allows_admin_to_delete_any_album()
    {
        $this->actingAs($this->adminUser);

        $album = Album::factory()->create([
            'id_usuario' => $this->user->id  // Created by a different user
        ]);

        $response = $this->deleteJson("/api/albums/{$album->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('albums', ['id' => $album->id]);
    }

    public function test_destroy_returns_403_for_unauthorized_user()
    {
        $this->actingAs($this->user);

        $otherUser = User::factory()->create();
        $album = Album::factory()->create([
            'id_usuario' => $otherUser->id
        ]);

        $response = $this->deleteJson("/api/albums/{$album->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('albums', ['id' => $album->id]);
    }

    public function test_obtener_albums_aleatorios()
    {
        Album::factory()->count(5)->create();

        $response = $this->getJson('/api/albums/aleatorios');

        $response->assertStatus(200);
        // Since it returns up to 4 random albums, we can assert the count is <= 4
        $this->assertLessThanOrEqual(4, count($response->json('data')));
    }

    public function test_obtener_todos_los_albumes()
    {
        $count = 5;
        Album::factory()->count($count)->create();

        $response = $this->getJson('/api/albums/todos');

        $response->assertStatus(200);
        $this->assertEquals($count, count($response->json('data')));
    }
}