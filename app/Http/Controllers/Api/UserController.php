<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
{
    $orderColumn = request('order_column', 'created_at');
    if (!in_array($orderColumn, ['id', 'name', 'created_at'])) {
        $orderColumn = 'created_at';
    }
    $orderDirection = request('order_direction', 'desc');
    if (!in_array($orderDirection, ['asc', 'desc'])) {
        $orderDirection = 'desc';
    }
    
    $users = User::
    when(request('search_id'), function ($query) {
        $query->where('id', request('search_id'));
    })
    ->when(request('search_title'), function ($query) {
        $query->where('name', 'like', '%'.request('search_title').'%');
    })
    ->when(request('search_global'), function ($query) {
        $query->where(function($q) {
            $q->where('id', request('search_global'))
                ->orWhere('name', 'like', '%'.request('search_global').'%');
        });
    })

    ->when(request('role'), function ($query) {
        $query->whereHas('roles', function($roleQuery) {
            $roleQuery->where('name', request('role'));
        });
    })
    ->orderBy($orderColumn, $orderDirection)
    ->paginate(50);

    return UserResource::collection($users);
}

    public function store(StoreUserRequest $request)
    {
        $role = Role::find($request->role_id);
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->surname1 = $request->surname1;
        $user->surname2 = $request->surname2;

        $user->password = Hash::make($request->password);

        if ($user->save()) {
            if ($role) {
                $user->assignRole($role);
            }
            return new UserResource($user);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return UserResource
     */
    public function show(User $user)
    {
        $user->load('roles')->get();
        return new UserResource($user);
    }

    public function getUser($id)
    {
        $user = User::where('id', $id)->first();

        return new UserResource($user);
    }


    public function cambiarRol(Request $request)
{
    try {
        $user = auth()->user();
        $role = Role::where('name', $request->role)->first();
        
        if (!$role) {
            return response()->json(['error' => 'Rol no encontrado'], 404);
        }
        
     
        $user->syncRoles($role);
        
    
        return new UserResource($user);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al cambiar el rol: ' . $e->getMessage()], 500);
    }
}

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return UserResource
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('descripcion')) {
            $user->descripcion = $request->descripcion;
        }

        $user->save();

        return new UserResource($user);
    }




    public function updateimg(Request $request)
    {

        $user = User::find($request->id);

        if($request->hasFile('picture')) {
            $user->clearMediaCollection('images-users');
            $media = $user->addMediaFromRequest('picture')->preservingOriginal()->toMediaCollection('images-users');

        }
        $user =  User::with('media')->find($request->id);
        return  $user;
    }

    public function updateimgDetalles(Request $request)
    {
        $user = User::find($request->id);

        if($request->hasFile('picture')) {
            $user->clearMediaCollection('images-users-detalles');

            // Subir nueva imagen
            $user->addMediaFromRequest('picture')->preservingOriginal()->toMediaCollection('images-users-detalles');
        }

        return User::with('media')->find($request->id);
    }


    public function destroy(User $user)
    {
        $this->authorize('user-delete');
        $user->delete();

        return response()->noContent();
    }


}
