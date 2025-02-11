<template>
    <div class="layout-topbar row">
        <router-link to="/app" class="layout-topbar-logo col-md-2">
            <img src="/images/logo.svg" alt="logo"/>
            <span></span>
        </router-link>

        <div class="layout-topbar-buscador col-md-5">
            <input type="text">
        </div>

        <div class="layout-topbar-menu col-md-5" :class="topbarMenuClasses">

            <router-link class="topbar-link" to="#">{{ $t('Biblioteca') }}</router-link>
            <router-link class="topbar-link" to="#">{{ $t('¡Conviertete en artista!') }}</router-link>
            <button class="p-link layout-topbar-button layout-topbar-button-c nav-item dropdown " role="button"
                data-bs-toggle="dropdown">

                <i class="pi pi-user"></i>
                <ul class="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                    <li>
                        <router-link :to="{ name: 'profile.index' }" class="dropdown-item">Perfil</router-link>
                    </li>
                    <li>
                        <a class="dropdown-item" href="#">Preferencias</a>
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
                        <a class="dropdown-item" :class="{ 'opacity-25': processing }" :disabled="processing" href="javascript:void(0)" @click="logout">Cerrar sessión</a>
                    </li>
                </ul>

                <span class="nav-link dropdown-toggle ms-3 me-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Hola, {{ authStore().user.name }}
                </span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLayout } from '../composables/layout';
import useAuth from "@/composables/auth";
import {  useRouter } from "vue-router";
import { authStore } from "../store/auth";

const { onMenuToggle } = useLayout();
const { processing, logout } = useAuth();
const topbarMenuActive = ref(false);
const router = useRouter();

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

</script>

<style lang="scss" scoped>

.layout-topbar {
    height: 8vh;
    background-color: #1E1B4B;
    
}

.layout-topbar img {
    height: 60px;
}

.layout-topbar-buscador {
    display: flex;
    justify-content: flex-end;
}

.layout-topbar-buscador input {
    height: 4vh;
    width: 500px;
    background-color: #100E28;
    border-bottom: 1px solid #F472B6;
    border-right: 1px solid #F472B6;
    border-radius: 13px;
    color: rgb(255, 215, 215);

}

.layout-topbar-buscador input:focus {
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

.layout-topbar-button-c,
.layout-topbar-button-c:hover {
    width: auto;
    background-color: rgb(255, 255, 255, 0);
    border: 0;
    border-radius: 0%;
    padding: 1em;
}
</style>
