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
                        :class="esFavorita(cancion.id) ? 'pi pi-heart-fill col-md-1' : 'pi pi-heart col-md-1'"
                        @click="likeCancion(cancion.id, $event)"
                    ></i>
                    <i class="pi pi-plus col-md-1"  @click="mostrarListaCanciones(cancion)"></i>
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
        <h2>Álbums</h2>
        <div class="row gap-4">
            <router-link 
                class="album col-md-2" 
                v-for="album in albums" 
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
    import { ref, reactive, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import { authStore } from "@/store/auth.js";
    import { useLikeCancion } from "@/composables/likes.js";
    import { usePlayerStore } from "@/store/player";
    import ListaCanciones from '@/components/listaCanciones.vue'




    const player = usePlayerStore(); 
    const cancionParaCompartir = ref(null)
    const reproducirCancion = (cancion) => {
        const index = populares.value.findIndex(c => c.id === cancion.id);
        player.setPlaylist(populares.value); 
        player.playSong(cancion, index); 
    };

    const { favoritos, cargarFavoritos, toggleLike, esFavorita } = useLikeCancion();
    
    const visible = ref(false);
    const userPropio = authStore().user;
    const route = useRoute(); 
    const userId = ref(route.params.id);
    const user = ref(null);
    const albums = ref([]);
    const populares = ref([]);
    const PreviewImagenPerfil = ref(null);  
    const PreviewImagenDetalles = ref(null); 
    const nombreUsuarioMod = ref('');
    const descripcionUsuarioMod = ref('');

    onMounted(async () => {
        await fetchData(`/api/user/${userId.value}`, (data) => user.value = data);
        await fetchData(`/api/canciones/populares/${userId.value}`, (data) => populares.value = data);
        await fetchData(`/api/albumes/${userId.value}`, (data) => albums.value = data);
        await cargarFavoritos();

        nombreUsuarioMod.value = user.value?.name || '';  
        descripcionUsuarioMod.value = user.value?.descripcion || '';
    });

    // Función reutilizable para obtener datos de la API
    const fetchData = async (url, setter) => {
        try {
            const response = await axios.get(url);
            setter(response.data.data);
        } catch (error) {
            console.error(`Error al obtener los datos desde ${url}:`, error);
        }
    };
    const mostrarListaCanciones = (cancion) => {
        cancionParaCompartir.value = cancion
        }

    const likeCancion = async (idCancion, event) => {
        event.stopPropagation();
        await toggleLike(idCancion);
        await cargarFavoritos();
    };

    // Función generalizada para obtener URLs de imágenes
    const getImageUrl = (path) => {
        return path ? new URL(path, import.meta.url).href : '/images/placeholder1.jpg';
    };

    // Función generalizada para manejar imágenes
    const manejarImagen = (event, tipo) => {
        const file = event.target.files[0];
        if (file) {
            const previewKey = tipo === 'perfil' ? PreviewImagenPerfil : PreviewImagenDetalles;
            const imagenDataKey = tipo === 'perfil' ? imagenDataPerfil : imagenDataDetalles;

            // Revocar la URL anterior si existe
            if (previewKey.value) {
                URL.revokeObjectURL(previewKey.value);
            }

            // Crear nueva vista previa y asignar el archivo
            imagenDataKey.portada = file;
            previewKey.value = URL.createObjectURL(file);
        }
    };


    // Datos reactivos para las imágenes
    const imagenDataPerfil = reactive({ portada: null });
    const imagenDataDetalles = reactive({ portada: null });

    // Función para actualizar imágenes
    const actualizarImagen = async (imagenData, endpoint, key) => {
        if (imagenData.portada) {
            let formData = new FormData();
            formData.append('id', userPropio.id);
            formData.append('picture', imagenData.portada);

            try {
                const response = await axios.post(endpoint, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const nuevaImagen = response.data[key];
                if (nuevaImagen) {
                    imagenData.portada = nuevaImagen;
                    user.value[key] = nuevaImagen;
                }
            } catch (error) {
                console.error(`Error al actualizar la imagen en ${endpoint}:`, error);
            }
        }
    };

    // Función para guardar los cambios en el perfil
    const guardarCambios = async () => {
        if (imagenDataPerfil.portada) {
            await actualizarImagen(imagenDataPerfil, '/api/users/updateimg', 'avatar');
        }

        if (imagenDataDetalles.portada) {
            await actualizarImagen(imagenDataDetalles, '/api/users/updateimgdetalles', 'fotoDetalles');
        }


        if (nombreUsuarioMod.value !== user.value.name || descripcionUsuarioMod.value !== user.value.descripcion) {
            try {
                await axios.put(`/api/users/${userId.value}`, {
                    name: nombreUsuarioMod.value,
                    descripcion: descripcionUsuarioMod.value
                });

                user.value.name = nombreUsuarioMod.value;
                user.value.descripcion = descripcionUsuarioMod.value;
                userPropio.name = nombreUsuarioMod.value;
            } catch (error) {
                console.error("Error al actualizar los datos del usuario:", error);
            }
        }

        visible.value = false;
        await fetchUserData();

        // Forzar actualización de la imagen en la vista
        PreviewImagenPerfil.value = null;
        PreviewImagenDetalles.value = null;
    };



    // Función para refrescar los datos del usuario
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/api/user/${userId.value}`);
            user.value = response.data.data;
        } catch (error) {
            console.error('Error al actualizar los datos del usuario:', error);
            window.location.reload();
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
        height: 350px;
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
    }


    .album-detalles p {
        margin: 0;
        line-height: 1;
        color: white;
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