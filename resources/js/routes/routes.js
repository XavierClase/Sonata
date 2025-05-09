import { authStore } from "../store/auth";

const AuthenticatedLayout = () => import('../layouts/Authenticated.vue')
const AuthenticatedUserLayout = () => import('../layouts/AuthenticatedUser.vue')
const GuestLayout = ()  => import('../layouts/Guest.vue');
const PostsIndex  = ()  => import('../views/admin/posts/Index.vue');
const PostsCreate  = ()  => import('../views/admin/posts/Create.vue');
const PostsEdit  = ()  => import('../views/admin/posts/Edit.vue');

async function requireLogin(to, from, next) {
    const auth = authStore();
    let isLogin = !!auth.authenticated;

    if (isLogin) {
        next()
    } else {
        next('/login')
    }
}

function hasAdmin(roles) {
    for (let rol of roles) {
        if (rol.name && rol.name.toLowerCase().includes('admin')) {
            return true;
        }
    }
    return false;
}

function hasArtista(roles) {
    for (let rol of roles) {
        if (rol.name && rol.name.toLowerCase().includes('artista')) {
            return true;
        }
    }
    return false;
}



async function guest(to, from, next) {
    const auth = authStore()

    let isLogin = !!auth.authenticated;

    if (isLogin) {
        next('/')
    } else {
        next()
    }
}

async function requireAdmin(to, from, next) {

    const auth = authStore();
    let isLogin = !!auth.authenticated;
    let user = auth.user;

    if (isLogin) {
        if( hasAdmin(user.roles)){
            next()
        }else{
            next('/app')
        }
    } else {
        next('/login')
    }
}

async function requireArtista(to, from, next) {

    const auth = authStore();
    let isLogin = !!auth.authenticated;
    let user = auth.user;

    if (isLogin) {
        if( hasArtista(user.roles)){
            next()
        }else{
            next('/app')
        }
    } else {
        next('/')
    }
}

async function redirigirAHome(to, from, next) {
    const auth = authStore();
    
    if (auth.authenticated) {
        next('/app'); 
        return;
    }
    
    next(); 
}

function redirectToProfile(to, from, next) {
    const store = authStore();
    const requestedId = to.params.id;
    const currentUserId = store.user.id;
    const userRole = store.user?.roles?.[0]?.name.toLowerCase();

  
    if (requestedId == currentUserId) {
        const targetRoute = userRole === 'artista' ? 'artista.perfil' : 'app.perfil';

        if (to.name === targetRoute) {
         
            return next();
        }

        return next({ name: targetRoute, params: { id: currentUserId } });
    }

    fetch(`/api/users/${requestedId}`)
        .then(response => response.json())
        .then(user => {
            
            if (!user.data || !Array.isArray(user.data.roles)) {
                throw new Error('No se encontraron roles en la respuesta');
            }

            const isArtist = user.data.roles.some(role => role.name?.toLowerCase() === 'artista');
            const targetRoute = isArtist ? 'artista.perfil' : 'app.perfil';

            
            if (to.name === targetRoute) {
              
                return next();
            }

           
            next({ name: targetRoute, params: { id: requestedId } });
        })
        .catch(error => {
            
            next('/app'); 
        });
}







