<template>
    <ListaCanciones 
            v-if="cancionParaCompartir" 
            :cancion="cancionParaCompartir"
            @close="cancionParaCompartir = null"
        />
    <div class="showDialog"></div>
    <div class="lista-banner">
    <div class="detalles-lista">
        <div class="lista-banner-img">
            <img src="/images/imgLikes.jpg" alt="Fondo degradado con corazón blanco en el centro">
        </div>
        <div class="datos-detalles-lista">
            <h1>Mis Favoritos</h1>
        </div>
    </div>
    <div class="lista-banner-play" @click="toggleAlbumPlayback">
        <svg  v-if="!isPlaying" viewBox="0 0 100 100">
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
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
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
        </svg> 
    </div>

    </div>
       
    <div class="lista-canciones-container">
        <div class="row lista-canciones-categorias">
            <p class="col-md-1">#</p>
            <p class="col-md-5">Título</p>
            <p class="col-md-3">Reproducciones</p>
            <p class="col-md-2">Duración</p>
        </div>
        <div class="lista-canciones-detalles">
            <div class="row cancion-lista" v-for="(cancion, index) in cancionesFavoritasMostrar" :key="cancion.id"
            @click="reproducirCancion(cancion)">
                <div>
                    <p class="col-md-1 num-cancion-lista">{{ index + 1 }}</p> 
                    <p class="col-md-5 cancion-lista-nombre">{{ cancion.nombre }}</p>
                    <p class="col-md-3 cancion-lista-reproducciones">{{ cancion.reproducciones }}</p>
                    <p class="col-md-2 duracion-cancion">{{ cancion.duracion }}</p>
                    <span class="cancion-lista-span">
                        <i
                            :class="esFavoritaCancion(cancion.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                            @click="likeCancion(cancion.id, $event)"
                        ></i>
                        <i class="pi pi-plus" @click="mostrarListaCanciones(cancion)"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
   
    <Dialog class="crearLista-modal" v-model:visible="visible" modal header="Editar lista" appendTo=".showDialog">
        <form @submit.prevent="enviarFormulario">
            <div class="row">
                <div class="config-imagenes col-md-4">
                    <div class="imagen-crear-lista">
                        <img :src="PreviewImagenLista || getImageUrl(lista) || '/images/placeholder1.jpg'" class="estilo_imagen">
                        <input type="file" @change="manejarImagenLista" accept="image/*" ref="archivoImagen" class="añadir_archivo">  
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="flex items-center gap-4 mb-4">
                        <FloatLabel variant="on">
                            <InputText class="crearLista-input" id="username" v-model="nombreListaMod" />
                            <label for="username">Nombre de la lista</label>
                        </FloatLabel>
                    </div>
                    <div class="flex items-center gap-4 mb-8">
                        <FloatLabel variant="on">
                            <Textarea class="crearLista-input" id="config-descripcion" rows="5" cols="30" style="resize: none" v-model="descripcionListaMod" />
                            <label for="descripcion">Descripción</label>
                        </FloatLabel>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" id="cancelarButton" label="Guardar" @click="enviarFormulario"></Button>
                <Button 
                    type="button" 
                    id="eliminarButton" 
                    label="Eliminar Lista" 
                    severity="danger" 
                    @click="prepararEliminarLista" 
                ></Button>
            </div>
        </form>
    </Dialog>


</template>

