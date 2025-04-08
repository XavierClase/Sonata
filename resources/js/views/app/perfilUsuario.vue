<template>
    <div class="showDialog"></div>
    <div class="perfil-artista-banner">
        <span>
            <div class="perfil-artista-banner-img">
                <img :src="getImagePerfilUrl(user)" />
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

    <div class="perfil-artista-listas">
        <h2>Listas Creadas</h2>
        <div class="row gap-4">
            <router-link 
                class="album col-md-2" 
                v-for="lista in listasCreadas" 
                :key="lista.id" 
                :to="{ name: 'app.lista', params: {id: lista.id} }"
            >
                <div class="album-img">
                    <img :src="getImageListaUrl(lista)" />
                </div>
                <div class="album-detalles">
                    <h4>{{ lista.nombre }}</h4>
                    <p>Año: {{  new Date(lista.created_at).getFullYear() }}</p>
                    <p>Duración: {{ lista.duracion_total }}</p>
                    <p>Número de canciones: {{ lista.num_canciones }}</p>
                </div>
            </router-link>
        </div>
    </div>

    <div class="perfil-artista-listas" id="guardadas">
        <h2>Listas guardadas</h2>
        <div class="row gap-4">
            <router-link 
                class="album col-md-2" 
                v-for="lista in listasGuardadas" 
                :key="lista.id" 
                :to="{ name: 'app.lista', params: {id: lista.id} }"
            >
                <div class="album-img">
                    <img :src="getImageListaUrl(lista)" />
                </div>
                <div class="album-detalles">
                    <h4>{{ lista.nombre }}</h4>
                    <p>Año: {{  new Date(lista.created_at).getFullYear() }}</p>
                    <p>Duración: {{ lista.duracion_total }}</p>
                    <p>Número de canciones: {{ lista.num_canciones }}</p>
                </div>
            </router-link>
        </div>
    </div>

    <Dialog class="banner-config-modal" v-model:visible="visible" modal header="Modificar Perfil" appendTo=".showDialog">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Actualiza tu información.</span>
        <div class="row">
            <div class="config-imagenes col-md-6 mb-6">
                <!-- Imagen de perfil -->
                <div class="imagen-config-perfil">
                    <img :src="PreviewImagenPerfil || getImagePerfilUrl(user) || '/images/placeholder1.jpg'" class="estilo_imagen">
                    <input type="file" @change="manejarImagenPerfil" accept="image/*" ref="archivoImagen" class="añadir_archivo">  
                </div>

            </div>
            <div class="col-md-6">
                <div class="flex items-center gap-4 mb-3">
                    <FloatLabel variant="on">
                        <InputText class="banner-config-input" id="username" v-model="nombreUsuarioMod" />
                        <label for="username">Nombre de Usuario</label>
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

    const visible = ref(false);
    const userPropio = authStore().user;
    const isHovered = ref(false);
    const route = useRoute(); 
    const userId = ref(route.params.id);
    const user = ref(null);
    const albums = ref([]);
    const listasCreadas = ref([]);
    const listasGuardadas = ref([]);
    const populares = ref([]);
    const PreviewImagenPerfil = ref(null);  
    const PreviewImagenDetalles = ref(null); 
    const nombreUsuarioMod = ref('');
    const UsuarioMod = ref('');

    onMounted(async () => {
        try {
           
            const response = await axios.get(`/api/user/${userId.value}`);
            user.value = response.data.data; 
            nombreUsuarioMod.value = user.value.name; // Inicializa el nombre del usuario en el input
          
            const listasResponse = await axios.get(`/api/listas/${userId.value}`);
            listasCreadas.value = listasResponse.data.data;
            
          
            if (userPropio?.id === parseInt(userId.value)) {
                const listasGuardadasResponse = await axios.get('/api/mostrar/lista/likes');
                listasGuardadas.value = listasGuardadasResponse.data.data;
            }
        } catch (error) {
            console.error('Error fetching user or albums:', error);
        }
    });


    function getImageListaUrl(album) {
        let image = album.portada;
        return new URL(image, import.meta.url).href;
    }

    function getImagePerfilUrl(user) {
        let image = user?.avatar;
        return new URL(image, import.meta.url).href;
    }

    const imagenDataPerfil = reactive({ portada: null });
    const imagenDataDetalles = reactive({ portada: null });

    const manejarImagenPerfil = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (PreviewImagenPerfil.value) {
                URL.revokeObjectURL(PreviewImagenPerfil.value);
            }
            imagenDataPerfil.portada = file;
            PreviewImagenPerfil.value = URL.createObjectURL(file); 
        }
    };

    const manejarImagenDetalles = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (PreviewImagenDetalles.value) {
                URL.revokeObjectURL(PreviewImagenDetalles.value);
            }
            imagenDataDetalles.portada = file;
            PreviewImagenDetalles.value = URL.createObjectURL(file); 
        }
    };

    const guardarCambios = async () => {
        
        if (imagenDataPerfil.portada) {
            let formData = new FormData();
            formData.append('id', userPropio.id); 
            formData.append('picture', imagenDataPerfil.portada);

            try {
                const response = await axios.post('/api/users/updateimg', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data && response.data.media.length > 0) {
                    const nuevaImagen = response.data.media[0].original_url;
                    PreviewImagenPerfil.value = nuevaImagen;
                    user.value.avatar = nuevaImagen; // Actualiza el perfil localmente
                }

                console.log("Imagen actualizada correctamente", response.data);
            } catch (error) {
                console.error("Error al actualizar la imagen:", error);
            }
        }

        if (nombreUsuarioMod.value !== user.value.name) {
            try {
                console.log("Datos enviados:", { name: nombreUsuarioMod.value }); 
                const response = await axios.put(`/api/users/${userId.value}`, {
                    name: nombreUsuarioMod.value,
                });
                user.value.name = nombreUsuarioMod.value;
                userPropio.name = nombreUsuarioMod.value;  

                console.log("Nombre actualizado correctamente", response.data);
            } catch (error) {
                console.error("Error al actualizar el nombre:", error);
            }
        }

        visible.value = false; 
        await fetchUserData(); 
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/api/user/${userId.value}`);
            user.value = response.data.data;
        } catch (error) {
            console.error('Error al actualizar los datos del usuario:', error);
            window.location.reload(); // Recarga la página si no se pueden actualizar los datos
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
        width: 470px;
        border: 1px solid black;
    }

    .perfil-artista-listas {
        margin-top: 20px;
        padding-left: 33px;
        padding-bottom: 40px;
    }

    .perfil-artista-listas > div {
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

    /* Media query para pantallas de 500px o menos */
    @media (max-width: 500px) {
        .perfil-artista-banner {
            height: auto;
            padding: 20px 0;
            flex-direction: column;
        }

        .perfil-artista-banner span {
            flex-direction: column;
            text-align: center;
            width: 100%;
        }

        .perfil-artista-banner-img {
            margin-left: 0;
            margin: 0 auto;
        }

        .perfil-artista-banner h1 {
            font-size: 1.5rem;
            margin-top: 10px;
        }

        .pi-cog {
            position: absolute;
            top: 10px;
            right: 10px;
            margin: 0;
        }

        .pi-share-alt {
            padding: 15px;
            font-size: 1.5rem;
            display: block;
            text-align: center;
        }

        h2 {
            font-size: 1.8rem;
            text-align: center;
        }

        .perfil-artista-listas {
            padding-left: 10px;
            padding-right: 10px;
        }

        .row.gap-4 {
            justify-content: center;
            gap: 15px !important;
        }

        .album {
            width: 200px;
            height: 300px;
            margin: 0 5px 15px 5px;
        }

        .album-detalles h4 {
            font-size: 1rem;
        }

        .album-detalles p {
            font-size: 0.8rem;
        }

        .banner-config-modal {
            width: 90% !important;
            margin: 0 auto;
        }

        .config-imagenes {
            align-items: center;
        }

        #guardadas {
            padding-bottom: 100px;
        }
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

    .imagen-config-perfil {
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
    
    /* Media query para el estilo global del modal en pantallas pequeñas */
    @media (max-width: 500px) {
        .banner-config-modal {
            width: 95% !important;
            max-width: 95% !important;
        }
        
        .banner-config-modal .p-dialog-content {
            padding: 1rem !important;
        }
        
        .banner-config-modal .row {
            flex-direction: column;
        }
        
        .banner-config-modal .col-md-6 {
            width: 100%;
        }
        
        .banner-config-input {
            width: 100% !important;
        }
        
        .flex.justify-end {
            justify-content: center !important;
        }
        
        .config-imagenes {
            align-items: center;
            margin-bottom: 1rem;
        }
    }
</style>