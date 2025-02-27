<template>
    <div class="album-banner">
        <div class="detalles-album">
            <div class="album-banner-img">
                <img :src="getImageUrl(album)"/>
            </div>
            <div class="datos-detalles-album">
                <p> {{ album?.tipo }}</p>
                <h1>
                    {{ album?.nombre }}
                </h1>
                <span>
                    <router-link class="topbar-link" :key="album?.id_artista" :to="{ name: 'artista.perfil', params: {id: album?.id_artista} }">{{ album?.artista }}</router-link>

                    {{  new Date(album?.created_at).getFullYear() }}
                    <p>·</p>
                    {{ album?.num_canciones }} canciones
                    <p>·</p>
                    {{ album?.duracion_total }}
                </span>
            </div>
            <i :class="'pi pi-heart'" style="font-size: 2.4rem"></i>
        </div>
        <div class="album-banner-play">
            <svg viewBox="0 0 100 100">
                <!-- Definición del degradado -->
                <defs>
                    <linearGradient id="gradiente" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#F472B6" />
                    <stop offset="100%" stop-color="#A855F7" />
                    </linearGradient>
                </defs>
                
                <!-- Círculo de fondo con degradado -->
                <circle cx="50" cy="50" r="45" fill="url(#gradiente)" stroke="none"/>
                
                <!-- Triángulo de play blanco -->
                <path d="M35 25 L35 75 L75 50 Z" fill="white"/>
            </svg>
            <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                 Definición del degradado 
                <defs>
                    <linearGradient id="gradiente" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#F472B6" />
                    <stop offset="100%" stop-color="#A855F7" />
                    </linearGradient>
                </defs>
                
                 Círculo de fondo con degradado 
                <circle cx="50" cy="50" r="45" fill="url(#gradiente)" stroke="none"/>
                
                 Barras de pausa (dos rectángulos) 
                <rect x="35" y="30" width="10" height="40" fill="white" rx="2"/>
                <rect x="55" y="30" width="10" height="40" fill="white" rx="2"/>
            </svg> -->
        </div>
        
    </div>
        
    <div class="album-canciones-container">
        <div class="row album-canciones-categorias">
            <p class="col-md-1">#</p>
            <p class="col-md-5">Título</p>
            <p class="col-md-3">Reproducciones</p>
            <p class="col-md-2">Duración</p>
        </div>
        <div class="album-canciones-detalles">
            <div class="row cancion-album" v-for="(cancion, index) in canciones">
                <p class="col-md-1 num-cancion-album">{{ index + 1 }}</p> 
                <p class="col-md-5 cancion-album-nombre">{{ cancion.nombre }}</p>
                <p class="col-md-3 cancion-album-reproducciones">{{ cancion.reproducciones }}</p>
                <p class="col-md-2 duracion-cancion">{{ cancion.duracion }}</p>
                <span class="cancion-album-span">
                    <i class="pi pi-heart"></i>
                    <i class="pi pi-plus"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';


    const route = useRoute(); 
    const albumId = ref(route.params.id);
    const album = ref(null);
    const canciones = ref(null);


    onMounted(async () => {
        try {
            const response = await axios.get(`/api/album/${albumId.value}`);
            album.value = response.data.data; 
            
        } catch (error) {
            console.error('Error fetching album:', error);
        }

        try {
            const response = await axios.get(`/api/albumes/${albumId.value}/canciones`);
            canciones.value = response.data.data;
            console.log(canciones.value);
        } catch (error) {
            console.error('Error fetching canciones:', error);
        }
    });

    function getImageUrl(album) {
        let image

        image = album?.portada
        
        return new URL(image, import.meta.url).href
    }
    
</script>

<style scoped>
    .row {
        --bs-gutter-x: 1.5rem;
        --bs-gutter-y: 0;
        margin-right: calc(0* var(--bs-gutter-x)) !important; 
        margin-left: calc(0* var(--bs-gutter-x)) !important;
    }

    h2 {
        color: white;
        font-size: 2.3rem;
    }

    .album-banner {
        height: 180px;
        width: 90%;
        background: linear-gradient(to bottom, #4f226530, #2622653d);
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        color: white;
    }


    .detalles-album {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .album-banner-img {
        height: 150px;
        width: 150px;
        margin-left: 100px;
        box-shadow: 3px 1px 20px 0px rgb(44, 0, 73);
    }

    .album-banner-img img {
        width: 100%;
    }

    .datos-detalles-album span {
        display: flex;
        gap: 5px;
    }

    .pi-heart {        
        color: white;
    }

    .pi:hover {
        cursor: pointer;
    }

    .album-banner-play {
        height: 100px;
        width: 100px;
    }

    .album-banner-play:hover {
        cursor: pointer;
    }

    .pi-play {
        height: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 5rem;
    }

    .album-canciones-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .album-canciones-container p {
        margin: 0;
        padding-left: 35px;
    }

    .album-canciones-categorias {
        min-width: 85%;
        height: 60px;
        border-bottom: 1px solid black;
        display: flex;
        align-content: flex-end;
    }

    .album-canciones-categorias p {
        font-size: 1.3rem;
        color: rgba(255, 255, 255, 0.709);
    }

    .album-canciones-detalles {
        min-width: 85%;
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .cancion-album {
        min-height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        color: white;
        flex-wrap: nowrap; 
        background: linear-gradient(to right, #7e10e5, #da3bf6c5);
        border-radius: 15px;
        box-shadow: 3px 1px 20px 0px rgb(44, 0, 73);
    }

    .cancion-album p {
        margin-left: 5px;
    }

    .num-cancion-album {
        font-size: 1.5rem;
        margin: 0 !important;
        border-right: 2px solid rgba(48, 0, 54, 0.594);
    }

    .cancion-album-nombre {
        font-size: 1.3rem;
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
    }

    .cancion-album-reproducciones {
        padding-left: 70px !important;
    }
    .duracion-cancion {
        font-size: 1.2rem;
    }

    .cancion-album-span {
        width: 40px;
    }

    
</style>