export default [
    {
        path: '/',
        // redirect: { name: 'login' },
        component: GuestLayout,
        children: [

            {
                path: '/',
                name: 'home',
                component: () => import('../views/home/index.vue'),
                beforeEnter: redirigirAHome,
            },
            {
                path: 'posts',
                name: 'public-posts.index',
                component: () => import('../views/posts/index.vue'),
            },
            {
                path: 'posts/:id',
                name: 'public-posts.details',
                component: () => import('../views/posts/details.vue'),
            },
            {
                path: 'category/:id',
                name: 'category-posts.index',
                component: () => import('../views/category/posts.vue'),
            },
            {
                path: 'login',
                name: 'auth.login',
                component: () => import('../views/login/Login.vue'),
                beforeEnter: guest,
            },
            {
                path: 'register',
                name: 'auth.register',
                component: () => import('../views/register/index.vue'),
                beforeEnter: guest,
            },
            {
                path: 'forgot-password',
                name: 'auth.forgot-password',
                component: () => import('../views/auth/passwords/Email.vue'),
                beforeEnter: guest,
            },
            {
                path: 'reset-password/:token',
                name: 'auth.reset-password',
                component: () => import('../views/auth/passwords/Reset.vue'),
                beforeEnter: guest,
            },
        ]
    },

    {
        path: '/app',
        component: AuthenticatedUserLayout,
        // redirect: {
        //     name: 'admin.index'
        // },
        beforeEnter: requireLogin,
        meta: { breadCrumb: 'Dashboard' },
        children: [
            {
                name: 'app.index',
                path: '',
                component: () => import('../views/app/index.vue'),
                meta: { breadCrumb: 'App' }
            },
            {
                name: 'app.biblioteca',
                path: 'biblioteca',
                component: () => import('../views/app/biblioteca.vue'),
                meta: { breadCrumb: 'biblioteca' }
            },
            {
                name: 'app.album',
                path: 'album/:id',
                component: () => import('../views/app/album.vue'),
                meta: { breadCrumb: 'album' }
                
            },
            {
                name: 'app.lista',
                path: 'lista/:id',
                component: () => import('../views/app/lista.vue'),
                meta: { breadCrumb: 'lista' }
            },
            {
                name: 'app.likes',
                path: 'likes',
                component: () => import('../views/app/likes.vue'),
                meta: { breadCrumb: 'likes' }
            },
            {
                name: 'app.perfil',
                path: 'perfil/:id',
                component: () => import('../views/app/perfilUsuario.vue'),
                meta: { breadCrumb: 'perfil' },
                beforeEnter: redirectToProfile
            },
            {
                name: 'artista',
                path: 'artista',
                meta: { breadCrumb: 'Artista'},
                children: [
                    {
                        name: 'artista.perfil',
                        path: 'perfil/:id',
                        component: () => import('../views/app/artista/perfil.vue'),
                        meta: { breadCrumb: 'perfil' },
                        beforeEnter: redirectToProfile
                    },
                    {
                        name: 'artista.estadisticas',
                        path: 'estadisticas',
                        component: () => import('../views/app/artista/estadisticas.vue'),
                        meta: { breadCrumb: 'estadisticas' },
                        beforeEnter: requireArtista
                    },
                    {
                        name: 'artista.upload',
                        path: 'upload',
                        component: () => import('../views/app/artista/upload.vue'),
                        meta: { breadCrumb: 'upload' },
                        beforeEnter: requireArtista
                    },
                    {
                        name: 'artista.edit',
                        path: 'edit',
                        component: () => import('../views/app/artista/edit.vue'),
                        meta: { breadCrumb: 'edit' },
                        beforeEnter: requireArtista
                    },
                ]
            }
        ]
    },

    


    {
        path: '/admin',
        component: AuthenticatedLayout,
        // redirect: {
        //     name: 'admin.index'
        // },
        beforeEnter: requireAdmin,
        meta: { breadCrumb: 'Dashboard' },
        children: [
            {
                name: 'admin.index',
                path: '',
                component: () => import('../views/admin/index.vue'),
                meta: { breadCrumb: 'Admin' }
            },
            {
                name: 'profile.index',
                path: 'profile',
                component: () => import('../views/admin/profile/index.vue'),
                meta: { breadCrumb: 'Profile' }
            },
            {
                name: 'posts.index',
                path: 'posts',
                component: PostsIndex,
                meta: { breadCrumb: 'Posts' }
            },
            {
                name: 'posts.create',
                path: 'posts/create',
                component: PostsCreate,
                meta: { breadCrumb: 'Add new post' }
            },
            {
                name: 'posts.edit',
                path: 'posts/edit/:id',
                component: PostsEdit,
                meta: { breadCrumb: 'Edit post' }
            },
            {
                name: 'categories',
                path: 'categories',
                meta: { breadCrumb: 'Categories'},
                children: [
                    {
                        name: 'categories.index',
                        path: '',
                        component: () => import('../views/admin/categories/Index.vue'),
                        meta: { breadCrumb: 'View category' }
                    },
                    {
                        name: 'categories.create',
                        path: 'create',
                        component: () => import('../views/admin/categories/Create.vue'),
                        meta: {
                            breadCrumb: 'Add new category' ,
                            linked: false,
                        }
                    },
                    {
                        name: 'categories.edit',
                        path: 'edit/:id',
                        component: () => import('../views/admin/categories/Edit.vue'),
                        meta: {
                            breadCrumb: 'Edit category',
                            linked: false,
                        }
                    }
                ]
            },
            {
                name: 'permissions',
                path: 'permissions',
                meta: { breadCrumb: 'Permisos'},
                children: [
                    {
                        name: 'permissions.index',
                        path: '',
                        component: () => import('../views/admin/permissions/Index.vue'),
                        meta: { breadCrumb: 'Permissions' }
                    },
                    {
                        name: 'permissions.create',
                        path: 'create',
                        component: () => import('../views/admin/permissions/Create.vue'),
                        meta: {
                            breadCrumb: 'Create Permission',
                            linked: false,
                        }
                    },
                    {
                        name: 'permissions.edit',
                        path: 'edit/:id',
                        component: () => import('../views/admin/permissions/Edit.vue'),
                        meta: {
                            breadCrumb: 'Permission Edit',
                            linked: false,
                        }
                    }
                ]
            },
            {
                name: 'users',
                path: 'users',
                meta: { breadCrumb: 'Usuarios'},
                children: [
                    {
                        name: 'users.index',
                        path: '',
                        component: () => import('../views/admin/users/Index.vue'),
                        meta: { breadCrumb: 'Usuarios' }
                    },
                    {
                        name: 'users.create',
                        path: 'create',
                        component: () => import('../views/admin/users/Create.vue'),
                        meta: {
                            breadCrumb: 'Crear Usuario',
                            linked: false
                        }
                    },
                    {
                        name: 'users.edit',
                        path: 'edit/:id',
                        component: () => import('../views/admin/users/Edit.vue'),
                        meta: {
                            breadCrumb: 'Editar Usuario',
                            linked: false
                        }
                    }
                ]
            },
            {
                name: 'listas',
                path: 'listas',
                meta: { breadCrumb: 'Listas'},
                children: [
                    {
                        name: 'listas.index',
                        path: '',
                        component: () => import('@/views/admin/listas/Index.vue'),
                        meta: { breadCrumb: 'listas' }
                    },
                    {
                        name: 'listas.create',
                        path: 'create',
                        component: () => import('@/views/admin/listas/Create.vue'),
                        meta: {
                            breadCrumb: 'Crear listas',
                            linked: false,
                        }
                    },
                    {
                        name: 'listas.edit',
                        path: 'edit/:id',
                        component: () => import('../views/admin/listas/Edit.vue'),
                        meta: {
                            breadCrumb: 'editar listas',
                            linked: false,
                        }
                    }
                ]
            },
            {
                name: 'canciones',
                path: 'canciones',
                meta: { breadCrumb: 'canciones'},
                children: [
                    {
                        name: 'canciones.index',
                        path: '',
                        component: () => import('@/views/admin/canciones/Index.vue'),
                        meta: { breadCrumb: 'canciones' }
                    },
                    {
                        name: 'canciones.create',
                        path: 'create',
                        component: () => import('@/views/admin/canciones/Create.vue'),
                        meta: {
                            breadCrumb: 'Crear canciones',
                            linked: false,
                        }
                    },
                    {
                        name: 'canciones.edit',
                        path: 'edit/:id',
                        component: () => import('../views/admin/canciones/Edit.vue'),
                        meta: {
                            breadCrumb: 'editar canciones',
                            linked: false,
                        }
                    }
                ]
            },
            {
                name: 'albumes',
                path: 'albumes',
                meta: { breadCrumb: 'albums'},
                children: [
                    {
                        name: 'albumes.index',
                        path: '',
                        component: () => import('@/views/admin/albumes/Index.vue'),
                        meta: { breadCrumb: 'albumes' }
                    },
                    {
                        name: 'canalbumescion.create',
                        path: 'create',
                        component: () => import('@/views/admin/albumes/Create.vue'),
                        meta: {
                            breadCrumb: 'Crear albumes',
                            linked: false,
                        }
                    },
                    {
                        name: 'albumes.edit',
                        path: 'edit/:id',
                        component: () => import('../views/admin/albumes/Edit.vue'),
                        meta: {
                            breadCrumb: 'editar albumes',
                            linked: false,
                        }
                    }
                ]
            },

            //TODO Organizar rutas
            {
                name: 'roles.index',
                path: 'roles',
                component: () => import('../views/admin/roles/Index.vue'),
                meta: { breadCrumb: 'Roles' }
            },
            {
                name: 'roles.create',
                path: 'roles/create',
                component: () => import('../views/admin/roles/Create.vue'),
                meta: { breadCrumb: 'Create Role' }
            },
            {
                name: 'roles.edit',
                path: 'roles/edit/:id',
                component: () => import('../views/admin/roles/Edit.vue'),
                meta: { breadCrumb: 'Role Edit' }
            },

        ]
    },
    {
        path: "/:pathMatch(.*)*",
        name: 'NotFound',
        component: () => import("../views/errors/404.vue"),
    },
];
