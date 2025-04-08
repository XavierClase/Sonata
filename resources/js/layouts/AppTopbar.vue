<template>
    <div class="show"></div>
    <div class="layout-topbar row">
        <router-link to="/app" class="layout-topbar-logo col-md-2">
            <img src="/images/logo.svg" alt="logo"/>
            <span></span>
        </router-link>

        <div class="layout-topbar-centro col-md-6">
            <router-link to="/app">
                <img src="/images/home-icon.svg" alt="" class="layout-topbar-home-icon">
            </router-link>
            
            <div class="buscador-container">
                <Buscador />
            </div>

            <div class="hamburger-menu" @click="toggleMobileMenu">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>


        <div class="layout-topbar-menu col-md-4" :class="topbarMenuClasses">
            <router-link class="topbar-link" :to=" { name: 'app.biblioteca' }">{{ $t('Biblioteca') }}</router-link>
            <a v-if="userRole === 'user'" class="topbar-link" href="#" @click="mostrarDialogArtista">{{ $t('¡Conviertete en artista!') }}</a>
            <router-link v-if="userRole === 'artista'" class="topbar-link" to="/app/artista/estadisticas">{{ $t('Panel de artista') }}</router-link>
            <button class="p-link layout-topbar-button layout-topbar-button-c nav-item dropdown " role="button"
                data-bs-toggle="dropdown">
                <div class="perfil-imagen-container">
                    <img :src="getImageUrl()" alt="Perfil" class="perfil-imagen" />
                </div>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                        <li>
                            <a class="dropdown-item" href="javascript:void(0)" @click.prevent="router.push({ 
                                    name: user?.roles?.[0]?.name.toLowerCase() === 'artista' ? 'artista.perfil' : 'app.perfil',
                                    params: { id: user?.id }
                                })">
                                {{ $t('Perfil') }}
                            </a>
                        </li>
                        <li v-if="esAdmin">
                            <a class="dropdown-item" href="#" @click="router.push({ name: 'admin.index' })">Panel Admin</a>
                        </li>
                        <li v-if="esAdmin">
                            <a class="dropdown-item" href="#" @click="router.push({ name: 'app' })">Panel Usuario</a>
                        </li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li>
                            <a class="dropdown-item" :class="{ 'opacity-25': processing }" :disabled="processing" href="javascript:void(0)" @click="logout">Cerrar sesión</a>
                        </li>
                    </ul>
                </button>  
            </div>

        <!-- Menú móvil desplegable -->
        <div class="mobile-menu" :class="{ 'active': mobileMenuActive }">
            <div class="mobile-menu-header">
                <div class="perfil-imagen-container-mobile">
                    <img :src="getImageUrl()" alt="Perfil" class="perfil-imagen" />
                </div>
                <div class="perfil-info">
                    <span>Hola, {{ authStore().user.name }}</span>
                </div>
                <div class="close-menu" @click="toggleMobileMenu">✕</div>
            </div>
            <div class="mobile-menu-links">
                <router-link class="mobile-link" :to="{ name: 'app.biblioteca' }" @click="toggleMobileMenu">{{ $t('Biblioteca') }}</router-link>
                <a v-if="userRole === 'user'" class="mobile-link" href="#" @click="mostrarDialogArtistaMovil">{{ $t('¡Conviertete en artista!') }}</a>
                <router-link v-if="userRole === 'artista'" class="mobile-link" to="/app/artista/estadisticas" @click="toggleMobileMenu">{{ $t('Panel de artista') }}</router-link>
                <router-link class="mobile-link" :to="{ name: user?.roles?.[0]?.name.toLowerCase() === 'artista' ? 'artista.perfil' : 'app.perfil', params: {id: user?.id} }" @click="toggleMobileMenu">{{ $t('Perfil') }}</router-link>
                <a v-if="esAdmin" class="mobile-link" href="#" @click="goToAdmin">Panel Admin</a>
                <a v-if="esAdmin" class="mobile-link" href="#" @click="goToUser">Panel Usuario</a>
                <a class="mobile-link logout" :class="{ 'opacity-25': processing }" :disabled="processing" href="javascript:void(0)" @click="logoutMobile">Cerrar sesión</a>
            </div>
        </div>

        <Toast></Toast>
        <Dialog class="dialog_diseño" v-model:visible="dialogArtistaVisible" modal header="¡Conviértete en Artista!" appendTo=".show">
            <div class="mensaje_advertencia mb-6">
                <p class="text-surface-500 dark:text-surface-400 "></p>
                <p> ¿Estás seguro que deseas convertirte en artista?</p>
                <p> Este cambio te permitirá subir y gestionar tu música en la plataforma.</p>
                <p class="text-warning">¡Importante! Este cambio no es reversible.</p>
            </div>
            <div class="flex justify-end gap-3">
                <Button type="button" label="Cancelar" class="boton_secundario" @click="dialogArtistaVisible = false"></Button>
                <Button type="button" label="Confirmar" @click="confirmarCambioRol"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useLayout } from '../composables/layout';
