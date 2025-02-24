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
            <div class="row cancion-popular" v-for="(cancion, index) in populares" :key="cancion.id">
                <span class="cancion-popular-span1 col-md-2">
                    <p class="num-cancion-popular">{{ index + 1 }}</p> 
                    <img src="" alt="imagen de portada del álbum de la canción">
                </span>
                <span class="cancion-popular-span2 col-md-5">
                    <p class="cancion-popular-nombre">{{ cancion.nombre }}</p>
                    <p class="cancion-popular-reproducciones">{{ cancion.reproducciones }} reproducciones</p>
                </span>
                <p class="col-md-2 duracion-cancion">{{ cancion.duracion }}</p>
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
            <div class="album col-md-2" v-for="album in albums" :key="album.id">
                <div class="album-img">
                    <img src="" alt="Imagen">
                </div>
                <div class="album-detalles">
                    <h4>{{ album.nombre }}</h4>
                    <p>Año: {{  new Date(album.created_at).getFullYear() }}</p>
                    <p>Duración: {{ album.duracion_total }}</p>
                    <p>Número de canciones: {{ album.num_canciones }}</p>
                </div>
            </div>
        </div>
    </div>


    <Dialog class="banner-config-modal" v-model:visible="visible" modal header="Modificar Perfil">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Actualiza tu información.</span>
        <div class="row">
            <div class="config-imagenes col-md-6">
                <!-- Imagen de perfil -->
                <div class="imagen-config-perfil">
                    <img :src="PreviewImagenPerfil || '/images/placeholder1.jpg'" class="estilo_imagen">
                    <input type="file" @change="manejarImagenPerfil" accept="image/*" ref="archivoImagen" class="añadir_archivo">  
                </div>
                <!-- Imagen de detalles -->
                <div class="imagen-config-detalles">
                    <img :src="PreviewImagenDetalles || '/images/placeholder1.jpg'" class="estilo_imagen">
                    <input type="file" @change="manejarImagenDetalles" accept="image/*" ref="archivoImagen" class="añadir_archivo">  
                </div>
            </div>
            <div class="col-md-6">
                <div class="flex items-center gap-4 mb-4">
                    <FloatLabel variant="on">
                        <InputText class="banner-config-input" id="username" v-model="value3" />
                        <label for="username">Nombre de Usuario</label>
                    </FloatLabel>
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <FloatLabel variant="on">
                        <Textarea class="banner-config-input" id="config-descripcion" v-model="value3" rows="5" cols="30" style="resize: none" />
                        <label for="descripcion">Descripción</label>
                    </FloatLabel>
                </div>
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Guardar" @click="visible = false"></Button>
        </div>
    </Dialog>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import { authStore } from "@/store/auth.js";

    const visible = ref(false);
    const userPropio = authStore().user;
    const isHovered = ref(false);
    const route = useRoute(); 
    const userId = ref(route.params.id);
    const user = ref(null);
    const albums = ref([]);
    const populares = ref([]);
    const PreviewImagenPerfil = ref(null);  
    const PreviewImagenDetalles = ref(null); 

    onMounted(async () => {
        try {
            const response = await axios.get(`/api/user/${userId.value}`);
            user.value = response.data; 
            
            const albumResponse = await axios.get(`/api/albumes/${userId.value}`);
            albums.value = albumResponse.data;
            
            const cancionResponse = await axios.get(`/api/canciones/populares/${userId.value}`);
            populares.value = cancionResponse.data;
        } catch (error) {
            console.error('Error fetching user or albums:', error);
        }
    });

    const albumDataPerfil = reactive({ portada: null });
    const albumDataDetalles = reactive({ portada: null });

    const manejarImagenPerfil = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (PreviewImagenPerfil.value) {
                URL.revokeObjectURL(PreviewImagenPerfil.value);
            }
            albumDataPerfil.portada = file;
            PreviewImagenPerfil.value = URL.createObjectURL(file); 
        }
    };

    const manejarImagenDetalles = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (PreviewImagenDetalles.value) {
                URL.revokeObjectURL(PreviewImagenDetalles.value);
            }
            albumDataDetalles.portada = file;
            PreviewImagenDetalles.value = URL.createObjectURL(file); 
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
        justify-content: flex-start; 
        gap: 20px;
    }

    .cancion-popular {
        min-height: 50px;
        display: flex;
        align-items: center;
        color: white;
        flex-wrap: nowrap; 
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
        gap: 8px;
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
        color: white !important;
    }

    .banner-config-input{
        background-color: #200834 !important;
        border: 1px solid #A855F7 !important;
        color: white !important;
    }

    #config-descripcion {
        height: 180px;
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