<?php

use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\CancionController;
use App\Http\Controllers\Api\ListaController;
use App\Http\Controllers\Api\BuscarController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\PostControllerAdvance;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\UltimoEscuchadoController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('forget-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('forget.password.post');
Route::post('reset-password', [ResetPasswordController::class, 'reset'])->name('password.reset');

Route::group(['middleware' => 'auth:sanctum'], function() {

    Route::apiResource('users', UserController::class);

    Route::post('users/updateimg', [UserController::class,'updateimg']);
    Route::post('users/updateimgdetalles', [UserController::class,'updateimgdetalles']);
    Route::put('/users/{user}', [UserController::class, 'update']);


    Route::apiResource('posts', PostControllerAdvance::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('roles', RoleController::class);

    Route::get('role-list', [RoleController::class, 'getList']);
    Route::get('role-permissions/{id}', [PermissionController::class, 'getRolePermissions']);
    Route::put('/role-permissions', [PermissionController::class, 'updateRolePermissions']);
    Route::apiResource('permissions', PermissionController::class);

    Route::get('category-list', [CategoryController::class, 'getList']);
    Route::get('/user', [ProfileController::class, 'user']);
    Route::put('/user', [ProfileController::class, 'update']);


    Route::get('abilities', function(Request $request) {
        return $request->user()->roles()->with('permissions')
            ->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('name')
            ->unique()
            ->values()
            ->toArray();
    });
});

Route::get('category-list', [CategoryController::class, 'getList']);

Route::get('get-posts', [PostControllerAdvance::class, 'getPosts']);
Route::get('get-category-posts/{id}', [PostControllerAdvance::class, 'getCategoryByPosts']);
Route::get('get-post/{id}', [PostControllerAdvance::class, 'getPost']);


Route::post('albums', [AlbumController::class, 'store']);
Route::get('albumes', [AlbumController::class, 'index']);
Route::get('albumes/{id}', [AlbumController::class, 'getAlbumsArtista']);
Route::get('album/{id}', [AlbumController::class, 'show']);
Route::get('albumes/{id}/canciones', [AlbumController::class, 'getCancionesAlbum']);
Route::put('albumes/{id}', [AlbumController::class, 'update']);
Route::delete('albumes/{id}', [AlbumController::class, 'destroy']);
Route::post('/albumes/{id}/portada', [AlbumController::class, 'updatePortada']);
Route::get('albums/aleatorios', [AlbumController::class, 'obtenerAlbumsAleatorios']);    
Route::get('admin/albumes', [AlbumController::class, 'obtenerTodosLosAlbumes']);

Route::post('canciones', [CancionController::class, 'store']);
Route::get('canciones/populares/{id}', [CancionController::class, 'getPopulares']);
Route::get('canciones/{id}', [CancionController::class, 'getCancionesUsuario']);
Route::put('canciones/{id}', [CancionController::class, 'update']);
Route::get('/canciones/usuario/{id}', [CancionController::class, 'getCancionesArtistaEstadisticas']);
Route::delete('canciones/{id}', [CancionController::class, 'destroy']);
Route::post('reproducciones/{id}', [CancionController::class, 'sumarRepro']);


Route::get('user/{id}', [UserController::class, 'getUser']);
Route::post('users/cambiarRol', [UserController::class, 'cambiarRol']);

Route::get('listas/aleatorias', [ListaController::class, 'obtenerListasAleatorias']);
Route::post('listas', [ListaController::class, 'store']);
Route::get('listas/{id}', [ListaController::class, 'getListasUser']);
Route::get('lista/{id}', [ListaController::class, 'show']);
Route::get('listas/{id}/canciones', [ListaController::class, 'getCancionesLista']);
Route::post('listas/updateimg', [ListaController::class,'updateimg']);
Route::post('listas/update/{id}', [ListaController::class,'update']);
Route::get('listas/usuario/{userId}', [ListaController::class, 'getListasUser']);
Route::post('/listas/añadirCancion', [ListaController::class, 'añadirCancionALista']);
Route::delete('listas/del/{id}', [ListaController::class, 'destroy']);





Route::get('ultimo_escuchado', [UltimoEscuchadoController::class, 'index']);
Route::post('ultimo_escuchado', [UltimoEscuchadoController::class, 'store']);


Route::get('buscador', [BuscarController::class, 'buscar']);


Route::get('/mostrar/cancion/likes', [LikeController::class, 'getCancionesFavoritas']);
Route::post('/like/cancion/{id_cancion}', [LikeController::class, 'toggleLikeCancion']);
Route::get('/cancion/likes', [LikeController::class, 'cancionesFavoritas']);

Route::get('/mostrar/album/likes', [LikeController::class, 'getAlbumesFavoritos']);
Route::post('/like/album/{idAlbum}', [LikeController::class, 'toggleLikeAlbum']);
Route::get('/album/favorito/{idAlbum}', [LikeController::class, 'esAlbumFavorito']);

Route::get('/mostrar/lista/likes', [LikeController::class, 'getListasFavoritas']);
Route::get('/mostrar/lista/likes/{idUser}', [LikeController::class, 'getListasFavoritasUser']);
Route::post('/like/lista/{idLista}', [LikeController::class, 'toggleLikeLista']);
Route::get('/lista/favorito/{idLista}', [LikeController::class, 'esListaFavorita']);

//admin listas
Route::get('admin/listas', [ListaController::class, 'index']);
Route::post('admin/listas', [ListaController::class, 'store']);
Route::get('admin/listas/{id}', [ListaController::class, 'show']);
Route::put('admin/listas/{id}', [ListaController::class, 'update']);
Route::delete('admin/listas/{id}', [ListaController::class, 'destroy']);
Route::post('admin/listas/updateimg', [ListaController::class, 'updateimg']);
Route::delete('listas/{lista_id}/cancion/{cancion_id}', [ListaController::class, 'eliminarCancionDeLista']);

//admin album
Route::post('admin/albumes', [AlbumController::class, 'store']);
Route::get('admin/albumes/{id}', [AlbumController::class, 'show']); 
Route::put('admin/albumes/{id}', [AlbumController::class, 'update']); 
Route::delete('admin/albumes/{id}', [AlbumController::class, 'destroy']);
Route::post('admin/albumes/update-portada', [AlbumController::class, 'updatePortada']);


//admin cancione
Route::get('admin/canciones/{id}', [CancionController::class, 'show']);
Route::get('admin/canciones', [CancionController::class, 'index']);
Route::post('admin/canciones', [CancionController::class, 'store']);
Route::post('admin/canciones/{id}', [CancionController::class, 'update']);
Route::delete('admin/canciones/{id}', [CancionController::class, 'destroy']);
Route::post('admin/canciones/updateaudio', [CancionController::class, 'updateAudio']);


Route::post('/albumes', [AlbumController::class, 'store'])->middleware('auth:sanctum');