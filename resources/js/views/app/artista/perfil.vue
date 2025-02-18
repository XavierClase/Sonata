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

    <i class="pi pi-share-alt"></i>

    <div class="row perfil-artista-medio">

        <div class="col-md-7 perfil-artista-medio-populares">
            <h2>Canciones populares</h2>    
            <div class="canciones-populares">
                <div class="row cancion-popular">
                    <span class="cancion-popular-span1 col-md-2">
                        <p class="num-cancion-popular">1</p>
                        <img src="" alt="imagen de portada del álbum de la cancion">
                    </span>
                    <span class="cancion-popular-span2 col-md-5">
                        <p class="cancion-popular-nombre">nombre</p>
                        <p class="cancion-popular-reproducciones">2 reproducciones</p>
                    </span>
                    <p class="col-md-2 duracion-cancion">3:20</p>
                    <i class="pi pi-heart col-md-1"></i>
                    <i class="pi pi-plus col-md-1"></i>
                </div>

                <div class="row cancion-popular">
                    <span class="cancion-popular-span1 col-md-2">
                        <p class="num-cancion-popular">1</p>
                        <img src="" alt="imagen de portada del álbum de la cancion">
                    </span>
                    <span class="cancion-popular-span2 col-md-5">
                        <p class="cancion-popular-nombre">nombre</p>
                        <p class="cancion-popular-reproducciones">2 reproducciones</p>
                    </span>
                    <p class="col-md-2 duracion-cancion">3:20</p>
                    <i class="pi pi-heart col-md-1"></i>
                    <i class="pi pi-plus col-md-1"></i>
                </div>

                <div class="row cancion-popular">
                    <span class="cancion-popular-span1 col-md-2">
                        <p class="num-cancion-popular">1</p>
                        <img src="" alt="imagen de portada del álbum de la cancion">
                    </span>
                    <span class="cancion-popular-span2 col-md-5">
                        <p class="cancion-popular-nombre">nombre</p>
                        <p class="cancion-popular-reproducciones">2 reproducciones</p>
                    </span>
                    <p class="col-md-2 duracion-cancion">3:20</p>
                    <i class="pi pi-heart col-md-1"></i>
                    <i class="pi pi-plus col-md-1"></i>
                </div>

                <div class="row cancion-popular">
                    <span class="cancion-popular-span1 col-md-2">
                        <p class="num-cancion-popular">1</p>
                        <img src="" alt="imagen de portada del álbum de la cancion">
                    </span>
                    <span class="cancion-popular-span2 col-md-5">
                        <p class="cancion-popular-nombre">nombre</p>
                        <p class="cancion-popular-reproducciones">2 reproducciones</p>
                    </span>
                    <p class="col-md-2 duracion-cancion">3:20</p>
                    <i class="pi pi-heart col-md-1"></i>
                    <i class="pi pi-plus col-md-1"></i>
                </div>

                <div class="row cancion-popular">
                    <span class="cancion-popular-span1 col-md-2">
                        <p class="num-cancion-popular">1</p>
                        <img src="" alt="imagen de portada del álbum de la cancion">
                    </span>
                    <span class="cancion-popular-span2 col-md-5">
                        <p class="cancion-popular-nombre">nombre</p>
                        <p class="cancion-popular-reproducciones">2 reproducciones</p>
                    </span>
                    <p class="col-md-2 duracion-cancion">3:20</p>
                    <i class="pi pi-heart col-md-1"></i>
                    <i class="pi pi-plus col-md-1"></i>
                </div>
            </div>
            
        </div>

        <div class="col-md-5 perfil-artista-medio-detalles">
            <h2>Detalles</h2>
            <div>
                 
            </div>
        </div>
    </div>


    <div class="perfil-artista-albums">
        <h2>Álbums</h2>
        <div class="row gap-4">
            <div class="album col-md-2">
                <div class="album-img">
                    <img src="" alt="">
                </div>
                <div class="album-detalles">
                    <h4>Nombre</h4>
                    <p>Año</p>
                    <p>Duración</p>
                    <p>num canciones</p>
                    <p>reproducciones</p>
                </div>
            </div>
            <div class="album col-md-2">
                <div class="album-img">
                    <img src="" alt="">
                </div>
                <div class="album-detalles">
                    <h4>Nombre</h4>
                    <p>Año</p>
                    <p>Duración</p>
                    <p>num canciones</p>
                    <p>reproducciones</p>
                </div>
            </div>
            <div class="album col-md-2">
                <div class="album-img">
                    <img src="" alt="">
                </div>
                <div class="album-detalles">
                    <h4>Nombre</h4>
                    <p>Año</p>
                    <p>Duración</p>
                    <p>num canciones</p>
                    <p>reproducciones</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { authStore } from "@/store/auth.js";
    import { ref } from "vue";

    const isHovered = ref(false);

    const user = authStore().user;
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

    .perfil-artista-banner {
        height: 180px;
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
        margin-left: 100px;
    }

    .pi-cog {
        position: absolute;
        top: 0;
        right: 0;
        color: white;
        margin: 13px;
    }

    .pi:hover {
        cursor: pointer;
    }


    .pi-share-alt {
        color: white;
        font-size: 2rem;
        padding: 35px;
    }


    .perfil-artista-medio > div {
        height: 400px;
    }

    .perfil-artista-medio-populares {
        padding-left: 33px;
        display: flex;
        flex-direction: column;
        
    }

    .canciones-populares {
        height: 330px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .cancion-popular {
        min-height: 50px;
        display: flex;
        align-items: center;
        color:white;
    }
    .cancion-popular p {
        margin: 0;
        padding: 0;
    }


    .cancion-popular-span1 {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 20px;
    }

    .cancion-popular img {
        border: 1px solid black;
        min-height: 50px;
        max-height: 50px;

        min-width: 50px;
        max-width: 50px;
    }

    .cancion-popular-span2{
        max-height: 50px;
        min-height: 50px;
        display: flex;
        flex-direction: column;
    }

    

    .cancion-popular-nombre {
        font-size: 1.3rem;
    }

    .cancion-popular-reproducciones {
        font-size: 0.9rem;
        color: rgb(171, 171, 171);
    }

    .duracion-cancion {
        font-size: 1.2rem;
    }

    .pi-heart {
        font-size: 1.5rem;
    }

    .pi-plus {
        font-size: 1.5rem;
    }
    

    .perfil-artista-medio-detalles div {
        height: 330px;
        width: 500px;
        border: 1px solid black;
    }

    .perfil-artista-albums {
        margin-top: 20px;
        padding-left: 33px;
        padding-bottom: 40px;
    }

    .perfil-artista-albums > div {
        display: flex;
        flex-wrap: wrap;
    }

    .album {
        height: 270px;
        background-color: #721cc2;
    }

    .album div {
        height: 125px;
        margin-top: 10px;
    }

    .album-img {
        border: 1px solid black;
        background-color: black;
    }

    .album-detalles {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .album-detalles h4 {
        color: white;
    }

    .album-detalles p {
        margin: 0;
        line-height: 1;
        color: white;
    }



</style>