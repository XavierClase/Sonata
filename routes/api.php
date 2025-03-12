<?php

use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\CancionController;
use App\Http\Controllers\Api\ListaController;

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\PostControllerAdvance;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('forget-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('forget.password.post');
Route::post('reset-password', [ResetPasswordController::class, 'reset'])->name('password.reset');

Route::group(['middleware' => 'auth:sanctum'], function() {

    Route::apiResource('users', UserController::class);

    Route::post('users/updateimg', [UserController::class,'updateimg']);
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

    Route::post('albums', [AlbumController::class, 'store']);
    Route::post('canciones', [CancionController::class, 'store']);

    Route::get('canciones/{id}', [CancionController::class, 'getCancionesUsuario']);
    Route::get('albumes/{id}/canciones', [AlbumController::class, 'getCancionesAlbum']);
    Route::put('albumes/{id}', [AlbumController::class, 'update']);
    Route::delete('albumes/{id}', [AlbumController::class, 'destroy']);
    Route::get('/canciones/usuario/{id}', [CancionController::class, 'getCancionesArtistaEstadisticas']);
    Route::delete('canciones/{id}', [CancionController::class, 'destroy']);
    
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


Route::get('albumes', [AlbumController::class, 'index']);
Route::get('albumes/{id}', [AlbumController::class, 'getAlbumsArtista']);
Route::get('album/{id}', [AlbumController::class, 'show']);

Route::get('canciones/populares/{id}', [CancionController::class, 'getPopulares']);

Route::get('user/{id}', [UserController::class, 'getUser']);
Route::post('users/cambiarRol', [UserController::class, 'cambiarRol']);


Route::post('listas', [ListaController::class, 'store']);
Route::get('listas/{id}', [ListaController::class, 'getListasUser']);
Route::get('lista/{id}', [ListaController::class, 'show']);
Route::get('listas/{id}/canciones', [ListaController::class, 'getCancionesLista']);
Route::post('listas/updateimg', [ListaController::class,'updateimg']);
Route::post('listas/update/{id}', [ListaController::class,'update']);



Route::post('like/cancion', [LikeController::class, 'likeCancion']);