<script setup>
    import { ref, reactive, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { authStore } from "@/store/auth.js";
    import { useLikeCancion } from "@/composables/likes.js";
    import ListaCanciones from '@/components/listaCanciones.vue'
    import { usePlayerStore } from "@/store/player";

    const cancionParaCompartir = ref(null)
    const PreviewImagenLista = ref(null);
    const visible = ref(false);
    const isHovered = ref(false);
    const userPropio = authStore().user;
    const player = usePlayerStore();
    const route = useRoute(); 
    const listaId = ref(route.params.id);
    const lista = ref(null);
    const nombreListaMod = ref('');
    const descripcionListaMod = ref('');
    const { cancionesFavoritas, cargarFavoritosCanciones, toggleLikeCancion, esFavoritaCancion, mostrarFavoritosCanciones, cancionesFavoritasMostrar } = useLikeCancion();
    const esFavoritoLista = ref(false);


    const likeCancion = async (idCancion, event) => {
        event.stopPropagation();
        await toggleLikeCancion(idCancion);
        await cargarFavoritosCanciones();
    };

    const isPlaying = computed(() => player.isPlaying);


    const toggleAlbumPlayback = () => {
        if (isPlaying.value && player.currentPlaylist === cancionesFavoritasMostrar.value) {
            player.togglePlay(); // Pausar si ya está reproduciendo este álbum
        } else {
            player.setPlaylist(cancionesFavoritasMostrar.value); // Cargar toda la lista de reproducción
            
            // Verificar que la primera canción no se sobreponga
            if (!player.currentSong || player.currentSong.id !== cancionesFavoritasMostrar.value[0].id) {
                player.playSong(cancionesFavoritasMostrar.value[0], 0); // Reproducir desde la primera canción solo si no está ya en reproducción
            }
        }
    };

    const reproducirCancion = (cancion) => {
        if (!cancionesFavoritasMostrar.value || cancionesFavoritasMostrar.value.length === 0) {
            console.error("Error: La lista de canciones no está disponible.");
            return;
        }

        const index = cancionesFavoritasMostrar.value.findIndex(c => c.id === cancion.id);
        if (index === -1) {
            console.error("Error: La canción no se encuentra en la lista.");
            return;
        }

        player.setPlaylist(cancionesFavoritasMostrar.value); // Asegura que todas las canciones del álbum están en la lista
        player.playSong(cancion, index, 'album', cancion.album_id);
    };


    const mostrarListaCanciones = (cancion) => {
        event.stopPropagation();
        cancionParaCompartir.value = cancion
    }

    onMounted(async () => {
        await cargarFavoritosCanciones();
        await mostrarFavoritosCanciones();
    });

    function getImageUrl(lista) {
        let image

        image = lista?.portada
        
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

    .lista-banner {
        height: 180px;
        width: 90%;
        background: linear-gradient(to bottom, #4f226530, #2622653d);
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        color: white;
    }


    .detalles-lista {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .lista-banner-img {
        height: 150px;
        width: 150px;
        margin-left: 100px;
        box-shadow: 3px 1px 20px 0px rgb(44, 0, 73);
    }

    .lista-banner-img img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
    }

    .datos-detalles-lista span {
        display: flex;
        gap: 5px;
        align-items: flex-end;
    }

    .datos-detalles-lista p {
        margin: 0 !important;
    }

    .banner-creador-nombre {
        font-size: 1.2rem;
        font-weight: bold;
        background: linear-gradient(to right, #F472B6, #A855F7);
        background-clip: text;
        color: transparent;
        padding-right: 5px;
    }

    .banner-creador-nombre:hover {
        text-decoration: underline !important;
        text-decoration-color: #F472B6 !important;
    }

    .pi-heart {        
        color: white;
    }

    .pi:hover {
        cursor: pointer;
    }

    .lista-banner-play {
        height: 100px;
        width: 100px;
    }

    .lista-banner-play:hover {
        cursor: pointer;
    }

    .pi-play {
        height: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 5rem;
    }

    .lista-descripcion {
        max-width: 700px;
    }

    .lista-canciones-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 50px;
    }

    .lista-canciones-container p {
        margin: 0;
        padding-left: 35px;
    }

    .lista-canciones-categorias {
        min-width: 85%;
        height: 60px;
        border-bottom: 1px solid black;
        display: flex;
        align-content: flex-end;
    }

    .lista-canciones-categorias p {
        font-size: 1.3rem;
        color: rgba(255, 255, 255, 0.709);
    }

    .lista-canciones-detalles {
        min-width: 85%;
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .cancion-lista {
        width: 103%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .cancion-lista div{
        min-height: 60px;
        width: 96%;
        display: flex;
        align-items: center;
        color: white;
        flex-wrap: nowrap; 
        background: linear-gradient(to right, #7e10e5, #da3bf6c5);
        border-radius: 15px;
        box-shadow: 3px 1px 20px 0px rgb(44, 0, 73);
    }

    .cancion-lista div:hover {
        background: linear-gradient(to right, #7e10e59e, #da3bf688);
    }

    .cancion-lista p {
        margin-left: 5px;
    }

    .num-cancion-lista {
        font-size: 1.5rem;
        margin: 0 !important;
        border-right: 2px solid rgba(48, 0, 54, 0.594);
    }

    .cancion-lista-nombre {
        font-size: 1.3rem;
        white-space: nowrap; 
        overflow: hidden; 
        text-overflow: ellipsis; 
    }

    .cancion-lista-reproducciones {
        padding-left: 70px !important;
    }

    .duracion-cancion {
        font-size: 1.2rem;
    }

    .cancion-lista-span {
        width: auto;
        display: flex;
        gap: 15px;
    }

    .cancion-lista-span .pi {
        font-size: 1.3rem;
    }

    .pi-times-circle {
        font-size: 1.2rem;
        color: #EF4444 !important;
        width: auto;
    }

    /* Estilos responsive para la vista de likes */
    @media (max-width: 500px) {
        .row {
            margin-right: 0 !important;
            margin-left: 0 !important;
            width: 100%;
            flex-direction: column;
        }

        /* Banner de la lista */
        .lista-banner {
            height: auto;
            padding: 20px 0;
            flex-direction: column;
            width: 100%; /* Ajustado para ocupar todo el ancho */
        }

        .detalles-lista {
            flex-direction: column;
            text-align: center;
            gap: 10px;
            width: 100%;
            position: relative;
            padding-bottom: 40px;
        }
        
        .lista-banner-img {
            margin-left: 0;
            height: 200px;
            width: 200px;
        }

        .datos-detalles-lista {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center; /* Centrado para esta vista */
            padding: 0 10px;
        }

        .datos-detalles-lista h1 {
            font-size: 1.5rem;
            margin: 5px 0;
        }

        .datos-detalles-lista span {
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }

        /* Botón de reproducción */
        .lista-banner-play {
            height: 70px;
            width: 70px;
            position: absolute;
            right: 15px;
            top: 250px;
            margin: 0;
            padding: 0;
        }

        /* Contenedor de canciones */
        .lista-canciones-container {
            padding: 0 10px 50px 10px;
            height: full;
        }

        .lista-canciones-container p {
            padding-left: 5px;
        }

        .lista-canciones-categorias {
            display: none;
        }

        .lista-canciones-detalles {
            min-width: 100%;
            gap: 10px;
        }

        /* Canciones de la lista */
        .cancion-lista {
            width: 100%; /* Ajustar al ancho completo */
            margin-right: 0 !important;
        }

        .cancion-lista div {
            width: 100%;
            min-height: 50px;
            padding: 8px 0;
            display: grid;
            grid-template-columns: 0.5fr 4fr 1fr 1fr 1fr;
        }

        .num-cancion-lista {
            font-size: 1.2rem;
            border-right: none;
            padding-left: 10px !important;
        }

        .cancion-lista-nombre {
            font-size: 1rem;
            padding-left: 8px !important;
        }

        .cancion-lista-reproducciones {
            font-size: 0.9rem;
            padding-left: 8px !important;
        }

        .duracion-cancion {
            font-size: 0.9rem;
            padding-left: 8px !important;
        }

        .cancion-lista-span {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            width: auto;
        }

        .cancion-lista-span i {
            font-size: 0.9rem;
        }

        /* Ajustes para el modal en móvil */
        .crearLista-modal {
            width: 90% !important;
            max-width: 480px !important;
        }

        #config-descripcion {
            width: 100%;
        }

        .config-imagenes {
            display: flex;
            justify-content: center;
            width: 100%;
            margin-bottom: 20px;
        }
    }

    /* Ajustes específicos para pantallas muy pequeñas */
    @media (max-width: 360px) {
        .cancion-lista div {
            grid-template-columns: 0.5fr 2fr 1fr 1fr 0.5fr;
        }
        
        .cancion-lista-nombre {
            font-size: 0.85rem;
        }
        
        .cancion-lista-reproducciones, .duracion-cancion {
            font-size: 0.8rem;
        }
        
        .cancion-lista-span i {
            font-size: 0.8rem;
        }

        .datos-detalles-lista h1 {
            font-size: 1.3rem;
        }
    }
</style>

<style>

   /* --- Modal --- */


    .crearLista-modal {
        background-color: #200834 !important;
        border: 1px solid purple !important;
        width: 550px !important;
        color: white !important;
    }

    .crearLista-input{
        background-color: #200834 !important;
        border: 1px solid #A855F7 !important;
        color: white !important;
    }

    #config-descripcion {
        height: 180px;
        width: 280px;
    }

    .crearLista-modal label {
        color: #F472B6 !important;
        background: transparent !important;
    }

    .crearLista-modal Button {
        background-color: #A855F7 !important;
        border: none !important;
        color: white !important;
    }

    .crearLista-imagene {
        display: flex;
        flex-direction: column;
    }

    .imagen-crear-lista{
        position: relative;
        width: 130px;
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

    #eliminarButton {
        background-color: #EF4444 !important;
    }

    #cancelarButton {
        background-color: #4B5563 !important;
    }

    .confirmarEliminacion {
        background-color: #200834 !important;
        border: 1px solid purple !important;
        color: white !important;
    }


</style>