import useAuth from "@/composables/auth";
import { useRouter } from "vue-router";
import { authStore } from "../store/auth";
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import axios from 'axios';
import Buscador from '@/components/buscador.vue';

const toast = useToast();
const loading = ref(false);

const user = authStore().user;
const users = ref([]);
const { onMenuToggle } = useLayout();
const { processing, logout } = useAuth();
const topbarMenuActive = ref(false);
const mobileMenuActive = ref(false); // Nuevo: estado del menú hamburguesa
const perfilMenuActive = ref(false); // Nuevo: estado del menú de perfil
const router = useRouter();
const dialogArtistaVisible = ref(false);

// Funcionalidad existente
const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const esAdmin = computed(() => {
   
    return authStore().user?.roles?.some(role => role.name.toLowerCase() === 'admin') || false;
});


const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const toggleMobileMenu = () => {
    mobileMenuActive.value = !mobileMenuActive.value;
    if (mobileMenuActive.value) {
        document.body.classList.add('menu-open');
    } else {
        document.body.classList.remove('menu-open');
    }
    if (perfilMenuActive.value) perfilMenuActive.value = false;
};

const togglePerfilMenu = () => {
    perfilMenuActive.value = !perfilMenuActive.value;
};

const userRole = computed(() => {
    return authStore().user?.roles?.length > 0 ? authStore().user.roles[0].name : '';
});

// Funcionalidad existente
const mostrarDialogArtista = () => {
    dialogArtistaVisible.value = true;
};

const mostrarDialogArtistaMovil = () => {
    dialogArtistaVisible.value = true;
    mobileMenuActive.value = false;
};

const goToAdmin = () => {
    router.push({ name: 'admin.index' });
    mobileMenuActive.value = false;
};

const goToUser = () => {
    router.push({ name: 'app' });
    mobileMenuActive.value = false;
};

const logoutMobile = () => {
    mobileMenuActive.value = false;
    logout();
};



