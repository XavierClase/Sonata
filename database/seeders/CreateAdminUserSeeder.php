<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateAdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'id' => 1,
            'name' => 'David',
            'email' => 'admin@demo.com',
            'password' => bcrypt('123'),
        ]);

        $role = Role::create(['name' => 'admin']);
        $role2 = Role::create(['name' => 'user']);
        $role3 = Role::create(['name' => 'artista']);
        
        $permissions = [
            'lista-list',
            'lista-create',
            'lista-edit',
            'lista-delete',
            'cancion-list',
            'album-list'
        ];
        $role2->syncPermissions($permissions);

        $permissions = Permission::pluck('id','id')->all();

        $role->syncPermissions($permissions);

        $user->assignRole([$role->id]);

        $user = User::create([
            'id' => 2,
            'name' => 'User',
            'email' => 'user@demo.com',
            'password' => bcrypt('123')
        ]);
        $user->assignRole([$role2->id]);

        $permissions = [
            'cancion-create',
            'cancion-edit',
            'cancion-delete',
            'album-create',
            'album-edit',
            'album-delete'
        ];
        $role3->syncPermissions($permissions);

        $user = User::create([
            'id' => 3,
            'name' => 'Artista',
            'email' => 'artista@demo.com',
            'password' => bcrypt('123')
        ]);
        $user->assignRole([$role3->id]);

    }
}
