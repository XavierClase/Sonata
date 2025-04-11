<template>
      <ListaCanciones 
                v-if="cancionParaCompartir" 
                :cancion="cancionParaCompartir"
                @close="cancionParaCompartir = null"
            />
    <div class="showDialog"></div>
    <div class="perfil-artista-banner">
        <span>
            <div class="perfil-artista-banner-img">
                <img :src="getImageUrl(user?.avatar)" />
            </div>
            <h1>
                {{ user?.name }}
            </h1>
        </span>
        <i 
            :class="{'pi pi-cog': true, 'pi-spin': isHovered}" 
            style="font-size: 2rem"
            @mouseover="isHovered = true"
            @mouseleave="isHovered = false"
            v-if="userPropio?.name === user?.name" 
            @click="visible = true"
        ></i>
    </div>

    <i class="pi pi-share-alt"></i>

    <div class="row perfil-artista-medio">
        <div class="col-md-7 perfil-artista-medio-populares">
            <h2>Canciones populares</h2>    
            <div class="canciones-populares">
                <div v-for="(cancion, index) in populares" :key="cancion.id" 
                     class="cancion-popular" 
                     @click="reproducirCancion(cancion)">
                    <span class="cancion-popular-span1 col-md-2">
                        <p class="num-cancion-popular">{{ index + 1 }}</p> 
                        <img :src="getImageUrl(cancion.portada)" />
                    </span>
                    <span class="cancion-popular-span2 col-md-5">
                        <p class="cancion-popular-nombre">{{ cancion.nombre }}</p>
                        <p class="cancion-popular-reproducciones">{{ cancion.reproducciones }} reproducciones</p>
                    </span>
                    <p class="col-md-2 duracion-cancion">{{ cancion.duracion }}</p>
                    <i
                        :class="esFavoritaCancion(cancion.id) ? 'pi pi-heart-fill col-md-1' : 'pi pi-heart col-md-1'"
                        @click="likeCancion(cancion.id, $event)"
                        title="Añadir la canción a favoritos"
                    ></i>
                    <i class="pi pi-plus col-md-1"  @click="mostrarListaCanciones(cancion)" title="Añadir la canción a una lista"></i>
                </div>
            </div>
        </div>

        <div class="col-md-5 perfil-artista-medio-detalles">
            <h2>Detalles</h2>
            <div class="detalles-contenido">
                <div class="detalles-img">
                    <img :src="getImageUrl(user?.fotoDetalles)" alt="Imagen de detalles del usuario artista">
                </div>
                <div class="detalles-descripcion">
                    <p> {{ user?.descripcion }} </p>
                </div>
            </div>
        </div>
    </div>

    <div class="perfil-artista-albums">
        <h2>Álbumes</h2>
        <div class="row gap-4">
            <router-link 
                class="album col-md-2" 
                v-for="album in albumes" 
                :key="album.id" 
                :to="{ name: 'app.album', params: {id: album.id} }"
            >
                <div class="album-img">
                    <img :src="getImageUrl(album.portada)" />
                </div>
                <div class="album-detalles">
                    <h4>{{ album.nombre }}</h4>
                    <p>Año: {{  new Date(album.created_at).getFullYear() }}</p>
                    <p>Duración: {{ album.duracion_total }}</p>
                    <p>Número de canciones: {{ album.num_canciones }}</p>
                </div>
            </router-link>
        </div>
    </div>

    <Dialog class="banner-config-modal" v-model:visible="visible" modal header="Modificar Perfil" appendTo=".showDialog">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Actualiza tu información.</span>
        <div class="row">
            <div class="config-imagenes col-md-6">
                <!-- Imagen de perfil -->
                <div class="imagen-config-perfil">
                    <img :src="PreviewImagenPerfil || getImageUrl(user?.avatar)" class="estilo_imagen">
                    <input type="file" @change="(event) => manejarImagen(event, 'perfil')" accept="image/*" class="añadir_archivo">  
                </div>
                <!-- Imagen de detalles -->
                <div class="imagen-config-detalles">
                    <img :src="PreviewImagenDetalles || getImageUrl(user?.fotoDetalles)" class="estilo_imagen">
                    <input type="file" @change="(event) => manejarImagen(event, 'detalles')" accept="image/*" class="añadir_archivo">  
                </div>
            </div>
            <div class="col-md-6">
                <div class="flex items-center gap-4 mb-4">
                    <FloatLabel variant="on">
                        <InputText class="banner-config-input" id="username" v-model="nombreUsuarioMod" />
                        <label for="username">Nombre de Usuario</label>
                    </FloatLabel>
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <FloatLabel variant="on">
                        <Textarea class="banner-config-input" id="config-descripcion" rows="5" cols="30" style="resize: none" maxlength="185" v-model="descripcionUsuarioMod"/>
                        <label for="descripcion">Descripción</label>
                    </FloatLabel>
                </div>
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Guardar" @click="guardarCambios"></Button>
        </div>
    </Dialog>
