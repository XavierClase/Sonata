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
                <img :src="getImageUrl(lista)"/>
            </div>
            <div class="datos-detalles-lista">
                <p> {{ lista?.tipo }}</p>
                <h1>
                    {{ lista?.nombre }}
                </h1>
                <span>
                    <router-link  class="banner-creador-nombre" :key="lista?.id_creador"   :to="{ 
                name: user?.roles?.[0]?.name.toLowerCase() === 'artista' ? 'artista.perfil' : 'app.perfil', 
                params: {id: lista?.id_creador} }">{{ lista?.creador }}
                </router-link>

                    
                    <p>{{  new Date(lista?.created_at).getFullYear() }}</p>
                    <p>·</p>
                    <p>{{ lista?.num_canciones }} canciones</p>
                    <p>·</p>
                    <p>{{ lista?.duracion_total }}</p>
                </span>
                <p class="lista-descripcion">{{ lista?.descripcion }}</p>
            </div>
            <i
                v-if="userPropio?.name !== lista?.creador"
                :class="esFavoritoLista ? 'pi pi-heart-fill' : 'pi pi-heart'" 
                style="font-size: 2.4rem; cursor: pointer"
                @click="likeLista(lista?.id, $event)"
            ></i>
            <i 
                :class="{'pi pi-cog': true, 'pi-spin': isHovered}" 
                style="font-size: 2rem"
                @mouseover="isHovered = true"
                @mouseleave="isHovered = false"
                v-if="userPropio?.name === lista?.creador" 
                @click="visible = true"
            ></i>
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
            <div class="row cancion-lista" v-for="(cancion, index) in canciones" :key="cancion.id"
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
                
                <i 
                    v-if="userPropio?.name === lista?.creador" 
                    class="pi pi-times-circle" 
                    style="cursor: pointer; color: red;" 
                    @click="eliminarCancionDeLista(cancion.id, $event)"
                ></i>

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
                <Button type="button" label="Guardar" @click="enviarFormulario"></Button>
                <Button type="button" label="Eliminar Lista" severity="danger" @click="eliminarLista"></Button>
            </div>
        </form>
    </Dialog>

</template>

<script setup>
    import { ref, reactive, onMounted, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import { authStore } from "@/store/auth.js";
    import { useLikeLista, useLikeCancion } from "@/composables/likes.js";
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
    const canciones = ref(null);
    const nombreListaMod = ref('');
    const descripcionListaMod = ref('');
    const { favoritos, toggleLike, esFavorito } = useLikeLista();
    const { cancionesFavoritas, cargarFavoritosCanciones, toggleLikeCancion, esFavoritaCancion } = useLikeCancion();
    const esFavoritoLista = ref(false);

    const likeLista = async (idLista, event) => {
        event.stopPropagation();
        await toggleLike(idLista);
        esFavoritoLista.value = !esFavoritoLista.value; // Cambia el estado manualmente
    };

    const likeCancion = async (idCancion, event) => {
        event.stopPropagation();
        await toggleLikeCancion(idCancion);
        await cargarFavoritosCanciones();
    };

    const isPlaying = computed(() => player.isPlaying);


    const toggleAlbumPlayback = () => {
        if (isPlaying.value && player.currentPlaylist === canciones.value) {
            player.togglePlay(); // Pausar si ya está reproduciendo este álbum
        } else {
            player.setPlaylist(canciones.value); // Cargar toda la lista de reproducción
            
            // Verificar que la primera canción no se sobreponga
            if (!player.currentSong || player.currentSong.id !== canciones.value[0].id) {
                player.playSong(canciones.value[0], 0); // Reproducir desde la primera canción solo si no está ya en reproducción
            }
        }
    };

    const reproducirCancion = (cancion) => {
        const index = canciones.value.findIndex(c => c.id === cancion.id);
        player.setPlaylist(canciones.value); // Asegura que todas las canciones del álbum están en la lista
        player.playSong(cancion, index);
    };

    const mostrarListaCanciones = (cancion) => {
        event.stopPropagation();
        cancionParaCompartir.value = cancion
    }

    onMounted(async () => {
        try {
            const response = await axios.get(`/api/lista/${listaId.value}`);
            lista.value = response.data.data; 
            nombreListaMod.value = lista.value.nombre; 
            descripcionListaMod.value = lista.value.descripcion; 
        } catch (error) {
            console.error('Error encontrando la lista:', error);
        }

        esFavoritoLista.value = await esFavorito(listaId.value);

         try {
             const response = await axios.get(`/api/listas/${listaId.value}/canciones`);
             canciones.value = response.data.data;
             console.log(canciones.value);
        } catch (error) {
             console.error('Error encontrando las canciones:', error);
        }

        await cargarFavoritosCanciones();

    });

    function getImageUrl(lista) {
        let image

        image = lista?.portada
        
        return new URL(image, import.meta.url).href
    }
    
    const nuevaImagenLista = reactive({ portada: null });

    const manejarImagenLista = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (PreviewImagenLista.value) {
                URL.revokeObjectURL(PreviewImagenLista.value);
            }
            nuevaImagenLista.portada = file;  
            PreviewImagenLista.value = URL.createObjectURL(file);
        }
    };

    const enviarFormulario = async () => {
        try {
            await axios.post(`/api/listas/update/${listaId.value}`, {
                nombre: nombreListaMod.value,
                descripcion: descripcionListaMod.value
            });

            if (nuevaImagenLista.portada) {
                let formData = new FormData();
                formData.append('idLista', listaId.value);
                formData.append('portada', nuevaImagenLista.portada);

                await axios.post('/api/listas/updateimg', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            lista.value.nombre = nombreListaMod.value;
            lista.value.descripcion = descripcionListaMod.value;
            if (nuevaImagenLista.portada) {
                lista.value.portada = URL.createObjectURL(nuevaImagenLista.portada);
            }

            visible.value = false;
            console.log("Lista actualizada correctamente");
        } catch (error) {
            console.error("Error al actualizar la lista:", error);
        }
    };

    const eliminarLista = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta lista?")) return;

        try {
            await axios.delete(`/api/listas/del/${listaId.value}`);
            alert("Lista eliminada correctamente");

            visible.value = false; // Cerrar modal
            // Aquí puedes redirigir o actualizar la lista en la UI
        } catch (error) {
            console.error("Error al eliminar la lista:", error);
            alert("Error al eliminar la lista");
        }
    };

    const eliminarCancionDeLista = async (cancionId, event) => {
        event.stopPropagation(); // Evita que se active la reproducción al hacer clic en eliminar

        if (!confirm("¿Seguro que quieres eliminar esta canción de la lista?")) return;

        try {
            await axios.delete(`/api/listas/${listaId.value}/cancion/${cancionId}`);
            canciones.value = canciones.value.filter(c => c.id !== cancionId); // Actualiza la lista localmente

            alert("Canción eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar la canción:", error);
            alert("No se pudo eliminar la canción");
        }
    };


    
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
        color: rgb(251, 1, 1);
        width: auto;
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
</style>