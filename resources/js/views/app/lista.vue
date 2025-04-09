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
                id="iconoBanner"
                v-if="userPropio?.name !== lista?.creador"
                :class="esFavoritoLista ? 'pi pi-heart-fill' : 'pi pi-heart'"
                @click="likeLista(lista?.id, $event)"
            ></i>
            <i 
                :class="{'pi pi-cog': true, 'pi-spin': isHovered}" 
                id="iconoBanner"
                @mouseover="isHovered = true"
                @mouseleave="isHovered = false"
                v-if="userPropio?.name === lista?.creador" 
                @click="visible = true"
            ></i>
        </div>
        <div class="lista-banner-play" @click="toggleListaPlayback">
            <svg  v-if="!isPlaying" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="gradiente" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#F472B6" />
                    <stop offset="100%" stop-color="#A855F7" />
                    </linearGradient>
                </defs>
                
                <circle cx="50" cy="50" r="45" fill="url(#gradiente)" stroke="none"/>
                
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
                            title="Añadir la canción a favoritos"
                        ></i>
                        <i class="pi pi-plus" @click="mostrarListaCanciones(cancion)" title="Añadir la canción a una lista"></i>
                    </span>
                </div>
                
                <i 
                    v-if="userPropio?.name === lista?.creador" 
                    class="pi pi-times-circle" 
                    style="cursor: pointer;" 
                    @click="prepararEliminarCancion(cancion)"
                    title="Eliminar canción de la lista"
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
                <Button type="button" id="cancelarButton" label="Guardar" @click="enviarFormulario"></Button>
                <Button 
                    type="button" 
                    id="eliminarButton" 
                    label="Eliminar" 
                    severity="danger" 
                    @click="prepararEliminarLista"
                    title="Eliminar la lista permanentemente"
                ></Button>
            </div>
        </form>
    </Dialog>

    <Dialog 
        v-model:visible="mostrarConfirmacionEliminarCancion" 
        modal 
        header="Confirmar eliminación" 
        class="confirmarEliminacion"
    >
        <p>¿Estás seguro de que quieres eliminar la canción "{{ selectedCancion?.nombre }}" de la lista?</p>
        <p class="text-red-500">Esta acción no se puede deshacer.</p>
        <div class="flex justify-end gap-2 mt-4">
            <Button 
                type="button" 
                label="Cancelar" 
                id="cancelarButton"
                @click="mostrarConfirmacionEliminarCancion = false"
            ></Button>
            <Button 
                type="button" 
                label="Eliminar" 
                id="eliminarButton" 
                @click="confirmarEliminarCancion"
            ></Button>
        </div>
    </Dialog>

    <Dialog 
        v-model:visible="mostrarConfirmacionEliminarLista" 
        modal 
        header="Confirmar eliminación de lista" 
        class="confirmarEliminacion"
    >
        <p>¿Estás seguro de que quieres eliminar la lista "{{ lista?.nombre }}"?</p>
        <p class="text-red-500">Esta acción no se puede deshacer y eliminará permanentemente la lista.</p>
        <div class="flex justify-end gap-2 mt-4">
            <Button 
                type="button" 
                label="Cancelar" 
                class="boton_cancelar" 
                @click="mostrarConfirmacionEliminarLista = false"
            ></Button>
            <Button 
                type="button" 
                label="Eliminar" 
                severity="danger"
                id="eliminarButton"  
                @click="confirmarEliminarLista"
            ></Button>
        </div>
    </Dialog>

    <Toast />
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import axios from 'axios';
    import { authStore } from "@/store/auth.js";
    import { useLikeLista, useLikeCancion } from "@/composables/likes.js";
    import ListaCanciones from '@/components/listaCanciones.vue'
    import { usePlayer } from "@/composables/usePlayer.js"; // Importamos el composable
    import { useToast } from 'primevue/usetoast';

    const toast = useToast();
    const router = useRouter();
    const route = useRoute(); 

    const { isPlaying, playPlaylist, playSong, togglePlay } = usePlayer();

    const cancionParaCompartir = ref(null);
    const PreviewImagenLista = ref(null);
    const visible = ref(false);
    const isHovered = ref(false);
    const userPropio = authStore().user;
    const listaId = ref(route.params.id);
    const lista = ref(null);
    const canciones = ref(null);
    const nombreListaMod = ref('');
    const descripcionListaMod = ref('');
    const nuevaImagenLista = reactive({ portada: null });
    const mostrarConfirmacionEliminarLista = ref(false);
    const mostrarConfirmacionEliminarCancion = ref(false);
    const selectedCancion = ref(null);

    const { favoritos, toggleLike, esFavorito } = useLikeLista();
    const { cancionesFavoritas, cargarFavoritosCanciones, toggleLikeCancion, esFavoritaCancion } = useLikeCancion();
    const esFavoritoLista = ref(false);

    const toggleListaPlayback = () => {
        playPlaylist(canciones.value, 'lista', lista.value.id);
    };
    
    const reproducirCancion = (cancion) => {
     playSong(cancion, canciones.value, 'lista', lista.value.id);
    };

    const mostrarListaCanciones = (cancion) => {
        event.stopPropagation();
        cancionParaCompartir.value = cancion;
    };

    const likeLista = async (idLista, event) => {
        event.stopPropagation();
        await toggleLike(idLista);
        esFavoritoLista.value = !esFavoritoLista.value;
    };

    const likeCancion = async (idCancion, event) => {
        event.stopPropagation();
        await toggleLikeCancion(idCancion);
        await cargarFavoritosCanciones();
    };

    const getImageUrl = (lista) => {
        const image = lista?.portada;
        return new URL(image, import.meta.url).href;
    };

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
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lista actualizada correctamente', life: 3000 });
        } catch (error) {
            console.error("Error al actualizar la lista:", error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la lista', life: 3000 });
        }
    };

    const prepararEliminarLista = () => {
        visible.value = false;
        mostrarConfirmacionEliminarLista.value = true;
    };

    const confirmarEliminarLista = async () => {
        try {
            await axios.delete(`/api/listas/del/${listaId.value}`);
            
            mostrarConfirmacionEliminarLista.value = false;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lista eliminada correctamente', life: 3000 });
            router.push('/app/biblioteca');
        } catch (error) {
            console.error("Error al eliminar la lista:", error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la lista', life: 3000 });
            visible.value = true;
        }
    };

    const prepararEliminarCancion = (cancion) => {
        event.stopPropagation();
        selectedCancion.value = cancion;
        mostrarConfirmacionEliminarCancion.value = true;
    };

    const confirmarEliminarCancion = async () => {
        if (!selectedCancion.value) return;

        try {
            await axios.delete(`/api/listas/${listaId.value}/cancion/${selectedCancion.value.id}`);
            
            canciones.value = canciones.value.filter(c => c.id !== selectedCancion.value.id);
            mostrarConfirmacionEliminarCancion.value = false;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Canción eliminada correctamente', life: 3000 });
        } catch (error) {
            console.error("Error al eliminar la canción:", error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la canción', life: 3000 });
        }

        selectedCancion.value = null;
    };

    onMounted(async () => {
        try {
            const [listaResponse, cancionesResponse] = await Promise.all([
                axios.get(`/api/lista/${listaId.value}`),
                axios.get(`/api/listas/${listaId.value}/canciones`)
            ]);
            
            lista.value = listaResponse.data.data;
            canciones.value = cancionesResponse.data.data;
            nombreListaMod.value = lista.value.nombre;
            descripcionListaMod.value = lista.value.descripcion;
            
            esFavoritoLista.value = await esFavorito(listaId.value);
            await cargarFavoritosCanciones();
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
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

    .lista-banner {
        min-height: 180px;
        width: 100%;
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
        margin-right: 120px;
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

    #iconoBanner {
        font-size: 2.4rem;
    }

    @media (max-width: 500px) {
        .row {
            margin-right: 0 !important;
            margin-left: 0 !important;
            width: 100%;
            flex-direction: column;
        }

        /* Banner de la lista */
        .lista-banner {
            min-height: auto;
            padding: 15px 0;
            flex-direction: column;
            padding-bottom: 65px;
        }

        .detalles-lista {
            flex-direction: column;
            text-align: center;
            gap: 10px;
            width: 100%;
            position: relative;
            padding-bottom: 20px; /* Reduced from 70px */
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
            align-items: flex-start;
            padding: 0 10px;
        }

        .datos-detalles-lista h1 {
            max-width: 90vw;
            font-size: 1.5rem;
            margin: 5px 0;
            font-weight: bold;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: normal;
            text-overflow: ellipsis; 
        }

        .datos-detalles-lista span {
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }

        .banner-creador-nombre {
            font-size: 1rem;
        }

        .lista-descripcion {
            width: 90vw;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: normal;
            text-overflow: ellipsis;
            text-align: left;  

        }

        /* Posicionar el ícono de favorito o configuración */
        #iconoBanner {
            position: absolute;
            right: 15px; /* Position from right instead of left */
            top: 10px; /* Position from top */
            font-size: 2rem;
        }

        /* Botón de reproducción */
        .lista-banner-play {
            height: 70px;
            width: 70px;
            margin: 0; /* Remove margin */
            position: absolute;
            right: 15px; /* Position from right */
            bottom: 0; /* Position from bottom instead of top */
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

        .cancion-lista {
            width: 100%;
            display: flex;
            flex-direction: row;
        }

        .cancion-lista:has(.pi-times-circle) div {
            width: 90%; 
        }

        .cancion-lista:not(:has(.pi-times-circle)) div {
            width: 100%; 
        }

        .cancion-lista div {
            display: grid;
            grid-template-columns: 0.5fr 5fr 1fr 1fr 1fr 0.5fr;
            min-height: 50px;
            padding: 8px 0;
            width: auto;
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


    }

/* Ajustes específicos para pantallas muy pequeñas */
@media (max-width: 360px) {
    .lista-canciones-categorias {
        grid-template-columns: 0.5fr 2fr 1fr 1fr;
    }

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