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
        $permissions = [
            'post-list',
            'post-create',
            'post-edit',
            'post-delete',
            'post-list'
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

    }
}
