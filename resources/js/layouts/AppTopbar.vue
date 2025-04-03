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
            
            <Buscador />
        </div>

        <div class="layout-topbar-menu col-md-4" :class="topbarMenuClasses">
            <router-link class="topbar-link" :to=" { name: 'app.biblioteca' }">{{ $t('Biblioteca') }}</router-link>
            <a v-if="userRole === 'user'" class="topbar-link" href="#" @click="mostrarDialogArtista">{{ $t('¡Conviertete en artista!') }}</a>
            <router-link v-if="userRole === 'artista'" class="topbar-link" to="/app/artista/estadisticas">{{ $t('Panel de artista!') }}</router-link>
            <button class="p-link layout-topbar-button layout-topbar-button-c nav-item dropdown " role="button"
                data-bs-toggle="dropdown">
                <div class="perfil-imagen-container">
                    <img :src="getImageUrl()" alt="Perfil" class="perfil-imagen" />
                </div>
                <ul class="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                    <li>
                        <a class="dropdown-item" :key="user?.id" @click="router.push({ name: 'artista.perfil' })">{{ $t('Perfil') }}</a>
                    </li>
                    <li v-if="true">
                        <a class="dropdown-item" href="#" @click="router.push({ name: 'admin.index' })">Panel Admin</a>
                    </li>
                    <li v-if="true">
                        <a class="dropdown-item" href="#" @click="router.push({ name: 'app' })">Panel Usuario</a>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li>
                        <a class="dropdown-item" :class="{ 'opacity-25': processing }" :disabled="processing" href="javascript:void(0)" @click="logout">Cerrar sesión</a>
                    </li>
                </ul>

                <span class="nav-link dropdown-toggle ms-3 me-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Hola, {{ authStore().user.name }}
                </span>
            </button>
                <router-link 
                class="topbar-link" 
                :key="user?.id" 
                :to="{ 
                name: user?.roles?.[0]?.name.toLowerCase() === 'artista' ? 'artista.perfil' : 'app.perfil', 
                params: {id: user?.id} 
                }">
                {{ $t('Perfil!') }}
                </router-link>
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
import { ref, computed, onMounted} from 'vue';
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
const router = useRouter();
const dialogArtistaVisible = ref(false);

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const userRole = computed(() => {
    return authStore().user?.roles?.length > 0 ? authStore().user.roles[0].name : '';
});

const mostrarDialogArtista = () => {
    dialogArtistaVisible.value = true;
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
  return image;
}

</script>

<style lang="scss" scoped>

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
}

.layout-topbar img {
    height: 60px;
}

.layout-topbar-centro {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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


</style>
<style >


.dialog_diseño {
    background-color: #200834 !important;
    border: 1px solid purple !important;
    color: white !important;
    width: 450px;
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