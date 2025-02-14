<template>
    <div class="perfil-artista-banner">
        <span>
            <div class="perfil-artista-banner-img">
                <img src="" alt="">
            </div>
            <h1>
                {{ user?.name }}
            </h1>
        </span>
        <router-link to="/perfil/editar" style="font-size: 2rem">
            <i 
                :class="{'pi pi-cog': true, 'pi-spin': isHovered}" 
                style="font-size: 2rem"
                @mouseover="isHovered = true"
                @mouseleave="isHovered = false"
            ></i>
        </router-link>
        
    </div>

    <div class="perfil-artista-medio">
        .perfil-artista-canciones-populares
    </div>

    <div class="perfil-artista-albums">
        
    </div>
</template>

<script setup>
    import { authStore } from "@/store/auth.js";
    import { ref } from "vue";

    const isHovered = ref(false);

    const user = authStore().user;
</script>

<style scoped>
    .perfil-artista-banner {
        height: 230px;
        width: 100%;
        background-color: #200834;
        display: flex;
        align-items: center;
        position: relative;
        color: white;
    }

    .perfil-artista-banner span {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .perfil-artista-banner-img {
        height: 130px;
        width: 130px;
        border: 1px solid black;
        border-radius: 200px;
        margin-left: 100px;
    }

    .pi {
        position: absolute;
        top: 0;
        right: 0;
        color: white;
        margin: 13px;
    }

    .pi:hover {
        cursor: pointer;
    }


</style>