</template>


<script setup> 
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { authStore } from "@/store/auth.js";
import { useLikeCancion } from "@/composables/likes.js";
import { usePlayer } from "@/composables/usePlayer.js"; 
import { mostrarMusica } from "@/composables/mostrarMusica.js";
import { datosUser, useEditarUsuario } from "@/composables/datosUser.js";
import ListaCanciones from '@/components/listaCanciones.vue';

const { isPlaying, playPlaylist, playSong, togglePlay } = usePlayer();

const cancionParaCompartir = ref(null);
const visible = ref(false);
const isHovered = ref(false);

const userPropio = authStore().user;
const route = useRoute(); 
const userId = ref(route.params.id);

// Datos de música y usuario
const { populares, getPopulares, albumes, getAlbumesUser } = mostrarMusica(userId);
const { user, getUser } = datosUser(userId);

// Composable para edición de usuario
const { 
    PreviewImagenPerfil, 
    PreviewImagenDetalles,
    nombreUsuarioMod, 
    descripcionUsuarioMod,
    manejarImagen, 
    guardarCambios,
    fetchUserData
} = useEditarUsuario(user, userId, visible);

// Likes
const { cancionesFavoritas, cargarFavoritosCanciones, toggleLikeCancion, esFavoritaCancion } = useLikeCancion();

const reproducirCancion = (cancion) => {
    playSong(cancion, populares.value, 'album', cancion.album_id);
};

const mostrarListaCanciones = (cancion) => {
    event.stopPropagation();
    cancionParaCompartir.value = cancion;
};

const likeCancion = async (idCancion, event) => {
    event.stopPropagation();
    await toggleLikeCancion(idCancion);
    await cargarFavoritosCanciones();
};

const getImageUrl = (path) => {
    return path ? new URL(path, import.meta.url).href : '/images/placeholder1.jpg';
};