const confirmarCambioRol = async () => {
    loading.value = true;
    try {
        const response = await axios.post('/api/users/cambiarRol', { role: 'artista' });
        
        const store = authStore();
        store.user = response.data.data;
        
        toast.add({
            severity: 'success',
            summary: '¡Cambio exitoso!',
            detail: 'Ahora eres un artista y puedes empezar a subir tu música.',
            life: 3000
        });
        
        dialogArtistaVisible.value = false;
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        
    } catch (error) {
        console.error('Error al cambiar rol:', error);
        
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cambiar tu rol. Por favor, inténtalo de nuevo más tarde.',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

function getImageUrl() {
  let image = user?.avatar;
  return image || '/images/default-avatar.png'; 
}

const handleResize = () => {
    if (window.innerWidth > 500 && mobileMenuActive.value) {
        mobileMenuActive.value = false;
        document.body.classList.remove('menu-open');
    }
};

const handleClickOutside = (event) => {
    const perfilMenu = document.querySelector('.perfil-container');
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (perfilMenu && !perfilMenu.contains(event.target) && perfilMenuActive.value) {
        perfilMenuActive.value = false;
    }
    
    if (mobileMenu && hamburgerMenu && !mobileMenu.contains(event.target) && !hamburgerMenu.contains(event.target) && mobileMenuActive.value) {
        mobileMenuActive.value = false;
        document.body.classList.remove('menu-open');
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', handleClickOutside);
    document.body.classList.remove('menu-open');
});
</script>

<style lang="scss" scoped>

.dropdown-menu {
    background-color: #1E1B4B !important;
    border: 1px solid #3b3770 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    padding: 10px 0 !important;
    min-width: 200px;
}

.dropdown-item .router-link-active  {
    color: white !important;
    padding: 10px 15px !important;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.dropdown-item:hover {
    background-color: #2d275a !important;
    color: #F472B6 !important;
}

.dropdown-divider {
    border-top: 1px solid #3b3770 !important;
    margin: 8px 0 !important;
}


.layout-topbar-button.nav-item.dropdown {
    position: relative;
}


.layout-topbar-button.nav-item.dropdown::after {
    display: none;
}


.dropdown-item:last-child {
    color: #F472B6 !important;
    border-top: 1px solid #3b3770;
    margin-top: 5px;
}

.dropdown-item:last-child:hover {
    color: #e04595 !important;
}


.dropdown-menu-end {
    right: 0;
    left: auto !important
}

.topbar-link.router-link-active {
    font-weight: bold;
}

.row {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  margin-left: calc(0* var(--bs-gutter-x)) !important;
}

.layout-topbar {
    height: 8vh;
    background-color: #1E1B4B;
    position: sticky;
    z-index: 999;
}

.layout-topbar img {
    height: 60px;
}

.layout-topbar-centro {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
    
    .buscador-container {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        max-width: 500px;
    }

    .layout-topbar-home-icon {
        width: 50px;
        margin-right: 10px;
    }

    .hamburger-menu {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 35px;
        height: 25px;
        margin-left: 10px;
    }
}

.layout-topbar-home-icon {
    width: 50px;
    padding-right: 5px;
}

.layout-topbar-centro input {
    height: 4vh;
    width: 500px;
    background-color: #100E28;
    border-bottom: 1px solid #F472B6;
    border-right: 1px solid #F472B6;
    border-radius: 13px;
    color: rgb(255, 215, 215);
}

.layout-topbar-centro input:focus {
    outline: none;
}

.layout-topbar-menu {
    margin: 0;
    align-items: center;
    justify-content: flex-end;
}

.topbar-link {
    color: #F472B6;
    padding-right: 20px;
    font-size: 1.2rem;
}
.topbar-link:hover {
    color: #e04595;
    transition: 0.3s;
}

.layout-topbar-button-c,
.layout-topbar-button-c:hover {
    width: auto;
    background-color: rgb(255, 255, 255, 0);
    border: 0;
    border-radius: 0%;
    padding: 1em;
}


.perfil-imagen-container {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #F472B6;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.perfil-imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Estilos para el menú hamburguesa */
.hamburger-menu {
    display: none !important;
    flex-direction: column;
    justify-content: space-between;
    min-width: 30px;
    height: 21px;
    cursor: pointer;
    z-index: 110;
    margin-left: 10px;
    width: 47px;
}

.hamburger-menu span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: #F472B6;
    border-radius: 3px;
    transition: all 0.3s ease;
}




/* Estilos para el menú móvil */
.mobile-menu {
    position: fixed;
    top: 0;
    right: -280px;
    width: 280px;
    height: 100vh;
    background-color: #1E1B4B;
    z-index: 1000;
    transition: right 0.3s ease;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
    display: none;
    flex-direction: column;
    overflow-y: auto;
}

.mobile-menu.active {
    right: 0;
}

.mobile-menu-header {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #3b3770;
    position: relative;
}

.perfil-imagen-container-mobile {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #F472B6;
    overflow: hidden;
    margin-right: 15px;
    flex-shrink: 0;
}

.perfil-imagen-container-mobile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.perfil-info {
    flex: 1;
    color: white;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.close-menu {
    color: #F472B6;
    font-size: 24px;
    cursor: pointer;
    padding: 0 10px;
}

.mobile-menu-links {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.mobile-link {
    color: white;
    text-decoration: none;
    padding: 15px 0;
    border-bottom: 1px solid #3b3770;
    font-size: 1.1rem;
}

.mobile-link:hover {
    color: #F472B6;
}

.mobile-link.logout {
    color: #F472B6;
    margin-top: 20px;
    border-top: 1px solid #3b3770;
    border-bottom: none;
}


@media screen and (max-width: 500px) {
    .layout-topbar-centro {
        justify-content: space-between;
        flex-grow: 1;

        .buscador-container {
            flex-grow: 1;
            margin: 0 10px;
        }

        .hamburger-menu {
            margin-left: 0;
            display: flex !important; 
        }
    }

    .layout-topbar-home-icon {
        padding: 0;
        margin: 0;
    }

    .layout-topbar {
        height: 60px;
        padding: 0 10px;
        justify-content: space-between;
    }
    
    .layout-topbar-logo {
        display: none;
    }
    
    .layout-topbar-menu {
        display: none;
    }
    
    .topbar-link, .layout-topbar-button-c {
        display: none;
    }
    
    .hamburger-menu {
        display: flex;
    }
    
    .mobile-menu {
        display: flex;
    }
    
    .layout-topbar-centro {
        flex: 1;
        justify-content: center;
    }
    
    :global(body.menu-open) {
        overflow: hidden;
    }

    .topbar-link {
        display: none;
    }

    .perfil-imagen-container {
        display: none;
    }


}
</style>

<style>
.dialog_diseño {
    background-color: #200834 !important;
    border: 1px solid purple !important;
    color: white !important;
    width: 450px;
}

@media screen and (max-width: 500px) {
    .dialog_diseño {
        width: 90% !important;
        max-width: 350px !important;
    }
}

.p-button {
    background-color: #A855F7 !important;
    border: none !important;
    color: white !important;
}

.boton_secundario{
    background-color: #3F3759 !important;
}

.mensaje_advertencia {
    border-left: 3px solid #F472B6;
    padding-left: 1rem;
}

.text-warning {
    color: #F472B6 !important;
    font-weight: bold !important;
}
</style>