onMounted(async () => {
    await getUser();
    await getPopulares();
    await getAlbumesUser();
    await cargarFavoritosCanciones();

    nombreUsuarioMod.value = user.value?.name || '';  
    descripcionUsuarioMod.value = user.value?.descripcion || '';
});
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
        margin-left: 100px;
        position: relative;
        overflow: hidden;
    }

    .perfil-artista-banner-img img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .pi-cog {
        position: absolute;
        top: 0;
        right: 0;
        color: white;
        margin: 20px;
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
        justify-content: flex-start; 
        gap: 20px;
    }

    .cancion-popular {
        min-height: 50px;
        display: flex;
        align-items: center;
        color: white;
        flex-wrap: nowrap;
        border-radius: 10px;
    }

    .cancion-popular:hover {
        background-color: #8141b63e;
    }

    .cancion-popular p {
        margin: 0;
        padding: 0;
    }

    .cancion-popular-span1 {
        padding-left: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 20px;
    }

    .cancion-popular img {
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
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
    }

    .cancion-popular-reproducciones {
        font-size: 0.9rem;
        color: rgb(171, 171, 171);
    }

    .duracion-cancion {
        font-size: 1.2rem;
    }

    .pi-heart, .pi-heart-fill {
        font-size: 1.5rem;
        z-index: 99;
    }

    .pi-plus {
        font-size: 1.5rem;
    }

    .detalles-contenido {
        background-color: rgba(0, 0, 0, 0.511);
        height: 350px;
        width: 470px;
        display: flex;
        flex-direction: column;
        box-shadow: 1px 1px 11px 0px rgba(0, 0, 0, 0.438);
    }

    .detalles-img {
        flex: 4;
        width:  100%;
        position: relative;
        overflow: hidden;
    }
    
    .detalles-img img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        object-fit: cover;
    }

    .detalles-descripcion {
        padding: 5px;
        flex: 1;
        color: white;
        overflow: hidden;          
        text-overflow: ellipsis;   
        white-space: normal;       
        word-wrap: break-word;    
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
        height: 380px;
        background-color: #721cc2;
    }

    .album div {
        height: 125px;
        margin-top: 10px;
    }

    .album-img {
        width:  100%;
        position: relative;
        padding-top: 100%; 
        overflow: hidden;
        margin-bottom: 10px;
    }
    
    .album-img img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .album-detalles {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 5px;
    }

    .album-detalles h4 {
        background: linear-gradient(to right, #F472B6, #A855F7);
        background-clip: text;
        color: transparent;
        font-weight: bold;
        max-height: 70px;
    }


    .album-detalles p {
        margin: 0;
        line-height: 1;
        color: white;
    }

    /* Estilos responsivos para pantallas de 500px o menos */
    @media (width < 500px) {
        /* Ajustes generales */
        .row {
            margin-right: 0 !important;
            margin-left: 0 !important;
            width: 100%;
            flex-direction: column;
        }

        /* Banner del perfil */
        .perfil-artista-banner {
            height: auto;
            padding: 15px 0;
            flex-direction: column;
            text-align: center;
        }

        .perfil-artista-banner span {
            flex-direction: column;
            width: 100%;
            gap: 10px;
        }

        .perfil-artista-banner-img {
            margin-left: 0;
            height: 130px;
            width: 130px;
        }

        .pi-cog {
            position: absolute;
            top: 10px;
            right: 10px;
            margin: 0;
        }

        /* Icono de compartir */
        .pi-share-alt {
            position: absolute;
            top: 40px;
        }

        /* Sección media */
        .perfil-artista-medio > div {
            height: auto;
            width: 100%;
        }

        .perfil-artista-medio-populares,
        .perfil-artista-albums {
            padding-top: 30px;
            padding-left: 15px;
            padding-right: 15px;
        }

        .perfil-artista-medio-detalles {
            margin-top: 30px;
        }

        .canciones-populares {
            height: auto;
            width: 100%;
            margin: 0;
            padding: 0;
        }

        /* Canciones populares */
        .cancion-popular {
            flex-wrap: wrap;
            padding: 10px 0;
            width: 100%;
        }

        .cancion-popular-span1 {
            width: 20%;
            padding-left: 5px;
            gap: 10px;
        }

        .num-cancion-popular {
            display: none;
        }

        .cancion-popular-span2 {
            width: 45%;
        }

        .duracion-cancion {
            width: 15%;
            text-align: right;
            padding-right: 5px;
        }

        .pi-heart, .pi-heart-fill, .pi-plus {
            margin-top: 10px;
            width: 10%;
            text-align: center;
        }

        /* Detalles */
        .detalles-contenido {
            width: 100%;
            height: auto;
            max-height: 350px;
        }

        .detalles-img {
            flex: none;
            height: 200px;
        }

        /* Álbums */
        .perfil-artista-albums {
            margin-top: 30px;
        }

        .perfil-artista-albums .row {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px !important;
            margin: 0 !important; 
            width: 100%;
            max-width: 100vw; 
            overflow-x: hidden; 
        }

        .album {
            width: 60vw;
            height: 420px;
            margin-bottom: 15px;
        }

        /* Modal configuración */
        .banner-config-modal {
            width: 90% !important;
            height: auto !important;
        }

        .config-imagenes {
            width: 100%;
            align-items: center;
            margin-bottom: 20px;
        }

        .banner-config-input, #config-descripcion {
            width: 100% !important;
        }
    }

/* Ajustes específicos para pantallas muy pequeñas */
@media (max-width: 360px) {
    .album {
        width: 100%;
    }
    
    .cancion-popular-nombre {
        font-size: 1rem;
    }
    
    .cancion-popular-reproducciones {
        font-size: 0.8rem;
    }
    
    .duracion-cancion {
        font-size: 1rem;
    }
}

</style>


<style>

    /* --- Modal --- */

    
    .banner-config-modal {
        background-color: #200834 !important;
        border: 1px solid purple !important;
        width: 700px !important;
         height: 520px !important; 
        color: white !important;
    }

    .banner-config-input{
        background-color: #200834 !important;
        border: 1px solid #A855F7 !important;
        color: white !important;
    }

    #config-descripcion {
        height: 150px;
        width: 280px;
    }

    .banner-config-modal label {
        color: #F472B6 !important;
        background: transparent !important;
    }

    .banner-config-modal Button {
        background-color: #A855F7 !important;
        border: none !important;
        color: white !important;
    }

    .config-imagenes {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .imagen-config-perfil{
        position: relative;
        width: 130px;
        height: 130px;
        border: 2px dashed #f472b5;
        overflow: hidden;
        flex-shrink: 0;
    }

    .imagen-config-detalles {
        position: relative;
        width: 200px;
        height: 130px;
        border: 2px dashed #f472b5;
        overflow: hidden;
        flex-shrink: 0;
    }

    .estilo_imagen {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
    }

    .añadir_archivo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }
</style>